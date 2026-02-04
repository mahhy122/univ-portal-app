import { Result, success, failure } from "../../types";
import { Faculty, Department, ScraperError } from "../types";
import { extractValidUrl } from "./utils";

export const getFacultiesAndDepartments = (
  doc: Document, 
  baseUrl: string
): Result<{ faculties: Faculty[]; departments: Department[] }, ScraperError> => {
  const nodes = doc.querySelectorAll("#navi_gakubu a");
  const initial = { faculties: [] as Faculty[], departments: [] as Department[] };

  const result = Array.from(nodes).reduce((acc, node) => {
    const urlResult = extractValidUrl(node, baseUrl);
    const name = node.textContent?.trim();

    if (urlResult.ok && name && name !== "") {
      const item = { name, url: urlResult.value };
      if (name.endsWith("部")) acc.faculties.push(item);
      else if (name.endsWith("科")) acc.departments.push(item);
    }
    return acc;
  }, initial);

  if (result.faculties.length === 0 && result.departments.length === 0) {
    return failure({ tag: "DomNotFoundError", cause: "学部リンクが見つかりません" });
  }

  return success(result);
};