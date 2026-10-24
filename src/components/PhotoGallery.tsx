"use client";

import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { urlFor } from "@/sanity/lib/image";
import type { SiteSettings } from "@/sanity/lib/queries";
import background from "@/assets/images/gallery-background.jpg";

gsap.registerPlugin(ScrollTrigger);

// Photo gallery below the Education panel, like the gallery on
// charlesleclerc.com. As it scrolls in, the panel opens from the content
// width to the full screen over a dark background photo. It then stays in
// place (pinned) while scrolling flies through the photos in 3D: each photo
// appears small and faint far away near the middle, comes closer while
// drifting out to its side (alternating left and right), grows past the
// screen edge and is gone, while the next ones already approach behind it.
// After the last photo the background fades to the footer's black, so the
// gallery runs straight into the footer.
// Works for any number of photos: each photo gets the same scroll distance.
//
// Without JavaScript or with reduced motion the photos are a simple grid
// (no data-active attribute, see the classes below).

type Photo = NonNullable<SiteSettings["photoGrid"]>[number];

// Depth in px (the stage has a 1000px perspective): photos start far away
// and fly past the viewer just before reaching the perspective distance.
const FAR = -2600;
const PAST = 760;
// How many photo steps one photo takes from far away to past the viewer;
// about this many photos are on screen at once.
const FLIGHT = 3;

export function PhotoGallery({ photos }: { photos: Photo[] }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const media = gsap.matchMedia();

    media.add("(prefers-reduced-motion: no-preference)", () => {
      root.dataset.active = "";
      const q = gsap.utils.selector(root);
      const items = q("[data-gallery-photo]");
      const count = items.length;
      // Scroll distance per photo: most of a screen height, a bit less when
      // there are many photos so the gallery does not get endless.
      const step = () => window.innerHeight * gsap.utils.clamp(0.5, 0.9, 3.6 / count);
      // Sideways distance of a photo from the middle: half its width plus a
      // gap, so the photos alternate left and right of a free middle strip
      // like on the example site. The gap grows with the screen: about 1% of
      // the width on phones, 5% on desktops. Measured again on every resize
      // (invalidateOnRefresh below).
      const gap = () => window.innerWidth * gsap.utils.clamp(0.01, 0.05, gsap.utils.mapRange(375, 1440, 0.01, 0.05, window.innerWidth));
      const offset = () => (items[0]?.offsetWidth ?? 0) / 2 + gap() / 2;
      const length = count - 1 + FLIGHT;

      // Opening: from the width of the content above to the full screen.
      gsap.fromTo(
        root,
        { clipPath: () => `inset(0px ${(root.clientWidth - Math.min(root.clientWidth, contentWidth())) / 2}px round 4px)` },
        {
          clipPath: "inset(0px 0px round 0px)",
          ease: "none",
          immediateRender: true,
          // Fully open a little before the gallery reaches the top and stops.
          scrollTrigger: { trigger: root, start: "top bottom", end: "top 25%", scrub: 1, invalidateOnRefresh: true },
        },
      );

      const timeline = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: () => `+=${(length + 0.3) * step()}`,
          pin: true,
          anticipatePin: 1,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });

      // The background darkens as the photos arrive, and turns fully black
      // (the footer's color) after the last one.
      const shade = q("[data-gallery-shade]");
      timeline.fromTo(shade, { opacity: 0.35 }, { opacity: 0.7, duration: 1 }, 0);
      timeline.to(shade, { opacity: 1, duration: 0.8 }, length - 0.5);

      items.forEach((photo, index) => {
        const side = index % 2 === 0 ? -1 : 1;
        // Closer photos cover the ones further away.
        gsap.set(photo, { zIndex: count - index, xPercent: -50, yPercent: -50, z: FAR });
        // Moving straight towards the viewer: the perspective makes the photo
        // grow and drift outwards to its side by itself, faster and faster.
        timeline.fromTo(
          photo,
          { z: FAR, x: () => side * offset() },
          { z: PAST, x: () => side * offset(), duration: FLIGHT },
          index,
        );
        // Fades in while far away, and out right as it passes the viewer.
        timeline.fromTo(photo, { autoAlpha: 0 }, { autoAlpha: 1, duration: FLIGHT * 0.3 }, index);
        timeline.to(photo, { autoAlpha: 0, duration: 0.15 }, index + FLIGHT - 0.15);
      });
      timeline.to({}, { duration: 0.3 });

      return () => {
        delete root.dataset.active;
      };
    });

    return () => media.revert();
  }, []);

  return (
    <div
      ref={rootRef}
      data-gallery
      // lvh: the tallest screen height, so no strip of the page shows below
      // the gallery while the phone's address bar hides or shows.
      className="group/gallery relative mt-8 lg:mt-12 data-active:mt-[clamp(3rem,10svh,7rem)] data-active:h-lvh data-active:overflow-hidden data-active:bg-ink"
    >
      {/* Background photo: framed on the person on every screen shape. */}
      <div aria-hidden="true" className="absolute inset-0 hidden group-data-active/gallery:block">
        <div className="absolute inset-0">
          <Image
            src={background}
            alt=""
            fill
            sizes="100vw"
            placeholder="blur"
            className="object-cover object-[42%_45%]"
          />
        </div>
        <div data-gallery-shade className="absolute inset-0 bg-ink will-change-[opacity]" />
      </div>

      <div className="relative mx-auto h-full max-w-content px-gutter group-data-active/gallery:max-w-none group-data-active/gallery:px-0">
        <ul className="grid grid-cols-2 gap-1.5 lg:grid-cols-4 group-data-active/gallery:absolute group-data-active/gallery:inset-0 group-data-active/gallery:block group-data-active/gallery:[perspective:1000px]">
          {/* Just the photos: no frame, shadow or hover effect, so the 3D
              flight stays smooth. */}
          {photos.map((photo) => (
            <li
              key={photo._key}
              data-gallery-photo
              className="relative aspect-[2/3] group-data-active/gallery:absolute group-data-active/gallery:top-1/2 group-data-active/gallery:left-1/2 group-data-active/gallery:w-[min(46vw,40svh)] group-data-active/gallery:will-change-transform group-data-active/gallery:backface-hidden"
            >
              <Image
                src={urlFor(photo)}
                alt={photo.alt ?? ""}
                fill
                sizes="(min-width: 1024px) 60vw, 90vw"
                className="object-cover"
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// Width of the page content (max-w-content minus the side gutters), used for
// the opening animation: the gallery starts exactly as wide as the content.
function contentWidth() {
  const rem = parseFloat(getComputedStyle(document.documentElement).fontSize);
  const gutter = gsap.utils.clamp(rem, 4 * rem, window.innerWidth * 0.05);
  return Math.min(window.innerWidth, 83.75 * rem) - 2 * gutter;
}
