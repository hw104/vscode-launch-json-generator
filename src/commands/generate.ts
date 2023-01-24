import { Jsonize, Pri, ValueType } from "./param";
import { getValue } from "./pick";

export async function handler(arg: Jsonize<ValueType>): Promise<string> {
  return JSON.stringify(await getJson(arg, []));
}

export async function getJson(arg: Jsonize<ValueType>, path: string[]): Promise<Jsonize<Pri>> {
  if (Array.isArray(arg)) {
    return await serialize(arg.map((a, i) => () => getJson(a, [...path, `${i}`])));
  }
  if (typeof arg === "object") {
    return Object.fromEntries(
      await serialize(
        Object.entries(arg).map(([k, v]) => async () => [k, await getJson(v, [...path, k])])
      )
    );
  }

  return await getValue(arg, { title: path.join('.') });
}

async function serialize<T>(a: (() => Promise<T>)[]): Promise<T[]> {
  const res: T[] = [];
  for (const e of a) {
    res.push(await e());
  }
  return res;
}
