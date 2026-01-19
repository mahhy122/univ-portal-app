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
export interface Faculty {
  name: string;
  url: UrlString;
}
// Course category structure
// コースカテゴリーの構造
export interface CourseCategory {
  name: string;
  url: UrlString;
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
  title: string;
  instructor: string;
  semester: string;
  credits: number;
}