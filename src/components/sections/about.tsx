import Image from "next/image";
import { AnimatedText } from "@/components/ui/animated-text";
import { ContactButton } from "@/components/ui/contact-button";
import { FadeIn } from "@/components/ui/fade-in";
import { Magnetic } from "@/components/ui/magnetic";
import { Parallax } from "@/components/ui/parallax";
import { SplitHeading } from "@/components/ui/split-heading";
import { TiltCard } from "@/components/ui/tilt-card";
import { about } from "@/data/content";

/**
 * Pre-rendered three.js objects, one per corner — decorative only. Each sits
 * at its own parallax depth and bobs on its own phase, so the four never move
 * together.
 */
const OBJECTS = [
  { src: "/objects/laptop.webp", x: -80, delay: 0.1, range: 160, float: "float-a", className: "top-[4%] left-[1%] w-[110px] sm:left-[2%] sm:w-[160px] md:left-[4%] md:w-[210px]" },
  { src: "/objects/database.webp", x: -80, delay: 0.25, range: 260, float: "float-c", className: "bottom-[6%] left-[3%] w-[90px] sm:left-[6%] sm:w-[140px] md:left-[10%] md:w-[180px]" },
  { src: "/objects/braces.webp", x: 80, delay: 0.15, range: 220, float: "float-b", className: "top-[4%] right-[1%] w-[110px] sm:right-[2%] sm:w-[160px] md:right-[4%] md:w-[210px]" },
  { src: "/objects/padlock.webp", x: 80, delay: 0.3, range: 120, float: "float-a", className: "right-[3%] bottom-[6%] w-[100px] sm:right-[6%] sm:w-[150px] md:right-[10%] md:w-[200px]" },
] as const;

export function About() {
  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="relative flex min-h-svh scroll-mt-6 flex-col items-center justify-center overflow-x-clip px-5 py-36 sm:px-8 md:px-10 md:py-40"
    >
      {OBJECTS.map((object) => (
        <div key={object.src} className={`pointer-events-none absolute ${object.className}`}>
          <Parallax range={object.range}>
            <FadeIn x={object.x} y={0} rotateY={object.x > 0 ? -50 : 50} delay={object.delay} duration={0.9}>
              <div className={object.float}>
                <Image src={object.src} alt="" width={640} height={640} className="h-auto w-full" />
              </div>
            </FadeIn>
          </Parallax>
        </div>
      ))}

      <div className="relative flex flex-col items-center gap-16 sm:gap-20 md:gap-24">
        <div className="flex flex-col items-center gap-10 sm:gap-14 md:gap-16">
          <SplitHeading
            id="about-heading"
            lines={[about.title]}
            className="text-center text-[clamp(3rem,12vw,160px)] leading-none font-black tracking-tight uppercase"
          />
          <AnimatedText
            text={about.lead}
            className="max-w-[600px] text-center text-[clamp(1.05rem,2vw,1.45rem)] leading-relaxed font-medium text-fg"
          />
        </div>

        <ul className="grid w-full max-w-4xl gap-4 sm:grid-cols-3">
          {about.principles.map((principle, index) => (
            <FadeIn as="li" key={principle.title} delay={index * 0.1} rotateX={-35} y={40}>
              <TiltCard className="h-full rounded-card border border-border bg-bg-elev/80 p-6">
                <p className="hero-heading text-3xl font-black">{String(index + 1).padStart(2, "0")}</p>
                <p className="mt-3 text-lg font-medium tracking-wide uppercase">{principle.title}</p>
                <p className="mt-2 text-sm leading-relaxed font-light text-fg-muted">{principle.text}</p>
              </TiltCard>
            </FadeIn>
          ))}
        </ul>

        <FadeIn>
          <Magnetic>
            <ContactButton href="#contact" />
          </Magnetic>
        </FadeIn>
      </div>
    </section>
  );
}
