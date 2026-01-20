import { Result, success, failure } from "../types"; // 処理結果を表す型と成功/失敗を生成するヘルパーをインポート
import { Faculty, Department, CourseCategory, Course, SyllabusDetail, UrlString, ScraperError } from "./types"; // スクレイパー固有の型定義をインポート

const extractValidUrl = (element: Element, baseUrl: string): Result<UrlString, ScraperError> => { // 有効なURLを抽出するユーティリティ関数
  const anchor = element as HTMLAnchorElement; // 要素をアンカー要素としてキャスト
  const href = anchor.getAttribute("href"); // href属性を取得
  if (!href){
    return failure({
      tag: "ParseError",
      cause: "リンクのhref属性が存在しないです."
    });
  }else if (href.trim() === "") {
    return failure({
      tag: "ParseError",
      cause: "リンクのhref属性が空文字です."
    });
  }
  return success(new URL(href, baseUrl).toString() as UrlString); // 相対URLを絶対URLに変換してUrlString型として返す
};

export const getFacultiesAndDepartments = (
  doc: Document,
  baseUrl: string
): Result<{ faculties: Faculty[]; departments: Department[] }, ScraperError> => { // 学部一覧をDOMから抽出する関数をエクスポート
  const nodes = doc.querySelectorAll("#navi_gakubu a"); // ナビゲーションの学部リンク要素を全て取得
  
  const initial = {faculties: [] as Faculty[], departments: [] as Department[]}; // 初期値として空の学部・学科配列を用意
  const result = Array.from(nodes).reduce((acc, node) => { // 各リンク要素を処理してFacultyオブジェクト配列を生成
    const urlResult = extractValidUrl(node, baseUrl); // 有効なURLを抽出
    if (urlResult.ok) { // URL抽出が成功した場合のみ処理を続行
      const name = node.textContent?.trim(); // テキストを取得してトリム
      const item = {
        name,
        url: urlResult.value
      }
      if (name.endsWith("部")) {
        acc.faculties.push(item);
      } else if (name.endsWith("科")) {
        acc.departments.push(item);
      }
    }
    return acc;
  }, initial);

  if (result.faculties.length === 0) {
    return failure({
      tag: "DomNotFoundError",
      cause: "学部が見つかりません"
    });
  }
  if (result.departments.length === 0) {
    return failure({
      tag: "DomNotFoundError",
      cause: "学科が見つかりません"
    });
  }

  return success(result);
};

export const getCourseCategories = (doc: Document, baseUrl: string): Result<CourseCategory[], ScraperError> => { // カテゴリ一覧をDOMから抽出する関数
  const nodes = doc.querySelectorAll(".table-index td a"); // テーブルインデックス内のカテゴリリンクを全取得
  if (nodes.length === 0) return failure({ tag: "DomNotFoundError", cause: "カテゴリーが見つかりません" }); // 見つからなければ失敗を返す

  return success(Array.from(nodes).map((node) => { // 各リンク要素を処理して配列として返す
    const anchor = node as HTMLAnchorElement; // アンカー要素としてキャスト
    return {
      name: anchor.textContent?.trim() ?? "名称不明", // カテゴリ名を取得、なければ代替テキスト
      url: new URL(anchor.href, baseUrl).toString() as UrlString, // 絶対URLに変換して格納
    };
  }));
};

export const getCourses = (doc: Document, baseUrl: string): Result<Course[], ScraperError> => { // 授業一覧をDOMから抽出する関数
  const nodes = doc.querySelectorAll("td > a[href]"); // td直下のhrefを持つアンカー要素を全て取得
  if (nodes.length === 0) return failure({ tag: "DomNotFoundError", cause: "授業リストが見つかりません" }); // 見つからなければ失敗を返却

  return success(Array.from(nodes).map((node) => { // 各授業リンクを処理してCourseオブジェクト配列を返す
    const anchor = node as HTMLAnchorElement; // アンカーにキャストしてテキストとURLを抽出
    return {
      name: anchor.textContent?.trim() ?? "名称不明", // 授業名を取得、なければ代替名
      url: new URL(anchor.href, baseUrl).toString() as UrlString, // 絶対URLに変換
    };
  }));
};

export const parseSyllabusDetail = (doc: Document): Result<SyllabusDetail, ScraperError> => { // シラバス詳細ページを解析する関数
  const title = doc.querySelector(".syllabus-title")?.textContent?.trim(); // 講義タイトルを取得してトリム
  if (!title) return failure({ tag: "ParseError", cause: "講義名が取得できません" }); // タイトルがなければ解析失敗を返す

  return success({
    title, // 取得したタイトルを設定
    instructor: doc.querySelector(".instructor-name")?.textContent?.trim() ?? "未定義", // 担当教員名を取得、なければ既定値
    semester: "2025年度", // 固定で学期情報を設定（必要なら動的取得に変更可）
    credits: 2 // 固定で単位数を設定（必要に応じて解析ロジックを追加）
  });
};