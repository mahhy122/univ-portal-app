import { JSDOM } from "jsdom";
import { Result, success, failure } from "../types";
import { UrlString, ScraperError } from "./types";

// Fetches the HTML document from the given URL and returns it as a Document object
// wrapped in a Result type to handle success and error cases.
// HTMLを取得してDocumentオブジェクトとして返す。
// 成功とエラーのケースを扱うためにResult型でラップする。
export const fetchSyllabusDom = (url: UrlString): Promise<Result<Document, ScraperError>> =>
  fetch(url)
    .then((res): Promise<Result<Document, ScraperError>> | Result<Document, ScraperError> => {
      if (!res.ok) return failure({ tag: "FetchError", cause: `HTTP ${res.status}: ${url}` });
      return res.text().then((html) => success(new JSDOM(html).window.document));
    })
    .catch((e: unknown) => failure({
      tag: "FetchError",
      cause: e instanceof Error ? e.message : String(e)
    }));