import { About } from "@/components/sections/about";
import { Built } from "@/components/sections/built";
import { Contact } from "@/components/sections/contact";
import { Fall } from "@/components/sections/fall";
import { Hero } from "@/components/sections/hero";
import { Stack } from "@/components/sections/stack";
import { Stats } from "@/components/sections/stats";
import { Work } from "@/components/sections/work";

export default function Home() {
  return (
    <main id="main" tabIndex={-1} className="outline-none">
      <Fall />
      {/* Opaque so it slides over the fixed falling figure. The fade above its
          top edge softens the seam he disappears behind. */}
      <div className="dot-grid relative z-10 bg-bg before:pointer-events-none before:absolute before:inset-x-0 before:-top-24 before:h-24 before:bg-linear-to-t before:from-bg before:to-transparent">
        <Hero />
        <About />
        <Work />
        <Stats />
        <Stack />
        <Built />
        <Contact />
      </div>
    </main>
  );
}
