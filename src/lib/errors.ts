// src/lib/errors.ts
export type ScrapeErrorTag = 
  | "DETAIL_FETCH_ERROR"  // 通信失敗
  | "DOM_PARSE_ERROR"     // HTML構造エラー
  | "VALIDATION_ERROR"    // データ形式エラー
  | "UNKNOWN_ERROR";

export interface ScrapeErrorLog {
  timestamp: string;
  tag: ScrapeErrorTag;
  url: string;
  message: string;
  detail?: unknown; // バリデーションエラーの詳細など
}

export const ERROR_REGISTRY: Record<ScrapeErrorTag, (ctx: string) => string> = {
  DETAIL_FETCH_ERROR: (ctx) => `詳細ページの取得に失敗しました: ${ctx}`,
  DOM_PARSE_ERROR: (ctx) => `HTML解析に失敗しました。構造が変更された可能性があります: ${ctx}`,
  VALIDATION_ERROR: (ctx) => `データのバリデーションに失敗しました: ${ctx}`,
  UNKNOWN_ERROR: (ctx) => `予期せぬエラーが発生しました: ${ctx}`,
};