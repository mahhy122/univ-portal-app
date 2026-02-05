import fs from "node:fs/promises";
import path from "node:path";
import { Result, success, failure } from "../types";
import { ScraperError } from "./types";

export const saveJson = async (filePath: string, data: unknown): Promise<Result<string, ScraperError>> => {
  // output フォルダを起点としたフルパスを作成
  const fullPath = path.join(process.cwd(), "output", filePath);
  // ファイルが置かれる親ディレクトリのパスを計算
  const dirPath = path.dirname(fullPath);

  try {
    // ディレクトリを再帰的に作成（recursive: true で深い階層も一気に作れます）
    await fs.mkdir(dirPath, { recursive: true });
    // JSONとして整形して保存
    await fs.writeFile(fullPath, JSON.stringify(data, null, 2), "utf-8");
    return success(fullPath);
  } catch (e: unknown) {
    return failure({
      tag: "FileWriteError",
      cause: e instanceof Error ? e.message : String(e)
    });
  }
};