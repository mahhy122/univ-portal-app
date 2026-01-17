import fs from "fs";
import path from "path";
import fetch from "node-fetch";
import { collectAllSyllabusUrls } from "./crawler.js";
import { parsePage } from "./parser.js";
import { ERROR_REGISTRY, ScrapeErrorLog } from "../src/lib/errors.js";
import { Lecture } from "../src/domain/syllabus/Lecture.js";

const runMaster = async (): Promise<void> => {
  // any を排除し、ドメインモデルの型を指定
  const results: Lecture["props"][] = [];
  const errorLogs: ScrapeErrorLog[] = [];

  try {
    const syllabusUrls = await collectAllSyllabusUrls();

    for (const url of syllabusUrls) {
      try {
        const res = await fetch(url);
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        const html = await res.text();
        
        // parsePage は Result<Lecture, TaggedError> を返す想定
        const lectureResult = parsePage(html, url);

        if (lectureResult) {
          // Result型の利点: match を使って成功と失敗を型安全に分岐
          lectureResult.match(
            (lecture) => {
              console.log(`✅ 成功: ${lecture.props.name}`);
              results.push(lecture.props);
            },
            (err) => {
              // バリデーションエラー（どの項目がダメだったか）を詳細に記録
              errorLogs.push({
                timestamp: new Date().toISOString(),
                tag: "VALIDATION_ERROR",
                url,
                message: ERROR_REGISTRY.VALIDATION_ERROR(url),
                detail: err.cause // Factoryが返した詳細なエラーリスト
              });
            }
          );
        } else {
          // parsePage が null を返した場合（.syllabusArea がない等）
          errorLogs.push({
            timestamp: new Date().toISOString(),
            tag: "DOM_PARSE_ERROR",
            url,
            message: ERROR_REGISTRY.DOM_PARSE_ERROR(url)
          });
        }
      } catch (err: unknown) {
        // 通信エラーなどの例外を catch し、詳細を記録
        const message = err instanceof Error ? err.message : String(err);
        errorLogs.push({
          timestamp: new Date().toISOString(),
          tag: "DETAIL_FETCH_ERROR",
          url,
          message: ERROR_REGISTRY.DETAIL_FETCH_ERROR(message),
          detail: err instanceof Error ? err.stack : undefined
        });
      }
      
      // 負荷軽減のためのウェイト（推奨）
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  } catch (err: unknown) {
    console.error("Master process failed:", err instanceof Error ? err.message : err);
  }

  // 保存処理
  const dataDir = path.join(process.cwd(), "src/data");
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

  fs.writeFileSync(path.join(dataDir, "syllabus_results.json"), JSON.stringify(results, null, 2));
  fs.writeFileSync(path.join(dataDir, "scrape_error_logs.json"), JSON.stringify(errorLogs, null, 2));
  
  console.log(`Finished. ${results.length} lectures scraped, ${errorLogs.length} errors logged.`);
};

runMaster();