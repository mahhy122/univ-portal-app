import fs from "node:fs/promises";
import path from "node:path";
import { Result, success, failure } from "../types";
import { ScraperError } from "./types";

export const saveJson = (fileName: string, data: unknown): Promise<Result<string, ScraperError>> => {
  const outputDir = path.join(process.cwd(), "output");
  return fs.mkdir(outputDir, { recursive: true })
    .then(() => fs.writeFile(path.join(outputDir, fileName), JSON.stringify(data, null, 2), "utf-8"))
    .then(() => success(path.join(outputDir, fileName)))
    .catch((e: unknown) => failure({
      tag: "FileWriteError",
      cause: e instanceof Error ? e.message : String(e)
    }));
};