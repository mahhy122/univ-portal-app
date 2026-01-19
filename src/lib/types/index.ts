export type Brand<BrandName extends string, T> = T & {
  readonly __brand: BrandName
}

export interface TaggedError<T extends string, C> {
  tag: T
  cause: C
}

export type Result<T, E> = 
  | { ok: true; value: T }
  | { ok: false; error: E };

export const success = <T>(value: T): Result<T, never> => ({ ok: true, value });
export const failure = <E>(error: E): Result<never, E> => ({ ok: false, error });