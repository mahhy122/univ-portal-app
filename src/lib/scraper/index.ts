import { fetchSyllabusDom } from "./client"; // DOM取得用のHTTPクライアント関数をインポート
import { saveJson } from "./fileWriter"; // JSONファイル保存ユーティリティをインポート
import { writeErrorLog } from "./logger";
import { getFacultiesAndDepartments} from "./parsers/faculty"; // ページ解析関数群をインポート
import { getCourseCategories } from "./parsers/category";
import { getLectures } from "./parsers/lecture";
import { CourseCategory } from "./types";
import { UrlString,Faculty, Department } from "./types"; // URL文字列の型をインポート

const BASE_URL = "https://syllabus.u-hyogo.ac.jp/slResult/2025/japanese/" as UrlString; // スクレイピング開始用のベースURLを型アサーションして定義
const scrapeAndSaveForElement = async (item: Faculty | Department): Promise<void> => {
  const cDom = await fetchSyllabusDom(item.url);
  if (!cDom.ok) {
    await writeErrorLog(cDom.error, `fetchSyllabusDom: ${item.name} (${item.url})`);
    return;
  }

  const categories = getCourseCategories(cDom.value, item.url);
  if (!categories.ok) {
    await writeErrorLog(categories.error, `getCourseCategories: ${item.name}`);
    return;
  }

  const fileName = `categories/2_categories_${item.name}.json`.replace(/[/\\?%*:|"<>]/g, (match) => 
    match === '/' ? '/' : '_'
  );
  await saveJson(fileName, categories.value);
  console.log(`  └ ${item.name} のカテゴリーを保存しました (${categories.value.courseCategories.length}件)`);

  // 各カテゴリーの授業一覧を順番に取得
  for (const category of categories.value.courseCategories) {
    await scrapeAndSaveLectures(category);
  }
};

const scrapeAndSaveLectures = async (category: CourseCategory): Promise<void> => {
  // 1. 授業一覧ページのDOMを取得
  const lDom = await fetchSyllabusDom(category.url);
  if (!lDom.ok) {
    await writeErrorLog(lDom.error, `fetchSyllabusDom (Lectures): ${category.name}`);
    return;
  }

  // 2. 授業一覧を解析（baseUrlとしてcategory.urlを渡す）
  const lectures = getLectures(lDom.value, category.url);
  if (!lectures.ok) {
    await writeErrorLog(lectures.error, `getLectures: ${category.name}`);
    return;
  }

  // 3. lectures フォルダに保存
  const fileName = `lectures/3_lectures_${category.name}.json`.replace(/[/\\?%*:|"<>]/g, (match) => 
    match === '/' ? '/' : '_'
  );
  await saveJson(fileName, lectures.value);
  console.log(`    └ ${category.name} の授業一覧を保存しました (${lectures.value.lectures.length}件)`);
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

  // 最初の学部の講義カテゴリ一覧を取得・解析・保存
  const target = facultiesAndDepartments.value.faculties[0]; // 最初の学部をターゲットとして選ぶ
  if (!target) {
    await writeErrorLog({
      tag: "ParseError",
      cause: "学部が存在しません"
    }, "最初の学部が存在しません");
    console.error("学部が存在しません");
    return;
  }
  const cDom = await fetchSyllabusDom(target.url); // ターゲット学部のURLからDOMを取得
  if (!cDom.ok) {
    await writeErrorLog(cDom.error, `fetchSyllabusDom(${target.url})`);
    return;
  }

  const categories = getCourseCategories(cDom.value, target.url); // 学部ページから講義カテゴリ一覧を解析
  if (!categories.ok) {
    await writeErrorLog(categories.error, "カテゴリ一覧の解析に失敗しました");
    return;
  }

  const fileName = `2_categories_${target.name}.json`.replace(/[/\\?%*:|"<>]/g, "_"); // 学部名をファイル名に含める（不正文字を置換）
  await saveJson(fileName, categories.value); // カテゴリ一覧をJSONファイルとして保存
  console.log(`学部: ${facultiesAndDepartments.value.faculties.length}件, 学科: ${facultiesAndDepartments.value.departments.length}件 を検出しました。`);
  
  for (const faculty of facultiesAndDepartments.value.faculties) {
    await scrapeAndSaveForElement(faculty); // 各学部のURLからDOMを取得（ここで更なる解析や保存を行うことも可能）
  }
  console.log("Scraping completed and files saved."); // 完了メッセージを出力
};

void run(); // エントリポイントを即座に実行（戻り値を無視）