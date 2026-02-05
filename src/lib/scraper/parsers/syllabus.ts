import { Result, success, failure } from "../../types";
import { SyllabusDetail, ScraperError, UrlString } from "../types";

export const getSyllabusDetail = (
  doc: Document, 
  url: UrlString // 引数にURLを追加
): Result<SyllabusDetail, ScraperError> => {
  try {
    const headers = Array.from(doc.querySelectorAll(".colHeader"));
    const findValue = (label: string): string => {
      const header = headers.find(h => h.textContent?.includes(label));
      return header?.nextElementSibling?.textContent?.trim() || "";
    };

    const detail: SyllabusDetail = {
      url: url, // ここにセット
      code: doc.querySelector(".headTitle span:last-child")?.textContent?.trim() || "",
      title: doc.querySelector(".headTitle")?.firstChild?.textContent?.trim() || "",
      instructor: findValue("担当教員"),
      semester: findValue("開講期"),
      credits: parseInt(findValue("単位")) || 0,
      targetYear: findValue("対象学年"),
      objectives: findValue("授業の狙い・概要"),
      plan: findValue("授業計画").split('\n').filter(line => line.trim() !== ""),
      evaluation: findValue("成績評価方法"),
      textbooks: findValue("教科書・参考書"),
      notes: findValue("備考")
    };

    return success(detail);
  } catch (e) {
    return failure({ tag: "ParseError", cause: `シラバス詳細の解析に失敗しました: ${e}` });
  }
};