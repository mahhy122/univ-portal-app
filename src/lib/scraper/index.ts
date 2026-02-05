import { fetchSyllabusDom } from "./client"; // DOM取得用のHTTPクライアント関数をインポート
import { saveJson } from "./fileWriter"; // JSONファイル保存ユーティリティをインポート
import { writeErrorLog } from "./logger";
import { getFacultiesAndDepartments} from "./parsers/faculty"; // ページ解析関数群をインポート
import { getCourseCategories } from "./parsers/category";
import { getLectures } from "./parsers/lecture";
import { getSyllabusDetail } from "./parsers/syllabus"; // 追加：詳細パーサー
import { CourseCategory, Course } from "./types";
import { UrlString, Faculty, Department } from "./types"; // URL文字列の型をインポート

const BASE_URL = "https://syllabus.u-hyogo.ac.jp/slResult/2025/japanese/" as UrlString; // スクレイピング開始用のベースURLを型アサーションして定義

/**
 * 追加：個別の授業詳細（シラバス中身）を取得して保存する関数
 */
const scrapeAndSaveSyllabusDetail = async (course: Course, folderPath: string): Promise<void> => {
  // 1. シラバス詳細ページのDOMを取得
  const result = await fetchSyllabusDom(course.url);
  if (!result.ok) {
    await writeErrorLog(result.error, `fetchSyllabusDom (Detail): ${course.name}`);
    return;
  }

  // 2. 詳細内容を解析（scraping-2のロジックを移植したパーサーを使用）
  const detailResult = getSyllabusDetail(result.value);
  if (!detailResult.ok) {
    await writeErrorLog(detailResult.error, `getSyllabusDetail: ${course.name}`);
    return;
  }

  // 3. フォルダパス/details/授業名.json として保存
  const safeTitle = course.name.replace(/[/\\?%*:|"<>]/g, "_");
  const filePath = `${folderPath}/details/${safeTitle}.json`;

  await saveJson(filePath, detailResult.value);
  console.log(`      └─ [Detail] ${course.name} を保存しました`);
};

/**
 * 授業一覧をスクレイピングし、さらに詳細ページへドリルダウンする関数
 */
const scrapeAndSaveLectures = async (category: CourseCategory, facultyName: string): Promise<void> => {
  // 1. 授業一覧ページのDOMを取得
  const lDom = await fetchSyllabusDom(category.url);
  if (!lDom.ok) {
    await writeErrorLog(lDom.error, `fetchSyllabusDom (Lectures): ${category.name}`);
    return;
  }

  // 2. 授業一覧を解析
  const lectures = getLectures(lDom.value, category.url);
  if (!lectures.ok) {
    await writeErrorLog(lectures.error, `getLectures: ${category.name}`);
    return;
  }

  // --- 階層構造の再現ロジック ---
  const safeFacultyName = facultyName.replace(/[/\\?%*:|"<>]/g, "_");
  // category.path（["全学共通科目", "自主自律支援科目"]など）をスラッシュで繋いでパス化
  const hierarchyPath = category.path.map(p => p.replace(/[/\\?%*:|"<>]/g, "_")).join('/');
  const folderPath = `${safeFacultyName}/${hierarchyPath}`;

  // 3. 授業一覧(リスト)を保存
  const listFileName = `${folderPath}/3_lectures_${category.name.replace(/[/\\?%*:|"<>]/g, "_")}.json`;
  await saveJson(listFileName, lectures.value);
  console.log(`    └ ${category.name} のリストを保存 (${lectures.value.lectures.length}件)`);

  // --- 各授業の詳細ページを順番に取得 ---
  for (const course of lectures.value.lectures) {
    // サーバーに負荷をかけないよう0.5秒待機（scraping-2のクローラー作法）
    await new Promise(resolve => setTimeout(resolve, 500));
    await scrapeAndSaveSyllabusDetail(course, folderPath);
  }
};

const scrapeAndSaveForElement = async (item: Faculty | Department): Promise<void> => {
  // 1. カテゴリー一覧ページのDOMを取得
  const cDom = await fetchSyllabusDom(item.url);
  if (!cDom.ok) {
    await writeErrorLog(cDom.error, `fetchSyllabusDom: ${item.name} (${item.url})`);
    return;
  }

  // 2. カテゴリー一覧を解析（階層パス付き）
  const categories = getCourseCategories(cDom.value, item.url);
  if (!categories.ok) {
    await writeErrorLog(categories.error, `getCourseCategories: ${item.name}`);
    return;
  }

  // 各カテゴリーの授業一覧、およびその詳細を順番に取得
  for (const category of categories.value.courseCategories) {
    await scrapeAndSaveLectures(category, item.name);
  }
};

const run = async () => { // 非同期スクレイピング処理のエントリポイントを定義
  // 学部DOMを取得
  const fDom = await fetchSyllabusDom(BASE_URL); // ベースURLからDOMを取得して結果を受け取る
  if (!fDom.ok) {
    await writeErrorLog(fDom.error, `fetchSyllabusDom(BASE_URL): ${BASE_URL}`);
    return console.error(fDom.error);
  }

  // 学部・学科を解析
  const facultiesAndDepartments = getFacultiesAndDepartments(fDom.value, BASE_URL); // 取得したDOMから学部一覧を解析する
  if (!facultiesAndDepartments.ok){ // 解析に失敗したら終了
    await writeErrorLog(
      facultiesAndDepartments.error, "学部・学科の解析に失敗しました");
    return;
  }
  
  // 学部・学科情報をJSONファイルとして保存
  await saveJson("faculties/1_faculties_and_departments.json", facultiesAndDepartments.value);

  console.log(`学部: ${facultiesAndDepartments.value.faculties.length}件 を検出しました。処理を開始します。`);
  
  for (const faculty of facultiesAndDepartments.value.faculties) {
    await scrapeAndSaveForElement(faculty); // 各学部の解析・保存を実行
  }
  console.log("Scraping completed and files saved."); // 完了メッセージを出力
};

void run(); // エントリポイントを即座に実行（戻り値を無視）