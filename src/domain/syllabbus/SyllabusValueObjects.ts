import { Result, err, ok } from "neverthrow"
import { Brand, TaggedError } from "@/lib/types"

export type LectureName = Brand<"LectureName", string>
export const LectureName = {
  fromString(name: string): Result<LectureName, TaggedError<"InvalidLectureName", string>> {
    if (name.length === 0) {
      return err({
        tag: "InvalidLectureName",
        cause: "授業名は空にできません"
      })
    }
    return ok(name as LectureName)
  }
}
export type SyllabusItemID = Brand<"SyllabusItemID", string>
export const SyllabusItemID = {
  fromString(id: string): Result<SyllabusItemID, TaggedError<"InvalidSyllabusItemID", string>> {
    if (id.length === 0) {
      return err({
        tag: "InvalidSyllabusItemID",
        cause: "シラバスIDは空にできません"
      })
    }
    return ok(id as SyllabusItemID)
  }
}

export type LectureYear = Brand<"LectureYear", number>
export const LectureYear = {
  fromNumber(year: number): Result<LectureYear, TaggedError<"InvalidLectureYear", string>> {
    if (year < 2000 || year > 2100) {
      return err({
        tag: "InvalidLectureYear",
        cause: "授業年度が不正です"
      })
    }
    return ok(year as LectureYear)
  }
}

export type LectureSemester = Brand<"LectureSemester", "前期" | "後期" | "通年">
export const LectureSemester = {
  fromString(semester: string): Result<LectureSemester, TaggedError<"InvalidLectureSemester", string>> {
    if (semester !== "前期" && semester !== "後期" && semester !== "通年") {
      return err({
        tag: "InvalidLectureSemester",
        cause: "授業の学期が不正です"
      })
    }
    return ok(semester as LectureSemester)
  }
}

export type SyllabusURL = Brand<"SyllabusURL", string>
export const SyllabusURL = {
  fromString(url: string): Result<SyllabusURL, TaggedError<"InvalidSyllabusURL", string>> {
    try {
      new URL(url)
    } catch {
      return err({
        tag: "InvalidSyllabusURL",
        cause: "シラバスのURLが不正です"
      })
    }
    return ok(url as SyllabusURL)
  }
}
export type SyllabusNumberingCode = Brand<"SyllabusNumberingCode", string>
export const SyllabusNumberingCode = {
  fromString(code: string): Result<SyllabusNumberingCode, TaggedError<"InvalidSyllabusNumberingCode", string>> {
    if (code.length === 0) {
      return err({
        tag: "InvalidSyllabusNumberingCode",
        cause: "シラバスの番号コードは空にできません"
      })
    }
    return ok(code as SyllabusNumberingCode)
  }
}

export type Gread = Brand<"Gread", string>
export const Gread = {
  fromString(gread: string): Result<Gread, TaggedError<"InvalidGread", string>> {
    if (gread.length === 0) {
      return err({
        tag: "InvalidGread",
        cause: "学年は空にできません"
      })
    }
    return ok(gread as Gread)
  }
}

export type Category = Brand<"Category", string>
export const Category = {
  fromString(category: string): Result<Category, TaggedError<"InvalidCategory", string>> {
    if (category.length === 0) {
      return err({
        tag: "InvalidCategory",
        cause: "カテゴリは空にできません"
      })
    }
    return ok(category as Category)
  }
}

export type TeacherName = Brand<"TeacherName", string>
export const TeacherName = {
  fromString(name: string): Result<TeacherName, TaggedError<"InvalidTeacherName", string>> {
    if (name.length === 0) {
      return err({
        tag: "InvalidTeacherName",
        cause: "教員名は空にできません"
      })
    }
    return ok(name as TeacherName)
  }
}

export type Units = Brand<"Units", number>
export const Units = {
  fromNumber(units: number): Result<Units, TaggedError<"InvalidUnits", string>> {
    if (units <= 0) {
      return err({
        tag: "InvalidUnits",
        cause: "単位数は正の数でなければなりません"
      })
    }
    return ok(units as Units)
  }
}
export type SyllabusItem = {
  id: SyllabusItemID;
  name: LectureName;
  teacher: TeacherName;
  year: LectureYear;
  semester: LectureSemester;
  units: Units;
  gread: Gread;
  category: Category;
  url: SyllabusURL;
  numberingCode: SyllabusNumberingCode;
}

export type ScrapeError = TaggedError<"ScrapeError", string>