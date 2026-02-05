import { fetchSyllabusDom } from "./client"; // DOM取得用
import { saveJson } from "./fileWriter"; // JSON保存用（自動フォルダ作成機能付き）
import { writeErrorLog } from "./logger"; // エラーログ用
import { getFacultiesAndDepartments } from "./parsers/faculty"; // 学部解析
import { getCourseCategories } from "./parsers/category"; // カテゴリー階層解析
import { getLectures } from "./parsers/lecture"; // 授業一覧解析
import { getSyllabusDetail } from "./parsers/syllabus"; // 授業詳細解析
import { CourseCategory, Course, Faculty, Department, UrlString } from "./types";

const BASE_URL = "https://syllabus.u-hyogo.ac.jp/slResult/2025/japanese/" as UrlString;

/**
 * 4. 最深部：個別の授業詳細を解析して保存
 */
const scrapeAndSaveSyllabusDetail = async (course: Course, folderPath: string): Promise<void> => {
  const result = await fetchSyllabusDom(course.url);
  if (!result.ok) {
    await writeErrorLog(result.error, `詳細取得失敗: ${course.name}`);
    return;
  }

  // URLも含めて詳細を解析（Result型で安全に！）
  const detail = getSyllabusDetail(result.value, course.url);
  if (!detail.ok) {
    await writeErrorLog(detail.error, `詳細解析失敗: ${course.name}`);
    return;
  }

  // 保存パス: 学部/階層.../details/授業名.json
  const safeTitle = course.name.replace(/[/\\?%*:|"<>]/g, "_");
  const filePath = `${folderPath}/details/${safeTitle}.json`;

  await saveJson(filePath, detail.value);
  console.log(`      └─ [Detail] ${course.name} を保存しました (${filePath})`);
};

/**
 * 3. 授業一覧を取得し、各詳細ページへドリルダウン
 */
const scrapeAndSaveLectures = async (category: CourseCategory, facultyName: string): Promise<void> => {
  const result = await fetchSyllabusDom(category.url);
  if (!result.ok) {
    await writeErrorLog(result.error, `一覧取得失敗: ${category.name}`);
    return;
  }

  const lecturesResult = getLectures(result.value, category.url);
  if (!lecturesResult.ok) {
    await writeErrorLog(lecturesResult.error, `一覧解析失敗: ${category.name}`);
    return;
  }

  // フォルダ階層の組み立て
  const safeFaculty = facultyName.replace(/[/\\?%*:|"<>]/g, "_");
  const safeHierarchy = category.path.map(p => p.replace(/[/\\?%*:|"<>]/g, "_")).join("/");
  const folderPath = `${safeFaculty}/${safeHierarchy}`;

  // 授業リスト(JSON)の保存
  const listFileName = `${folderPath}/3_lectures_${category.name.replace(/[/\\?%*:|"<>]/g, "_")}.json`;
  await saveJson(listFileName, lecturesResult.value);
  console.log(`    └ ${category.name} のリストを保存 (${lecturesResult.value.lectures.length}件)`);

  // 各授業の詳細を順番に回るわよ
  for (const course of lecturesResult.value.lectures) {
    // サーバーに優しく、0.5秒待機
    await new Promise(resolve => setTimeout(resolve, 500));
    await scrapeAndSaveSyllabusDetail(course, folderPath);
  }
};

/**
 * 2. カテゴリー階層（大分類・中分類）を解析
 */
const scrapeAndSaveForElement = async (item: Faculty | Department): Promise<void> => {
  const result = await fetchSyllabusDom(item.url);
  if (!result.ok) {
    await writeErrorLog(result.error, `カテゴリ取得失敗: ${item.name}`);
    return;
  }

  const categories = getCourseCategories(result.value, item.url);
  if (!categories.ok) {
    await writeErrorLog(categories.error, `カテゴリ解析失敗: ${item.name}`);
    return;
  }

  // 各カテゴリーをループして授業一覧へ
  for (const category of categories.value.courseCategories) {
    await scrapeAndSaveLectures(category, item.name);
  }
};

/**
 * 1. エントリポイント：学部一覧から開始
 */
const run = async () => {
  console.log("スクレイピングを開始します...");
  
  const fDom = await fetchSyllabusDom(BASE_URL);
  if (!fDom.ok) {
    await writeErrorLog(fDom.error, "トップページの取得に失敗");
    return;
  }

  const facultiesAndDepartments = getFacultiesAndDepartments(fDom.value, BASE_URL);
  if (!facultiesAndDepartments.ok) {
    await writeErrorLog(facultiesAndDepartments.error, "学部一覧の解析失敗");
    return;
  }
  
  // 基礎リストを保存
  await saveJson("faculties/1_faculties_and_departments.json", facultiesAndDepartments.value);

  // 全学部を順番に処理
  for (const faculty of facultiesAndDepartments.value.faculties) {
    await scrapeAndSaveForElement(faculty);
  }
  
  console.log("すべてのデータの保存が完了しました。");
};

void run();