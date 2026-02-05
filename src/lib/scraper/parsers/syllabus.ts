import { Result, success, failure } from "../../types";
import { SyllabusDetail, ScraperError, UrlString } from "../types";

export const getSyllabusDetail = (doc: Document, url: UrlString): Result<SyllabusDetail, ScraperError> => {
  try {
    const headers = Array.from(doc.querySelectorAll(".colHeader"));
    const findValue = (label: string): string => {
      const header = headers.find(h => h.textContent?.includes(label));
      return header?.nextElementSibling?.textContent?.trim() || "未設定";
    };

    const detail: SyllabusDetail = {
      url,
      title: doc.querySelector(".headTitle span")?.textContent?.trim() || "不明",
      instructor: findValue("担当教員"),
      semester: findValue("開講時期"),
      credits: parseInt(findValue("単位")) || 0,
      targetFaculty: findValue("対象学部"),
      objectives: findValue("授業の狙い・概要"),
      plan: findValue("講義内容・授業計画").split('\n').filter(line => line.trim() !== ""),
      evaluation: findValue("成績評価の基準・方法"),
      textbooks: findValue("教科書"),
      notes: findValue("備考")
    };

    return success(detail);
  } catch (e) {
    return failure({ tag: "ParseError", cause: `詳細の解析に失敗: ${e}` });
  }
};