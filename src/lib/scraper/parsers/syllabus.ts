import { Result, success, failure } from "../../types";
import { SyllabusDetail, ScraperError } from "../types";

export const getSyllabusDetail = (doc: Document): Result<SyllabusDetail, ScraperError> => {
  try {
    // 項目名(colHeader)を持つdivをすべて取得
    const headers = Array.from(doc.querySelectorAll(".colHeader"));

    // 特定のヘッダー名に対応する値を取得する内部関数
    const findValue = (label: string): string => {
      const header = headers.find(h => h.textContent?.includes(label));
      return header?.nextElementSibling?.textContent?.trim() || "";
    };

    const detail: SyllabusDetail = {
      code: doc.querySelector(".headTitle span:last-child")?.textContent?.trim() || "",
      title: doc.querySelector(".headTitle")?.firstChild?.textContent?.trim() || "",
      instructor: findValue("担当教員"),
      semester: findValue("開講期"),
      credits: parseInt(findValue("単位")) || 0,
      targetYear: findValue("対象学年"),
      objectives: findValue("授業の狙い・概要"),
      // 授業計画は scraping-2 のように改行で分割して配列化
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