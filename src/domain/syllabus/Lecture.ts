import {
  SyllabusItemID, LectureName, TeacherName, LectureYear,
  LectureSemester, Units, Gread, Category, SyllabusURL, SyllabusNumberingCode
} from "./ValueObjects";

export class Lecture {
  constructor(public readonly props: {
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
  }) {}

  static new(props: Lecture["props"]) {
    return new Lecture(props);
  }
}