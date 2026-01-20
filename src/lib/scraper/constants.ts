/**
 * スクレイピングに関する固定メッセージを集約する
 */
export const SCRAPER_MESSAGES = {
  ERRORS: {
    FETCH_FAILED: (status: number, url: string) => `HTTP ${status}: ${url} の取得に失敗しました。`,
    HREF_MISSING: "リンクのhref属性が存在しません。",
    HREF_EMPTY: "リンクのhref属性が空文字です。",
    URL_INVALID: (url: string) => `無効なURL形式です: ${url}`,
    FACULTY_NOT_FOUND: "学部リンクが見つかりません。",
    CATEGORY_NOT_FOUND: "カテゴリーが見つかりません。",
    COURSE_NOT_FOUND: "授業リストが見つかりません。",
    SYLLABUS_TITLE_MISSING: "講義名が取得できません。",
    FILE_WRITE_FAILED: (path: string) => `ファイル ${path} の保存に失敗しました。`,
  },
  INFO: {
    START: "🚀 スクレイピングを開始します...",
    COMPLETED: "✨ スクレイピングが完了し、ファイルが保存されました。",
  }
} as const; // as const を付けることで、文字列リテラル型として扱われ型安全になります