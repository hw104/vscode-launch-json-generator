export type Pn<P extends string, J extends string> =
  | P
  | `${P}${J}${P}`
  | `${P}${J}${P}${J}${P}`
  | `${P}${J}${P}${J}${P}${J}${P}`;

export const primiteves = ["string", "number", "boolean", "null"] as const;
export type Single = typeof primiteves[number] | `'${string}'` | `${number}` | `${boolean}`;
export const delimiter = "|" as const;
export type ValueType = Pn<Single, typeof delimiter>;
export type Pri = string | number | boolean | null;
export type Jsonize<V> = V | Jsonize<V>[] | { [K: string]: Jsonize<V> };
