import { Result, err, ok } from "neverthrow"
import { LectureName, LectureYear, } from "./SyllabusValueObjects"  

export type Lecture = {
  id: string
  name: typeof LectureName
  year: typeof LectureYear
  teacher: string

}

export class LectureFactory {
  create(args: { 
    name: string; 
    year: number; 
    teacher: string; 
    id: string
  }){
    const result =Result.combineWithAllErrors([
      LectureName.fromString(args.name),
      LectureYear.fromNumber(args.year),
    ])
    if (result.isErr()){
      return err({
        tag: "LectureFactory",
        cause: result.error.map((error) => ({
          field: error.tag,
          message: error.cause,
        })),
      })
  }
  const [name, year] = result.value
  return ok({
    id: args.id,
    name,
    year,
    theacher: args.teacher,
  })
 }
}