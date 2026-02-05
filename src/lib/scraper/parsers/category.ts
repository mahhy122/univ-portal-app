import { Result, success, failure } from "../../types";
import { CourseCategory, ScraperError } from "../types";
import { extractValidUrl } from "./utils";

export const getCourseCategories = (
  doc: Document, 
  baseUrl: string
): Result<{courseCategories :CourseCategory[]}, ScraperError> => {
  const categories: CourseCategory[] = [];
  let currentLevel1 = ""; // 【全学共通科目】など
  let currentLevel2 = ""; // 《自主自律支援科目》など

  // page-body内の index_ で始まるクラスを持つdivをすべて取得
  const divs = doc.querySelectorAll(".page-body div[class^='index_']");

  divs.forEach(div => {
    const level1El = div.querySelector(".kamokuLevel1");
    const level2El = div.querySelector(".kamokuLevel2");
    const level3El = div.querySelector(".kamokuLevel3");

    if (level1El) {
      // 大分類の更新（記号や装飾を削除）
      currentLevel1 = level1El.textContent?.trim().replace(/^\|?―+/, "").replace(/[【】]/g, "").trim() || "";
      currentLevel2 = ""; // 大分類が変わったら中分類はリセット
    } else if (level2El) {
      // 中分類の更新
      currentLevel2 = level2El.textContent?.trim().replace(/^\|?―+/, "").replace(/[《》]/g, "").trim() || "";
    } else if (level3El && level3El.tagName === "A") {
      // リンク（小分類）の取得
      const anchor = level3El as HTMLAnchorElement;
      const urlResult = extractValidUrl(anchor, baseUrl);
      const name = anchor.textContent?.trim()
        .replace(/^\|?―+/, "")
        .replace(/[＜＞]/g, "")
        .replace(/（\d+授業）$/, "") // 「（12授業）」などの末尾の文字を削除
        .trim();

      if (urlResult.ok && name) {
        categories.push({
          name,
          url: urlResult.value,
          path: [currentLevel1, currentLevel2].filter(p => p !== "") // 空文字を除いてパスを構築
        });
      }
    }
  });

  if (categories.length === 0) {
    return failure({ tag: "DomNotFoundError", cause: "カテゴリーが見つかりません" });
  }

  return success({ courseCategories: categories });
};