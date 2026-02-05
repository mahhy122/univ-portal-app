import { Result, success, failure } from "../../types";
import { Course, ScraperError } from "../types";
import { extractValidUrl } from "./utils";

export const getLectures = (doc: Document, baseUrl: string): Result<{ lectures: Course[] }, ScraperError> => {
  const selector = ".index_list5 table td a, .index_list6 table td a";
  const nodes = doc.querySelectorAll(selector);

  // 取得ゼロなら明示的にエラーを返す
  if (nodes.length === 0) {
    return failure({
      tag: "DomNotFoundError",
      cause: `授業リストが見つかりません。セレクタ: ${selector}`
    });
  }

  const lectures: Course[] = [];
  for (const node of Array.from(nodes)) {
    const name = node.textContent?.trim();
    if (name) {
      const urlResult = extractValidUrl(node, baseUrl); 
      if (urlResult.ok) {
        lectures.push({ name, url: urlResult.value });
      }
    }
  }
  return success({ lectures });
};