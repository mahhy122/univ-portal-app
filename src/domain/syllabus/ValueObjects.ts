import { Result, err, ok } from "neverthrow";
import { Brand, TaggedError } from "../../lib/types.js";

// 各項目のBrand型定義
export type SyllabusItemID = Brand<"SyllabusItemID", string>;
export type LectureName = Brand<"LectureName", string>;
export type TeacherName = Brand<"TeacherName", string>;
export type LectureYear = Brand<"LectureYear", number>;
export type LectureSemester = Brand<"LectureSemester", string>;
export type Units = Brand<"Units", number>;
export type Gread = Brand<"Gread", string>; // 提示されたスペル「gread」に合わせます
export type Category = Brand<"Category", string>;
export type SyllabusURL = Brand<"SyllabusURL", string>;
export type SyllabusNumberingCode = Brand<"SyllabusNumberingCode", string>;

// 基本的なバリデーションロジック
export const Validators = {
  nonEmptyString: <T>(value: string, tag: string): Result<T, TaggedError<string, string>> => {
    return value.length > 0 ? ok(value as T) : err({ tag, cause: `${tag}は空にできません` });
  },
  positiveNumber: <T>(value: number, tag: string): Result<T, TaggedError<string, string>> => {
    return value >= 0 ? ok(value as T) : err({ tag, cause: `${tag}は0以上である必要があります` });
  }
};