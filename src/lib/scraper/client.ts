import { JSDOM } from "jsdom";
import { Result, success, failure, ScraperError } from "../types";
import { UrlString } from "./types";

/**
 * 外部サイトからHTMLを取得し、DOMオブジェクトを返す（副作用あり）
 */
export const fetchSyllabusDom = async (url: UrlString): Promise<Result<Document, ScraperError>> => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      return failure({ tag: "FetchError", cause: `HTTP ${response.status}: ${url}` });
    }
    const html = await response.text();
    const dom = new JSDOM(html);
    return success(dom.window.document);
  } catch (e) {
    return failure({ tag: "FetchError", cause: e instanceof Error ? e.message : "Fetch failed" });
  }
};