import { Result, success, failure } from "../../types";
import { CourseCategory, ScraperError } from "../types";
import { extractValidUrl } from "./utils";

export const getCourseCategories = (
  doc: Document, 
  baseUrl: string
): Result<{courseCategories :CourseCategory[]}, ScraperError> => {
  const categories: CourseCategory[] = [];
  let currentLevel1 = ""; 
  let currentLevel2 = ""; 

  // レベル1〜3の全ての要素を順番に走査
  const allElements = doc.querySelectorAll(".kamokuLevel1, .kamokuLevel2, .kamokuLevel3");

  allElements.forEach(el => {
    const text = el.textContent?.trim() || "";
    const cleanName = text.replace(/^\|?―+/, "").replace(/[【】《》＜＞]/g, "").trim();

    if (el.tagName === "A") {
      // Aタグであれば、どのレベルでもカテゴリーリンクとして扱う
      const urlResult = extractValidUrl(el as Element, baseUrl);
      if (urlResult.ok) {
        categories.push({
          name: cleanName.replace(/（\d+授業）$/, ""),
          url: urlResult.value,
          path: [currentLevel1, currentLevel2].filter(p => p !== "")
        });
      }
    } else {
      // Aタグでない場合は、下の階層のための親の名前として記憶
      if (el.classList.contains("kamokuLevel1")) {
        currentLevel1 = cleanName;
        currentLevel2 = "";
      } else if (el.classList.contains("kamokuLevel2")) {
        currentLevel2 = cleanName;
      }
    }
  });

  if (categories.length === 0) {
    return failure({ tag: "DomNotFoundError", cause: "カテゴリーリンクが見つかりませんでした" });
  }

  return success({ courseCategories: categories });
};