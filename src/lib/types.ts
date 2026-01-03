export type Brand<BrandName extends string, T> = T & {
  readonly __brand: BrandName
}

export interface TaggedError<T extends string,C > {
  tag: T;
  cause: C;
}
