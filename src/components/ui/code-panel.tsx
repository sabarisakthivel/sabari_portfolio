import type { CodeLine, TokenKind } from "@/lib/syntax";
import { cn } from "@/lib/utils";

const TOKEN_CLASS: Record<TokenKind, string> = {
  key: "text-syntax-key",
  str: "text-syntax-str",
  num: "text-syntax-num",
  punct: "text-fg-faint",
  comment: "text-syntax-comment",
  plain: "text-fg-muted",
};

/** macOS-style window chrome shared by CodePanel and BrowserFrame. */
export function PanelChrome({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 border-b border-border bg-bg-elev-2 px-4 py-2.5",
        className,
      )}
    >
      <span aria-hidden className="flex shrink-0 gap-1.5 opacity-70">
        <span className="size-2.5 rounded-full bg-syntax-str" />
        <span className="size-2.5 rounded-full bg-accent" />
        <span className="size-2.5 rounded-full bg-success" />
      </span>
      {children}
    </div>
  );
}

/**
 * Requirements §2.3 — window chrome, filename tab, line numbers and
 * syntax-coloured content. `activeGroups` lights the lines belonging to the
 * hovered domain and dims the rest (Stack cross-highlighting, M-11).
 */
export function CodePanel({
  filename,
  lines,
  activeGroups,
  typing,
  className,
  bodyClassName,
}: {
  filename: string;
  lines: readonly CodeLine[];
  activeGroups?: readonly string[] | null;
  /**
   * Typing reveal (M-11). Each token carries an `animation-delay` derived from
   * its character offset, so the cascade runs on the compositor, all text is in
   * the DOM from first paint (no layout shift), and it adds no extra elements.
   * An ancestor with `.typing-active` releases the paused animations.
   */
  typing?: { charDelayMs: number };
  className?: string;
  bodyClassName?: string;
}) {
  const active = activeGroups?.length ? activeGroups : null;

  // Cumulative character offset of every token, for the typing delays.
  let cursor = 0;
  const offsets = lines.map((line) =>
    line.tokens.map((token) => {
      const start = cursor;
      cursor += token.text.length;
      return start;
    }),
  );

  return (
    <div
      className={cn(
        "inset-top-highlight overflow-hidden rounded-panel border border-border bg-bg-elev",
        className,
      )}
    >
      <PanelChrome>
        <span className="min-w-0 truncate font-mono text-xs text-fg-muted">
          {filename}
        </span>
      </PanelChrome>

      <div
        className={cn(
          "py-4 font-mono text-[13px] leading-[1.75]",
          bodyClassName,
        )}
      >
        {lines.map((line, index) => {
          const lit = Boolean(active && line.group && active.includes(line.group));
          const dimmed = Boolean(active) && !lit;

          return (
            <div
              key={index}
              className={cn(
                "flex gap-4 px-4 transition-[opacity,background-color] duration-200",
                dimmed && "opacity-35",
                lit && "bg-accent/5",
              )}
            >
              <span
                aria-hidden
                className="w-[2ch] shrink-0 text-right text-fg-faint select-none"
              >
                {index + 1}
              </span>
              <code
                className="min-w-0 flex-1 break-words whitespace-pre-wrap"
                style={{ paddingLeft: `${(line.indent ?? 0) * 2}ch` }}
              >
                {line.tokens.map((token, tokenIndex) => (
                  <span
                    key={tokenIndex}
                    className={cn(TOKEN_CLASS[token.kind], typing && "type-char")}
                    style={
                      typing
                        ? {
                            animationDelay: `${
                              offsets[index][tokenIndex] * typing.charDelayMs
                            }ms`,
                          }
                        : undefined
                    }
                  >
                    {token.text}
                  </span>
                ))}
              </code>
            </div>
          );
        })}
      </div>
    </div>
  );
}
