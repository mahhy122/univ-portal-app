import { Result, err, ok } from "neverthrow";
import { Lecture } from "./Lecture";
import { Validators, SyllabusItemID, LectureName, TeacherName, LectureYear, LectureSemester, Units, Gread, Category, SyllabusURL, SyllabusNumberingCode } from "./ValueObjects.js";

export const LectureFactory = {
  create(args: {
    id: string; name: string; teacher: string; year: number;
    semester: string; units: number; gread: string; category: string;
    url: string; numberingCode: string;
  }) {
    const result = Result.combineWithAllErrors([
      Validators.nonEmptyString<SyllabusItemID>(args.id, "SyllabusItemID"),
      Validators.nonEmptyString<LectureName>(args.name, "LectureName"),
      Validators.nonEmptyString<TeacherName>(args.teacher, "TeacherName"),
      Validators.positiveNumber<LectureYear>(args.year, "LectureYear"),
      Validators.nonEmptyString<LectureSemester>(args.semester, "LectureSemester"),
      Validators.positiveNumber<Units>(args.units, "Units"),
      Validators.nonEmptyString<Gread>(args.gread, "Gread"),
      Validators.nonEmptyString<Category>(args.category, "Category"),
      Validators.nonEmptyString<SyllabusURL>(args.url, "SyllabusURL"),
      Validators.nonEmptyString<SyllabusNumberingCode>(args.numberingCode, "SyllabusNumberingCode"),
    ]);

    if (result.isErr()) {
      return err({
        tag: "LectureFactory",
        cause: result.error.map((e) => ({ field: e.tag, message: e.cause })),
      });
    }

    const [id, name, teacher, year, semester, units, gread, category, url, numberingCode] = result.value;
    return ok(Lecture.new({ id, name, teacher, year, semester, units, gread, category, url, numberingCode }));
  }
};