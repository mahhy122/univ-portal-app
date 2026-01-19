import { Brand } from "../types";

export type UrlString = Brand<"UrlString", string>;

export interface Faculty {
  name: string;
  url: UrlString;
}

export interface CourseCategory {
  name: string;
  url: UrlString;
}

export interface Course {
  name: string;
  url: UrlString;
}

export interface SyllabusDetail {
  title: string;
  instructor: string;
  semester: string;
  credits: number;
  // 他に必要な項目を定義
}