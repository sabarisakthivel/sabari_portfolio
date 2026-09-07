import { About } from "@/components/sections/about";
import { Built } from "@/components/sections/built";
import { Contact } from "@/components/sections/contact";
import { Hero } from "@/components/sections/hero";
import { Stack } from "@/components/sections/stack";
import { Stats } from "@/components/sections/stats";
import { Work } from "@/components/sections/work";

export default function Home() {
  return (
    <main id="main" tabIndex={-1} className="outline-none">
      <Hero />
      <About />
      <Work />
      <Stats />
      <Stack />
      <Built />
      <Contact />
    </main>
  );
}
