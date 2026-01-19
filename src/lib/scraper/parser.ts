import { Result, success, failure, ScraperError } from "../types";
import { Faculty, UrlString } from "./types";

/**
 * 受け取ったDOMから学部一覧を抽出する（純粋なロジック）
 */
export const getFaculties = (doc: Document, baseUrl: string): Result<Faculty[], ScraperError> => {
  const nodes = doc.querySelectorAll("#navi_gakubu a");
  if (nodes.length === 0) {
    return failure({ tag: "DomNotFoundError", cause: "学部リンクが見つかりませんでした" });
  }

  const faculties = Array.from(nodes).map((node) => {
    const anchor = node as HTMLAnchorElement;
    return {
      name: anchor.textContent?.trim() ?? "名称不明",
      url: new URL(anchor.href, baseUrl).toString() as UrlString,
    };
  });

  return success(faculties);
};

// ... その他の getCourseCategories, getCourses 等の解析関数