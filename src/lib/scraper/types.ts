import { Brand, TaggedError } from "../types";

export type UrlString = Brand<"UrlString", string>;
// Define possible errors that can occur during scraping
// スクレイピング中に発生しうるエラーを定義する
export type ScraperError = 
  | TaggedError<"FetchError", string>
  | TaggedError<"DomError", string>
  | TaggedError<"DomNotFoundError", string>
  | TaggedError<"ParseError", string>
  | TaggedError<"FileWriteError", string>;
// Define data structures for faculties, course categories, courses, and syllabus details
// 学部、コースカテゴリー、コース、シラバス詳細のデータ構造を定義する
// それぞれのURLはUrlString型として定義される

// Faculty structure
// 学部の構造
export interface Faculty {
  name: string;
  url: UrlString;
}
// Department structure
// 学科の構造
export interface Department {
  name: string;
  url: UrlString;
}
// Course category structure
// コースカテゴリーの構造
export interface CourseCategory {
  name: string;
  url: UrlString;
  path: string[];
}
// Course structure
// コースの構造
export interface Course {
  name: string;
  url: UrlString;
}
// Syllabus detail structure
// シラバス詳細の構造
export interface SyllabusDetail {
  url: UrlString;         // 追加：シラバス詳細ページのURL
  code: string;           // 講義コード (SyllabusHtml... の末尾など)
  title: string;          // 授業科目名
  instructor: string;     // 担当教員名
  semester: string;       // 開講期
  credits: number;        // 単位（数値として扱う）
  targetYear: string;     // 対象学年
  objectives: string;     // 授業の狙い・概要
  plan: string[];         // 授業計画（配列として保持）
  evaluation: string;     // 成績評価方法
  textbooks: string;      // 教科書・参考書
  notes: string;          // 備考
}