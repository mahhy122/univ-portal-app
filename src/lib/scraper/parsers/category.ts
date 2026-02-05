import { Result, success, failure } from "../../types";
import { CourseCategory, ScraperError } from "../types";
import { extractValidUrl } from "./utils";

export const getCourseCategories = (
  doc: Document, 
  baseUrl: string
): Result<{courseCategories :CourseCategory[]}, ScraperError> => {
  const categories: CourseCategory[] = [];
  let currentLevel1 = ""; // 大分類（【全学共通科目】など）
  let currentLevel2 = ""; // 中分類（《自主自律支援科目》など）

  // ページ内のすべてのカテゴリ要素を取得
  const allElements = doc.querySelectorAll(".kamokuLevel1, .kamokuLevel2, .kamokuLevel3");

  allElements.forEach(el => {
    const text = el.textContent?.trim() || "";
    // 記号（|――――や括弧）を除去
    const cleanName = text.replace(/^\|?―+/, "").replace(/[【】《》＜＞]/g, "").trim();

    if (el.classList.contains("kamokuLevel1")) {
      currentLevel1 = cleanName;
      currentLevel2 = ""; // 大分類が変わったら中分類リセット
    } else if (el.classList.contains("kamokuLevel2")) {
      currentLevel2 = cleanName;
    } else if (el.classList.contains("kamokuLevel3") && el.tagName === "A") {
      const urlResult = extractValidUrl(el as Element, baseUrl);
      if (urlResult.ok) {
        categories.push({
          name: cleanName.replace(/（\d+授業）$/, ""), // 「（1授業）」などの件数表示を削除
          url: urlResult.value,
          path: [currentLevel1, currentLevel2].filter(p => p !== "") // 空でない階層をパスに設定
        });
      }
    }
  });

  if (categories.length === 0) {
    return failure({
      tag: "DomNotFoundError",
      cause: "カテゴリーが見つかりませんでした。セレクタ .kamokuLevelX が正しいか確認してください。"
    });
  }

  return success({ courseCategories: categories });
};