import { QuickPickItem, window } from "vscode";
import { delimiter, Pri, Single, ValueType } from "./param";

type Parser = {
  values: Record<string, Pri>;
  parse?: (input: string) => Pri | undefined;
};
type Opt = { title: string; step?: number; totalStep?: number };

type Item = QuickPickItem & { value: Pri; priority: number };

export async function getValue(type: ValueType, opt: Opt): Promise<Pri> {
  const parsersWithPriority = type
    .replace(/ /g, "")
    .split(delimiter)
    .map((t, i) => ({ ...getItem(t as Single), priority: i }));

  const pick = window.createQuickPick<Item>();
  pick.title = `${opt.title}: ${type}`;
  pick.items = parsersWithPriority.reduce<Item[]>(
    (prev, p) => [
      ...prev,
      ...Object.entries(p.values).reduce<Item[]>(
        (pp, [k, v]) => [...pp, { label: k, value: v, priority: p.priority }],
        []
      ),
    ],
    []
  );

  return await new Promise<Pri>((res, rej) => {
    let text: string | undefined = undefined;
    let item: Item | undefined = undefined;
    let val: Pri | undefined = undefined;
    pick.onDidChangeValue((e) => (text = e));
    pick.onDidChangeActive((e) =>
      e != null && e.length !== 0 ? (item = e[0]) : (item = undefined)
    );
    pick.onDidAccept(() => {
      console.log(`onDidAccept:${text} - ${JSON.stringify(item)}`);
      val =
        parsersWithPriority
          .filter((p) => item == null || p.priority < item?.priority)
          .sort((a, b) => a.priority - b.priority)
          .map((p) => p.parse?.(text!))
          .filter((e): e is Pri => e != null)
          .at(0) ?? item?.value;
      if (val !== undefined) {
        pick.hide();
      }
    });
    pick.show();
    pick.onDidHide(() => (val !== undefined ? res(val) : rej()));
  });
}

function getItem(single: Single): Parser {
  const cases: Record<string, Parser | undefined> = {
    true: { values: { true: true } },
    false: { values: { false: false } },
    boolean: { values: { true: true, false: false } },
    null: { values: { null: null } },
    string: {
      values: {},
      parse: (input) => input,
    },
    number: {
      values: {},
      parse: (input) => (/^\d+$/.test(input) ? Number.parseFloat(input) : undefined),
    },
  };
  const a = cases[single];
  if (a != null) {
    return a;
  }

  if (/^\d+$/.test(single)) {
    return { values: { [single]: Number.parseFloat(single) } };
  }

  if (/^'.*'$/.test(single)) {
    return { values: { [single]: single.slice(1, -1) } };
  }

  return {
    values: { [single]: single },
  };
}
