"use client";

import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { urlFor } from "@/sanity/lib/image";
import type { Tool } from "@/sanity/lib/queries";

gsap.registerPlugin(ScrollTrigger);

// "Tools that I usually use" (Capabilities section) as a horizontal scroll,
// like the "Animate Anything" section on gsap.com: when it reaches the top of
// the screen it stays in place (pinned) while scrolling down moves the row of
// tools from right to left; after the last tool the page scrolls on.
// Each tool flies in from its own direction (a little offset, turn and zoom)
// as it enters the screen, and a thin line at the bottom shows the progress.
// The row starts with the section title in large type, styled like the
// gsap.com example: the first word in a pink tag, two small tilted stickers,
// then plain text. Its parts drop in from different sides, and the stickers
// keep turning a little while the row moves.
//
// Without JavaScript or with reduced motion the tools simply wrap onto
// several lines (no data-active attribute, see the classes below).

// Where each tool comes from (x/y in px, rotation in degrees), repeated
// along the row. Mixed directions, small enough to stay calm.
const ENTRANCES = [
  { x: 120, y: -140, rotation: -24 },
  { x: 80, y: 150, rotation: 18 },
  { x: 200, y: -40, rotation: 32 },
  { x: 60, y: -180, rotation: 12 },
  { x: 160, y: 110, rotation: -30 },
  { x: 100, y: 40, rotation: 22 },
];

type ToolsHeading = { tag: string; stickerA: string; stickerB: string; rest: string };

export function ToolsScroller({ tools, title, heading }: { tools: Tool[]; title: string; heading: ToolsHeading }) {
  const pinRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLUListElement>(null);

  // A layout effect sets everything up before the browser draws the section,
  // so the row never shows up wrapped first.
  useLayoutEffect(() => {
    const pin = pinRef.current;
    const track = trackRef.current;
    if (!pin || !track) return;
    const media = gsap.matchMedia();

    media.add("(prefers-reduced-motion: no-preference)", () => {
      pin.dataset.active = "";
      // Smaller flights on small screens.
      const reach = () => gsap.utils.clamp(0.45, 1, window.innerWidth / 1440);
      // How far the row moves: everything past the right edge of the screen.
      const distance = () => Math.max(0, track.scrollWidth - pin.clientWidth);

      const slide = gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: pin,
          start: "top top",
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.8,
          invalidateOnRefresh: true,
        },
      });

      gsap.fromTo(
        pin.querySelector("[data-tools-progress]"),
        { scaleX: 0 },
        { scaleX: 1, ease: "none", scrollTrigger: { trigger: pin, start: "top top", end: () => `+=${distance()}`, scrub: 0.8, invalidateOnRefresh: true } },
      );

      // Large title: its parts arrive while the section scrolls up into place.
      const part = (name: string) => track.querySelector(`[data-title-part="${name}"]`);
      const arrive = (start: string) => ({ trigger: pin, start, end: "top 15%", scrub: 0.8 });
      gsap.fromTo(
        part("tag"),
        { scale: 0.5, rotation: -10, autoAlpha: 0 },
        { scale: 1, rotation: 0, autoAlpha: 1, ease: "back.out(1.6)", scrollTrigger: arrive("top 90%") },
      );
      gsap.fromTo(
        part("rest"),
        { x: () => 160 * reach(), autoAlpha: 0 },
        { x: 0, autoAlpha: 1, ease: "power2.out", invalidateOnRefresh: true, scrollTrigger: arrive("top 80%") },
      );
      gsap.fromTo(
        part("a"),
        { y: () => -160 * reach(), rotation: -45, autoAlpha: 0 },
        { y: 0, rotation: 0, autoAlpha: 1, ease: "back.out(2)", invalidateOnRefresh: true, scrollTrigger: arrive("top 75%") },
      );
      gsap.fromTo(
        part("b"),
        { y: () => 160 * reach(), rotation: 60, autoAlpha: 0 },
        { y: 0, rotation: 0, autoAlpha: 1, ease: "back.out(2)", invalidateOnRefresh: true, scrollTrigger: arrive("top 70%") },
      );
      // While the row moves away (first screen width of scrolling), the
      // stickers keep turning a little, each its own way.
      const leaving = { trigger: pin, start: "top top", end: () => `+=${pin.clientWidth}`, scrub: 0.8, invalidateOnRefresh: true };
      gsap.to(track.querySelector('[data-title-wobble="a"]'), { rotation: -12, y: -10, ease: "none", scrollTrigger: leaving });
      gsap.to(track.querySelector('[data-title-wobble="b"]'), { rotation: 16, y: 12, ease: "none", scrollTrigger: leaving });

      const items = gsap.utils.toArray<HTMLElement>("[data-tool-item]", track);
      items.forEach((item, index) => {
        const entrance = ENTRANCES[index % ENTRANCES.length];
        const from = {
          x: () => entrance.x * reach(),
          y: () => entrance.y * reach(),
          rotation: entrance.rotation,
          scale: 0.6,
          autoAlpha: 0,
        };
        const to = { x: 0, y: 0, rotation: 0, scale: 1, autoAlpha: 1, ease: "power2.out" };
        // Tools already on screen when the row stops arrive while the
        // section scrolls up into place; the others while the row moves.
        const visibleAtStart = item.offsetLeft < pin.clientWidth;
        // The inner wrapper moves; the list item stays put, so its position
        // (where the animation starts and ends) is measured correctly.
        gsap.fromTo(item.firstElementChild, from, {
          ...to,
          invalidateOnRefresh: true,
          scrollTrigger: visibleAtStart
            ? { trigger: pin, start: `top ${85 - index * 3}%`, end: "top 15%", scrub: 0.8 }
            : {
                trigger: item,
                containerAnimation: slide,
                start: "left 102%",
                // Done at 75% of the screen width. The last tools stop further
                // right when the row ends, so they finish just before their
                // final spot.
                end: () => `left ${Math.max(75, ((item.offsetLeft - distance()) / pin.clientWidth) * 100 - 2)}%`,
                scrub: 0.8,
              },
        });
      });

      return () => {
        delete pin.dataset.active;
      };
    });

    return () => media.revert();
  }, []);

  return (
    <div
      ref={pinRef}
      className="group/tools relative overflow-hidden py-6 data-active:flex data-active:h-svh data-active:flex-col data-active:justify-center data-active:py-0 lg:py-8"
    >
      {/* Plain title; while the row scrolls it is only for screen readers
          and the large title in the row is shown instead. */}
      <div className="mx-auto w-full max-w-content px-gutter group-data-active/tools:sr-only">
        <h3 className="text-h3 font-semibold lg:px-5">{title}</h3>
      </div>

      {/* Hover (or keyboard focus): the tile lifts, its border turns pink,
          the icon tilts with a small bounce, the name turns pink and the
          other tools dim (globals.css). */}
      <ul
        ref={trackRef}
        className="tool-list mx-auto mt-8 flex max-w-content flex-wrap gap-3 px-gutter sm:gap-5 group-data-active/tools:mt-0 group-data-active/tools:w-max group-data-active/tools:items-center group-data-active/tools:max-w-none group-data-active/tools:flex-nowrap group-data-active/tools:gap-[clamp(1.25rem,3vw,3rem)] group-data-active/tools:pr-[clamp(1rem,5vw,4rem)] group-data-active/tools:pl-[max(clamp(1rem,5vw,4rem),calc((100vw-83.75rem)/2+clamp(1rem,5vw,4rem)))] lg:mt-10 lg:gap-9 lg:px-[calc(clamp(1rem,5vw,4rem)+1.25rem)] lg:group-data-active/tools:pl-[calc(max(clamp(1rem,5vw,4rem),calc((100vw-83.75rem)/2+clamp(1rem,5vw,4rem)))+1.25rem)]"
      >
        <li aria-hidden="true" className="hidden shrink-0 pr-[clamp(1.5rem,5vw,5rem)] group-data-active/tools:block">
          <TitleRow heading={heading} />
        </li>
        {tools.map((tool) => (
          <li
            key={tool._id}
            data-tool-item
            className="size-14 shrink-0 sm:size-16 lg:size-[5.125rem] group-data-active/tools:size-auto"
          >
            <div>
              <div
                tabIndex={0}
                className="tool-tile group/tool flex flex-col items-center gap-3 outline-none transition-[opacity,filter] duration-500 motion-reduce:transition-none"
              >
                <div className="flex size-14 items-center justify-center rounded-card border border-page/40 bg-ink p-2 transition-[translate,border-color,background-color,box-shadow] duration-500 ease-(--ease-reveal) group-hover/tool:-translate-y-1.5 group-hover/tool:border-accent group-hover/tool:bg-page/5 group-hover/tool:shadow-[0_12px_30px_-12px_rgb(247_188_255/0.5)] group-focus-visible/tool:-translate-y-1.5 group-focus-visible/tool:border-accent sm:size-16 lg:size-[5.125rem] lg:p-3 motion-reduce:transition-none group-data-active/tools:size-[clamp(6rem,14vw,13rem)] group-data-active/tools:p-[clamp(1rem,2vw,1.75rem)]">
                  <Image
                    src={urlFor(tool.icon)}
                    alt={tool.name}
                    width={160}
                    height={160}
                    className="size-full object-contain transition-[scale,rotate] duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover/tool:scale-110 group-hover/tool:-rotate-6 group-focus-visible/tool:scale-110 group-focus-visible/tool:-rotate-6 motion-reduce:transition-none"
                  />
                </div>
                {/* Name under the icon in the scrolling row; the image alt
                    already names the tool for screen readers. */}
                <span
                  aria-hidden="true"
                  className="hidden text-small whitespace-nowrap text-page/60 transition-colors duration-300 group-hover/tool:text-accent group-focus-visible/tool:text-accent group-data-active/tools:block"
                >
                  {tool.name}
                </span>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {/* Progress of the horizontal scroll. */}
      <div className="mx-auto mt-[clamp(2rem,7svh,4.5rem)] hidden w-full max-w-content px-gutter group-data-active/tools:block">
        <div className="h-px bg-page/15 lg:mx-5">
          <div data-tools-progress className="h-full origin-left bg-accent" />
        </div>
      </div>
    </div>
  );
}

// The large title at the start of the row. Each part has an outer element
// for its arrival (data-title-part) and the stickers an inner one for the
// turning while the row moves (data-title-wobble), so the two animations
// never fight over the same element.
function TitleRow({ heading }: { heading: ToolsHeading }) {
  const sticker = "block rounded-card px-[0.35em] pt-[0.1em] pb-[0.14em] text-ink shadow-[0_0.15em_0.4em_rgb(0_0_0/0.35)]";
  return (
    <div className="flex items-center text-[clamp(3.25rem,10vw,9rem)] leading-none font-semibold tracking-[-0.035em] whitespace-nowrap">
      <span data-title-part="tag" className="block rounded-card bg-accent px-[0.2em] pt-[0.04em] pb-[0.12em] text-ink">
        {heading.tag}
      </span>
      {/* The two stickers overlap the end of the tag, one above the other. */}
      <span className="relative z-10 -ml-[0.4em] flex flex-col items-start text-[0.3em]">
        <span data-title-part="a" className="block">
          <span data-title-wobble="a" className={`${sticker} -translate-y-[0.35em] -rotate-3 bg-lilac`}>
            {heading.stickerA}
          </span>
        </span>
        <span data-title-part="b" className="ml-[0.9em] block">
          <span data-title-wobble="b" className={`${sticker} rotate-12 bg-peach`}>
            {heading.stickerB}
          </span>
        </span>
      </span>
      <span data-title-part="rest" className="ml-[0.2em] block text-page">
        {heading.rest}
      </span>
    </div>
  );
}
