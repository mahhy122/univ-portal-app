export type Brand<BrandName extends string, T> = T & {
  readonly __brand: BrandName
}

export interface TaggedError<T extends string, C> {
  tag: T
  cause: C
}

// Result型の定義
export type Result<T, E> = 
  | { ok: true; value: T }
  | { ok: false; error: E };

export const success = <T>(value: T): Result<T, never> => ({ ok: true, value });
export const failure = <E>(error: E): Result<never, E> => ({ ok: false, error });

// スクレイピング特有のエラー定義
export type ScraperError = 
  | TaggedError<"FetchError", string>
  | TaggedError<"ParseError", string>
  | TaggedError<"DomNotFoundError", string>;