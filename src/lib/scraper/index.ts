import { fetchSyllabusDom } from "./client"; // DOM取得用のHTTPクライアント関数をインポート
import { saveJson } from "./fileWriter"; // JSONファイル保存ユーティリティをインポート
import { getFacultiesAndDepartments, getCourseCategories, getCourses, parseSyllabusDetail } from "./parser"; // ページ解析関数群をインポート
import { UrlString } from "./types"; // URL文字列の型をインポート

const BASE_URL = "https://syllabus.u-hyogo.ac.jp/slResult/2025/japanese/" as UrlString; // スクレイピング開始用のベースURLを型アサーションして定義

const run = async () => { // 非同期スクレイピング処理のエントリポイントを定義
  const fDom = await fetchSyllabusDom(BASE_URL); // ベースURLからDOMを取得して結果を受け取る
  if (!fDom.ok) return console.error(fDom.error); // 取得失敗ならエラーをログに出して終了

  const facultiesAndDepartments = getFacultiesAndDepartments(fDom.value, BASE_URL); // 取得したDOMから学部一覧を解析する
  if (!facultiesAndDepartments.ok) return; // 解析に失敗したら終了
  await saveJson("1_faculties.json", facultiesAndDepartments.value); // 学部一覧をJSONファイルとして保存

  const target = facultiesAndDepartments.value.faculties[0]; // 最初の学部をターゲットとして選ぶ
  const cDom = await fetchSyllabusDom(target.url); // ターゲット学部のURLからDOMを取得
  if (!cDom.ok) return; // 取得失敗なら終了

  const categories = getCourseCategories(cDom.value, BASE_URL); // 学部ページから講義カテゴリ一覧を解析
  if (!categories.ok) return; // 解析失敗なら終了
  await saveJson("2_categories.json", categories.value); // カテゴリ一覧をJSONファイルとして保存
  
  console.log("Scraping completed and files saved."); // 完了メッセージを出力
};

void run(); // エントリポイントを即座に実行（戻り値を無視）