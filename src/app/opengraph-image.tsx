import { ImageResponse } from "next/og";
import { hero, site } from "@/data/content";
import { tokens } from "@/lib/tokens";

export const alt = site.title;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Requirements §5 / AC-9 — dark card, name, role and three stack chips. */
export default async function OpengraphImage() {
  const chips = hero.identity.fields.stack.slice(0, 3);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: tokens.bg,
          padding: 72,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 52,
              height: 52,
              borderRadius: 12,
              border: `2px solid ${tokens.accent}`,
              color: tokens.accent,
              fontSize: 22,
            }}
          >
            {site.shortName}
          </div>
          {/* One text node: Satori requires explicit display on any element
              with more than one child, and JSX interpolation splits this. */}
          <div
            style={{ color: tokens.fgFaint, fontSize: 24, letterSpacing: 2 }}
          >
            {`${site.location.city.toUpperCase()} · ${site.location.country}`}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              color: tokens.accent,
              fontSize: 26,
              letterSpacing: 6,
              textTransform: "uppercase",
            }}
          >
            {site.role}
          </div>
          <div
            style={{
              color: tokens.fg,
              fontSize: 132,
              fontWeight: 800,
              letterSpacing: -6,
              lineHeight: 1,
              marginTop: 18,
            }}
          >
            {hero.name}
          </div>
        </div>

        <div style={{ display: "flex", gap: 14 }}>
          {chips.map((chip) => (
            <div
              key={chip}
              style={{
                display: "flex",
                padding: "12px 22px",
                borderRadius: 10,
                border: `1px solid ${tokens.border}`,
                background: tokens.bgElev,
                color: tokens.accent2,
                fontSize: 26,
              }}
            >
              {chip}
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
