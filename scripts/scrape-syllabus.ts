import { JSDOM } from "jsdom";
import fetch from "node-fetch";
import fs from "fs";
import path from "path";

const YEAR = 2025;
const BASE_URL = `https://syllabus.u-hyogo.ac.jp/slResult/${YEAR}/japanese/`;

const fetchData = async (url: string): Promise<string> => {
  const res = await fetch(url);
  return await res.text();
};

const parseSyllabusPage = (html: string, url: string) => {
  const dom = new JSDOM(html);
  const doc = dom.window.document;
  const getT = (s: string) => doc.querySelector(s)?.textContent?.trim() || "";

  // index.ts のセレクタ
  const name = getT("#wrap > div.page-body > table > tbody > tr > td.syllabus-info > div > div:nth-child(1) > div:nth-child(2) > div");
  if (!name) return null;

  return {
    name,
    numberingCode: getT("#wrap > div.page-body > table > tbody > tr > td.syllabus-info > div > div:nth-child(4) > div:nth-child(2) > div"),
    teacher: getT("td.side_box div:nth-child(2)").replace("教員名 ： ", ""),
    url
  };
};

const run = async () => {
  try {
    // 1. 学部リスト取得
    const topHtml = await fetchData(BASE_URL);
    const topDom = new JSDOM(topHtml);
    const facultyLinks = Array.from(topDom.window.document.querySelectorAll("#navi_gakubu a[href]"));
    const facultyUrl = new URL(facultyLinks[3].getAttribute("href")!, BASE_URL).toString();

    // 2. 講義カテゴリリスト取得 (LessonIndexHtml へのリンクを探す)
    const catHtml = await fetchData(facultyUrl);
    const catDom = new JSDOM(catHtml);
    // index.ts のロジック: a[href] のうち "LessonIndexHtml" を含むものを探す
    const catLink = Array.from(catDom.window.document.querySelectorAll("a[href]"))
      .find(a => a.getAttribute("href")?.includes("LessonIndexHtml"));

    if (!catLink) throw new Error("講義一覧(LessonIndex)へのリンクが見つかりません");
    
    // index.ts の slice(3) 相当の処理
    const indexHref = catLink.getAttribute("href")!.replace(/^\.\.\//, "");
    const lessonIndexUrl = new URL(indexHref, BASE_URL).toString();
    console.log(`📂 講義一覧ページを取得中: ${lessonIndexUrl}`);

    // 3. 講義一覧から詳細URLを取得
    const indexHtml = await fetchData(lessonIndexUrl);
    const indexDom = new JSDOM(indexHtml);
    const syllabusLinks = Array.from(indexDom.window.document.querySelectorAll("td > a[href]"));

    const results = [];
    console.log(`🔍 ${syllabusLinks.length}件のリンクを解析します...`);

    for (const link of syllabusLinks.slice(0, 5)) {
      // 詳細ページへのパス解決 (../../slSyllabus/... 対策)
      const href = link.getAttribute("href")!.replace(/^(\.\.\/)+/, "");
      const detailUrl = new URL(href, BASE_URL).toString();
      
      const detailHtml = await fetchData(detailUrl);
      const data = parseSyllabusPage(detailHtml, detailUrl);
      if (data) {
        console.log(`✅ 取得: ${data.name}`);
        results.push(data);
      }
    }

    const dir = path.join(process.cwd(), "src/data");
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, "syllabus.json"), JSON.stringify(results, null, 2));
    console.log("✨ 完了");
  } catch (e) { console.error(e); }
};

run();