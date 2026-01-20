import fs from "node:fs/promises";
import path from "node:path";
import { failure, Result, success } from "../types";
import { ScraperError } from "./types";

/**
 * ログエントリーの型定義
 */
export interface ErrorLogEntry {
  timestamp: string;
  error: ScraperError;
  context: string;
}

/**
 * エラーログを JSON ファイルに出力・追記するアロー関数
 * try-catch ステートメントを使用せず、Promise チェーンで処理します
 */
export const writeErrorLog = (
  error: ScraperError,
  context: string
): Promise<Result<string, ScraperError>> => {
  const logDir = path.join(process.cwd(), "logs");
  const logFilePath = path.join(logDir, "error_logs.json");
  
  const newEntry: ErrorLogEntry = {
    timestamp: new Date().toISOString(),
    error,
    context,
  };

  // ディレクトリ作成 -> ファイル読み込み(既存ログ取得) -> 追記 -> 書き込み の流れ
  return fs.mkdir(logDir, { recursive: true })
    .then(() => 
      fs.readFile(logFilePath, "utf-8")
        .then((content): ErrorLogEntry[] => JSON.parse(content) as ErrorLogEntry[])
        .catch((): ErrorLogEntry[] => []) // ファイルが存在しない、または破損している場合は空配列
    )
    .then((existingLogs): Promise<void> => {
      const updatedLogs = [...existingLogs, newEntry];
      return fs.writeFile(logFilePath, JSON.stringify(updatedLogs, null, 2), "utf-8");
    })
    .then(() => success(logFilePath))
    .catch((e: unknown): Result<never, ScraperError> => 
      failure({
        tag: "FileWriteError",
        cause: `ログの保存に失敗しました: ${e instanceof Error ? e.message : String(e)}`,
      })
    );
};