import { Result, success, failure } from "../../types";
import { UrlString, ScraperError } from "../types";

/**
 * <a>タグから有効なURLを抽出し、絶対パスに変換するアロー関数
 * Result型を返し、try-catch を排除しています。
 */
export const extractValidUrl = (element: Element, baseUrl: string): Result<UrlString, ScraperError> => {
  const anchor = element as HTMLAnchorElement;
  const href = anchor.getAttribute("href");

  if (!href) {
    return failure({
      tag: "ParseError",
      cause: "リンクのhref属性が存在しません"
    });
  } else if (href.trim() === "") {
    return failure({
      tag: "ParseError",
      cause: "リンクのhref属性が空文字です"
    });
  }

  if (!URL.canParse(href, baseUrl)) {
    return failure({
      tag: "ParseError",
      cause: `無効なURL形式です: ${href}`
    });
  }

  return success(new URL(href, baseUrl).toString() as UrlString);
};