import { LectureName, LectureYear } from "./ValueObjects.js"

export class Lecture {
  constructor(
    public readonly name: LectureName,
    public readonly year: LectureYear,
    public readonly teacher: string,
    public readonly url: string
  ) {}

  static new(props: { name: LectureName; year: LectureYear; teacher: string; url: string }) {
    return new Lecture(props.name, props.year, props.teacher, props.url)
  }
}