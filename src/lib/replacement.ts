export type Replacement = {
  id: string;
  path: string;
  hint: string;
};

export class ReplacementsParser {
  private static TXN_HINT_SEPARATOR = ';';
  private static ID_SEPARATOR = ':';
  private static LIST_SEPARATOR = ',';

  public static parse(str: string | undefined) {
    if (!str) {
      return [];
    }

    const [txReplaceStr, hintsStr] = str.split(
      ReplacementsParser.TXN_HINT_SEPARATOR
    );
    const hintParts = hintsStr.split(ReplacementsParser.LIST_SEPARATOR);
    const hintsMap = new Map<string, string>();
    hintParts
      .map(part => part.split(ReplacementsParser.ID_SEPARATOR))
      .forEach(([id, hint]) => hintsMap.set(id, hint));

    const txReplacmentParts = txReplaceStr.split(
      ReplacementsParser.LIST_SEPARATOR
    );
    const replacements = txReplacmentParts
      .map(part => part.split(ReplacementsParser.ID_SEPARATOR))
      .map(([path, id]) => ({ id, path, hint: hintsMap.get(id)! }));

    return replacements;
  }

  public static toString(replacements: Replacement[]) {
    const txns = replacements
      .map(r => `${r.path}${ReplacementsParser.ID_SEPARATOR}${r.id}`)
      .join(ReplacementsParser.LIST_SEPARATOR);

    const hintMap = new Map<string, string>();
    for (const r of replacements) {
      hintMap.set(r.id, r.hint);
    }

    const hints = Array.from(hintMap.entries())
      .map(([id, hint]) => `${id}${ReplacementsParser.ID_SEPARATOR}${hint}`)
      .join(ReplacementsParser.LIST_SEPARATOR);

    return `${txns}${ReplacementsParser.TXN_HINT_SEPARATOR}${hints}`;
  }
}
