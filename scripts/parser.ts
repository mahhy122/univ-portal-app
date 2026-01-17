import { JSDOM } from "jsdom";
import { LectureFactory } from "../src/domain/syllabus/LectureFactory.js";

export const parsePage = (html: string, url: string) => {
  const doc = new JSDOM(html).window.document;
  const area = doc.querySelector(".syllabusArea");
  if (!area) return null;

  const getValueByLabel = (label: string): string => {
    const headers = Array.from(area.querySelectorAll(".colHeader"));
    const target = headers.find(h => h.textContent?.trim() === label);
    return target?.nextElementSibling?.textContent?.trim() || "";
  };

  const rawYearSemester = getValueByLabel("開講時期");
  const rawUnitsStr = getValueByLabel("単位数");
  const rawNumbering = getValueByLabel("ﾅﾝﾊﾞﾘﾝｸﾞｺｰﾄﾞ");

  return LectureFactory.create({
    id: rawNumbering,
    name: getValueByLabel("授業科目名"),
    teacher: getValueByLabel("担当教員"),
    year: parseInt(rawYearSemester.split("年度")[0]) || 2025,
    semester: rawYearSemester.split("年度")[1] || "",
    units: parseFloat(rawUnitsStr.replace("単位", "")) || 0,
    gread: getValueByLabel("学年"), // スペルミスは型定義に準拠
    category: getValueByLabel("科目区分"),
    url: url,
    numberingCode: rawNumbering
  });
};