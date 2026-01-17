import { JSDOM } from "jsdom";
import fetch from "node-fetch";
import fs from "fs";
import path from "path";
import { LectureFactory } from "../src/domain/syllabus/LectureFactory";
import { Lecture } from "../src/domain/syllabus/Lecture";

// --- 定数とユーティリティの定義 (エラー解消用) ---
const YEAR = 2025;
const BASE_URL = `https://syllabus.u-hyogo.ac.jp/slResult/${YEAR}/japanese/`;


//指定したURLのHTMLを取得する関数
const fetchData = async (url: string): Promise<string> => {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Fetch failed: ${res.statusText}`);
  return await res.text();
};

//講義詳細ページの解析

const parseSyllabusPage = (html: string, url: string) => {
  const doc = new JSDOM(html).window.document;
  const area = doc.querySelector(".syllabusArea");
  if (!area) return null;
  const getValueByLabel = (label: string): string => {
    const headers = Array.from(area.querySelectorAll(".colHeader"));
    const target = headers.find(h => h.textContent?.trim() === label);
    // ラベルの次の要素を取得
    return target?.nextElementSibling?.textContent?.trim() || "";
  };
  // DOMツリー解析に基づいた生データの抽出
  const rawName = getValueByLabel("授業科目名");
  const rawCategory = getValueByLabel("科目区分");
  const rawGrade = getValueByLabel("学年");
  const rawNumbering = getValueByLabel("ﾅﾝﾊﾞﾘﾝｸﾞｺｰﾄﾞ");
  const rawUnitsStr = getValueByLabel("単位数");
  const rawYearSemester = getValueByLabel("開講時期");
  const rawTeacher = getValueByLabel("担当教員");
  // データの加工
  const yearNum = parseInt(rawYearSemester.split("年度")[0]) || YEAR;
  const semesterStr = rawYearSemester.split("年度")[1] || "";
  const unitsNum = parseFloat(rawUnitsStr.replace("単位", "")) || 0;

  // Factoryによるバリデーション付き生成
  return LectureFactory.create({
    id: rawNumbering,
    name: rawName,
    teacher: rawTeacher,
    year: yearNum,
    semester: semesterStr,
    units: unitsNum,
    gread: rawGrade,
    category: rawCategory,
    url: url,
    numberingCode: rawNumbering
  });
};

//メイン実行関数
const run = async () => {
  console.log("🚀 スクレイピングを開始します...");
  const syllabusResults: Lecture["props"][] = [];

  try {
    // 1. 学部リストの取得
    const topHtml = await fetchData(BASE_URL);
    const topDom = new JSDOM(topHtml);
    const facultyLinks = Array.from(topDom.window.document.querySelectorAll("#navi_gakubu a[href]"));
    const facultyUrl = new URL(facultyLinks[3].getAttribute("href")!, BASE_URL).toString();

    // 2. 講義一覧(LessonIndex)へのリンクを取得
    const catHtml = await fetchData(facultyUrl);
    const catDom = new JSDOM(catHtml);
    const catLink = Array.from(catDom.window.document.querySelectorAll("a[href]"))
      .find(a => a.getAttribute("href")?.includes("LessonIndexHtml"));
    
    if (!catLink) throw new Error("LessonIndexが見つかりません");
    const lessonIndexUrl = new URL(catLink.getAttribute("href")!.replace(/^\.\.\//, ""), BASE_URL).toString();

    // 3. 各講義の詳細URLを取得
    const indexHtml = await fetchData(lessonIndexUrl);
    const indexDom = new JSDOM(indexHtml);
    const syllabusLinks = Array.from(indexDom.window.document.querySelectorAll("td > a[href]"));

    console.log(`🔍 ${syllabusLinks.length}件の講義を解析中...`);

    for (const link of syllabusLinks.slice(0, 10)) { // テスト用に10件に制限
      const href = link.getAttribute("href")!.replace(/^(\.\.\/)+/, "");
      const detailUrl = new URL(href, BASE_URL).toString();
      
      const detailHtml = await fetchData(detailUrl);
      const lectureResult = parseSyllabusPage(detailHtml, detailUrl);
      
      if (lectureResult) {
        // --- neverthrow の Result 型を正しく扱う (matchを使用) ---
        lectureResult.match(
          (lecture) => {
            console.log(`✅ 成功: ${lecture.props.name}`); // 修正: プロパティアクセス
            syllabusResults.push(lecture.props);
          },
          (err) => {
            console.warn(`⚠️ 解析失敗 (${detailUrl}):`, err.cause.map(e => e.field).join(", "));
          }
        );
      }
    }

    // 4. 保存
    const dir = path.join(process.cwd(), "src/data");
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, "syllabus.json"), JSON.stringify(syllabusResults, null, 2));

    console.log(`✨ 完了！ ${syllabusResults.length}件を保存しました。`);

  } catch (error) {
    console.error("❌ 重大なエラー:", error);
  }
};

run();