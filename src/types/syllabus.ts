export interface SyllabusItem{
  id: string;
  name: string;
  teacher: string;
  year: number;
  semeter: string;
  units: number;
  grade: string;
  category: string;
  url: string;
  numberingCode: string;
}

export type ScrapeError = {
  tag: "ScaperError";
  cause: string;
}