import { Result, success } from "../../types";
import { Course, ScraperError } from "../types";
import { extractValidUrl } from "./utils";

export const getLectures = (
  doc: Document,
  baseUrl: string
): Result<{ lectures: Course[] }, ScraperError> => {
  // 授業一覧のテーブル行(tr)内のリンクをすべて取得
  const nodes = doc.querySelectorAll("tr.index_list5 td a, tr.index_list6 td a");

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