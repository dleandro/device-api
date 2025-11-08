export type Serializable =
  | string
  | number
  | boolean
  | object
  | null
  | undefined
  | ReadonlyArray<Serializable>
  | { readonly [key: string]: Serializable }
  | { toJSON(): Serializable };
