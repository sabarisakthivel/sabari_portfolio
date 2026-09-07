/**
 * Minimal syntax model for the CodePanel components (Requirements §2.3).
 * Content is turned into typed tokens so colouring stays in one place and
 * components never reach for a colour value themselves.
 */

export type TokenKind =
  | "key"
  | "str"
  | "num"
  | "punct"
  | "comment"
  | "plain";

export interface Token {
  text: string;
  kind: TokenKind;
}

export interface CodeLine {
  tokens: Token[];
  /** Indent depth; rendered as two spaces per level. */
  indent?: number;
  /** Ties a line to a data group so the Stack section can cross-highlight it. */
  group?: string;
}

export type JsonValue = string | number | boolean | readonly string[];

export interface JsonEntry {
  key: string;
  value: JsonValue;
  group?: string;
}

const t = (text: string, kind: TokenKind): Token => ({ text, kind });

function valueTokens(value: JsonValue): Token[] {
  if (Array.isArray(value)) {
    const tokens: Token[] = [t("[", "punct")];
    value.forEach((item, index) => {
      if (index > 0) tokens.push(t(", ", "punct"));
      tokens.push(t(`"${item}"`, "str"));
    });
    tokens.push(t("]", "punct"));
    return tokens;
  }
  if (typeof value === "number") return [t(String(value), "num")];
  if (typeof value === "boolean") return [t(String(value), "num")];
  return [t(`"${value}"`, "str")];
}

/**
 * Builds the lines of a single-level JSON object literal. Arrays stay on one
 * logical line and soft-wrap in the panel, the way an editor renders them.
 */
export function jsonObjectLines(
  entries: readonly JsonEntry[],
  trailingComments: readonly string[] = [],
): CodeLine[] {
  const lines: CodeLine[] = [{ tokens: [t("{", "punct")] }];

  entries.forEach((entry, index) => {
    const isLast = index === entries.length - 1;
    lines.push({
      indent: 1,
      group: entry.group,
      tokens: [
        t(`"${entry.key}"`, "key"),
        t(": ", "punct"),
        ...valueTokens(entry.value),
        ...(isLast ? [] : [t(",", "punct")]),
      ],
    });
  });

  lines.push({ tokens: [t("}", "punct")] });

  trailingComments.forEach((comment) => {
    lines.push({ tokens: [t(comment, "comment")] });
  });

  return lines;
}

/** Turns a plain record into JSON entries in declaration order. */
export function entriesOf(record: Record<string, JsonValue>): JsonEntry[] {
  return Object.entries(record).map(([key, value]) => ({ key, value }));
}
