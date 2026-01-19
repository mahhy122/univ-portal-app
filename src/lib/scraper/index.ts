import { fetchSyllabusDom } from "./client";
import { saveJson } from "./fileWriter";
import { getFaculties, getCourseCategories, getCourses, parseSyllabusDetail } from "./parser";
import { UrlString } from "./types";

const BASE_URL = "https://syllabus.u-hyogo.ac.jp/slResult/2025/japanese/" as UrlString;

const run = async () => {
  const fDom = await fetchSyllabusDom(BASE_URL);
  if (!fDom.ok) return console.error(fDom.error);

  const faculties = getFaculties(fDom.value, BASE_URL);
  if (!faculties.ok) return;
  await saveJson("1_faculties.json", faculties.value);

  const target = faculties.value[0];
  const cDom = await fetchSyllabusDom(target.url);
  if (!cDom.ok) return;

  const categories = getCourseCategories(cDom.value, BASE_URL);
  if (!categories.ok) return;
  await saveJson("2_categories.json", categories.value);
  
  console.log("Scraping completed and files saved.");
};

void run();