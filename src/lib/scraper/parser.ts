import { Result, success, failure } from "../types";
import { Faculty, CourseCategory, Course, SyllabusDetail, UrlString, ScraperError } from "./types";

export const getFaculties = (doc: Document, baseUrl: string): Result<Faculty[], ScraperError> => {
  const nodes = doc.querySelectorAll("#navi_gakubu a");
  if (nodes.length === 0) return failure({ tag: "DomNotFoundError", cause: "学部リンクが見つかりません" });

  return success(Array.from(nodes).map((node) => {
    const anchor = node as HTMLAnchorElement;
    return {
      name: anchor.textContent?.trim() ?? "名称不明",
      url: new URL(anchor.href, baseUrl).toString() as UrlString,
    };
  }));
};

export const getCourseCategories = (doc: Document, baseUrl: string): Result<CourseCategory[], ScraperError> => {
  const nodes = doc.querySelectorAll(".table-index td a");
  if (nodes.length === 0) return failure({ tag: "DomNotFoundError", cause: "カテゴリーが見つかりません" });

  return success(Array.from(nodes).map((node) => {
    const anchor = node as HTMLAnchorElement;
    return {
      name: anchor.textContent?.trim() ?? "名称不明",
      url: new URL(anchor.href, baseUrl).toString() as UrlString,
    };
  }));
};

export const getCourses = (doc: Document, baseUrl: string): Result<Course[], ScraperError> => {
  const nodes = doc.querySelectorAll("td > a[href]");
  if (nodes.length === 0) return failure({ tag: "DomNotFoundError", cause: "授業リストが見つかりません" });

  return success(Array.from(nodes).map((node) => {
    const anchor = node as HTMLAnchorElement;
    return {
      name: anchor.textContent?.trim() ?? "名称不明",
      url: new URL(anchor.href, baseUrl).toString() as UrlString,
    };
  }));
};

export const parseSyllabusDetail = (doc: Document): Result<SyllabusDetail, ScraperError> => {
  const title = doc.querySelector(".syllabus-title")?.textContent?.trim();
  if (!title) return failure({ tag: "ParseError", cause: "講義名が取得できません" });

  return success({
    title,
    instructor: doc.querySelector(".instructor-name")?.textContent?.trim() ?? "未定義",
    semester: "2025年度",
    credits: 2
  });
};