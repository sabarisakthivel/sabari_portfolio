import { ContactButton } from "@/components/ui/contact-button";
import { FadeIn } from "@/components/ui/fade-in";
import { Magnetic } from "@/components/ui/magnetic";
import { Parallax } from "@/components/ui/parallax";
import { SplitHeading } from "@/components/ui/split-heading";
import { TiltPortrait } from "@/components/ui/tilt-portrait";
import { hero, nav } from "@/data/content";
import { isResolved } from "@/lib/utils";

/** "Hi, I'm" and "Sabari" — split so phones can stack them. */
const splitAt = hero.greeting.lastIndexOf(" ");
const greetingLead = hero.greeting.slice(0, splitAt);
const greetingName = hero.greeting.slice(splitAt + 1);

/** Items whose href is still a TODO_ placeholder never render. */
const links = nav.filter((item) => isResolved(item.href));

/**
 * Full-height opener over the laser backdrop: nav, the giant greeting whose
 * letters flip up once the deploy log lifts, the floating portrait, and the
 * blurb plus contact pill along the bottom. Scrolling away pulls the heading
 * up and lets the portrait sink and shrink — two depths parting.
 */
export function Hero() {
  return (
    <section
      id="hero"
      aria-labelledby="hero-heading"
      className="relative flex h-svh min-h-[34rem] flex-col overflow-x-clip"
    >
      <FadeIn as="nav" y={-20} waitForIntro className="relative z-20 px-6 pt-6 md:px-10 md:pt-8">
        <ul className="flex items-center justify-between text-sm font-medium tracking-wider text-fg uppercase md:text-lg lg:text-[1.4rem]">
          {links.map((item) => (
            <li key={item.label}>
              <a
                href={item.href}
                {...(item.external ? { target: "_blank", rel: "noopener noreferrer" } : undefined)}
                className="transition-opacity duration-200 hover:opacity-70"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </FadeIn>

      <Parallax anchor="top" range={-160} className="overflow-hidden">
        <SplitHeading
          as="h1"
          id="hero-heading"
          waitForIntro
          delay={0.1}
          lines={[greetingLead, greetingName]}
          lineClassName="block sm:inline"
          className="mt-8 w-full text-center text-[22vw] leading-[0.92] font-black tracking-tight uppercase sm:mt-4 sm:text-[13.2vw] sm:leading-none sm:whitespace-nowrap md:-mt-2 lg:text-[15vw]"
        />
      </Parallax>

      <div className="absolute top-1/2 left-1/2 z-10 w-[280px] -translate-x-1/2 -translate-y-1/2 sm:top-auto sm:bottom-0 sm:w-[360px] sm:translate-y-0 md:w-[440px] lg:w-[600px] xl:w-[660px]">
        <Parallax anchor="top" range={140} scaleTo={0.82}>
          <FadeIn delay={0.6} y={60} waitForIntro>
            <div className="float-b">
              <TiltPortrait
                src={hero.portrait.src}
                alt={hero.portrait.alt}
                width={hero.portrait.width}
                height={hero.portrait.height}
              />
            </div>
          </FadeIn>
        </Parallax>
      </div>

      <div className="relative z-20 mt-auto flex flex-col items-center gap-5 px-6 pb-8 text-center sm:flex-row sm:items-end sm:justify-between sm:gap-6 sm:text-left md:px-10 md:pb-10">
        <FadeIn
          as="p"
          delay={0.45}
          y={20}
          waitForIntro
          className="max-w-[300px] text-[clamp(0.85rem,1.4vw,1.5rem)] leading-snug font-light tracking-wide text-fg uppercase sm:max-w-[240px] md:max-w-[300px]"
        >
          {hero.blurb}
        </FadeIn>
        <FadeIn delay={0.6} y={20} waitForIntro className="w-full sm:w-auto">
          <Magnetic className="w-full sm:w-auto">
            <ContactButton href="#contact" className="w-full sm:w-auto" />
          </Magnetic>
        </FadeIn>
      </div>
    </section>
  );
}
