import { Result, success, failure } from "../../types";
import { CourseCategory, ScraperError } from "../types";
import { extractValidUrl } from "./utils";

export const getCourseCategories = (
  doc: Document, 
  baseUrl: string
): Result<{courseCategories :CourseCategory[]}, ScraperError> => {
  const nodes = doc.querySelectorAll(".page-body a");

  const initial: CourseCategory[] = [];
  const result = Array.from(nodes).reduce((acc, node) => {
    const urlResult = extractValidUrl(node, baseUrl);
    const name = node.textContent?.trim().replace(/^\|?―+/, "").trim();

    if (urlResult.ok &&
      name &&
      name !== "" &&
      !urlResult.value.endsWith("#") &&
      !node.getAttribute("href")?.startsWith("#")) 
      {
        acc.push({
          name,
          url: urlResult.value
        });
      }
    return acc;
  }, initial);

  if (result.length === 0) {
    return failure({ 
      tag: "DomNotFoundError",
      cause: "カテゴリーが見つかりません" });
  }

  return success({ courseCategories: result });
};