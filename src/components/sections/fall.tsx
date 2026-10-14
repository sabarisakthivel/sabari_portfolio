import { FallingMan } from "@/components/ui/falling-man";
import { ScrollCue } from "@/components/ui/scroll-cue";
import { hero } from "@/data/content";

const SPACER_ID = "fall";

/**
 * The first screen after the deploy intro: the falling figure on its own.
 *
 * This block is only a transparent spacer the height of the viewport, less
 * the sticky navbar. The canvas is fixed behind everything, and the page layer
 * that follows (see page.tsx) is opaque, so scrolling slides the hero up over
 * him as he drops. Decorative throughout — the only control is the cue, which
 * jumps to the hero for anyone who would rather not scroll.
 */
export function Fall() {
  return (
    <div id={SPACER_ID} className="relative h-[calc(100svh-4rem)]">
      <FallingMan
        scrollTargetId={SPACER_ID}
        className="pointer-events-none fixed inset-0 z-0 size-full"
      />

      <ScrollCue
        href="#hero"
        label={hero.scrollLabel}
        className="absolute bottom-6 left-1/2 z-20 -translate-x-1/2"
      />
    </div>
  );
}
