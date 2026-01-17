import {JSDOM } from "jsdom";
import fetch from "node-fetch";

//定数とユーティリティの定義 (エラー解消用) ---
//シラバスURL
const BASE_URL = `https://syllabus.u-hyogo.ac.jp/slResult/2025/japanese/`;

//全シラバスURLを収集する関数
export const collectAllSyllabusUrls = async (): Promise<string[]> =>{
  console.log("学部URL一覧のデータを取得中");
  const detailUrls: string[] = [];
  
  const topHtml = await (await fetch(BASE_URL)).text();
  const indexDom = new JSDOM(topHtml).window.document;
  const facultyLinks = Array.from(indexDom.querySelectorAll("td > a[href]"));

  for(const link of facultyLinks){
    //学部URLの取得
    // 相対URLを絶対URLに変換
    const href = link.getAttribute("href")!.replace(/^(\.\.\/)+/,"");
    const facultyUrl = new URL(href,BASE_URL).toString();
    console.log(`学部URL取得: ${facultyUrl}`);

    //学部ページの取得と解析
    const facultyHtml = await (await fetch(facultyUrl)).text();
    const facultyDom = new JSDOM(facultyHtml).window.document;
    const syllabusLinks = Array.from(facultyDom.querySelectorAll("td > a[href]"));
    
    //シラバスURLの取得
    for(const sLink of syllabusLinks){
      const sHref = sLink.getAttribute("href")!.replace(/^(\.\.\/)+/,"");
      const syllabusUrl = new URL(sHref,BASE_URL).toString();
      console.log(`  シラバスURL取得: ${syllabusUrl}`);
      detailUrls.push(syllabusUrl);
    }
  }

  return [...new Set(detailUrls)];// 重複排除して返す
};