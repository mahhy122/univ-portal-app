import { Result, success } from "../../types";
import { Course, ScraperError } from "../types";
import { extractValidUrl } from "./utils";

/**
 * 授業一覧ページから、授業名と詳細URLのリスト（LectureList）を抽出します
 */
export const getLectures = (
  doc: Document,
  baseUrl: string
): Result<{ lectures: Course[] }, ScraperError> => {
  // 検索結果のテーブル（index_list5, index_list6）内のリンクを取得
  const nodes = doc.querySelectorAll(".index_list5 table td a, .index_list6 table td a");

  const lectures: Course[] = [];
  for (const node of Array.from(nodes)) {
    const name = node.textContent?.trim();
    
    if (name) {
      // 第1引数に Element (node), 第2引数に baseUrl を渡す
      const urlResult = extractValidUrl(node, baseUrl); 
      if (urlResult.ok) {
        lectures.push({
          name,
          url: urlResult.value,
        });
      }
    }
  }

  return success({ lectures });
};