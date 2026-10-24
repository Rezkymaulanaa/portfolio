"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// GSAP animations of the home page hero (markup in Hero.tsx).
// - Intro, once when the page opens: the photo opens like a curtain from the
//   bottom while it settles from a zoom, the letters of the name slide up one
//   by one, then the other texts fade in.
// - While scrolling away from the hero: the parts move at slightly different
//   speeds (parallax) and the photo zooms in a little.
// The parts are found by data attributes:
//   data-hero-intro  hidden until the intro starts (globals.css)
//   data-hero-name / -char / -photo / -media / -zoom / -frame / -drift / -text / -fade / -arrow
// Nothing moves for visitors who prefer reduced motion. After an EN | ID
// switch the hero is rebuilt in the other language; it then appears at once
// instead of playing the intro again.

export function HeroMotion({ className, children }: { className?: string; children: ReactNode }) {
  const heroRef = useRef<HTMLElement>(null);

  // A layout effect runs before the browser draws the hero, so the start
  // positions are set before anything is visible.
  useLayoutEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    const skipIntro = Boolean(window.__revealInstant);
    const media = gsap.matchMedia(hero);

    media.add("(prefers-reduced-motion: no-preference)", () => {
      const q = gsap.utils.selector(hero);
      gsap.set(q("[data-hero-intro]"), { visibility: "visible" });

      if (!skipIntro) {
        gsap
          .timeline({ defaults: { ease: "power4.out" } })
          .fromTo(
            q("[data-hero-photo]"),
            { clipPath: "inset(100% 0% 0% 0%)" },
            { clipPath: "inset(0% 0% 0% 0%)", duration: 1.4, ease: "expo.inOut" },
            0,
          )
          .from(q("[data-hero-media]"), { scale: 1.4, duration: 2.2, ease: "expo.out" }, 0.2)
          .from(q("[data-hero-char]"), { yPercent: 160, duration: 1.2, stagger: 0.03 }, 0.45)
          .from(
            q("[data-hero-text]"),
            { y: 24, autoAlpha: 0, filter: "blur(6px)", duration: 1.1, stagger: 0.12, clearProps: "filter" },
            1,
          );
      }

      // "browse projects" arrow: a slow up-and-down hint.
      gsap.to(q("[data-hero-arrow]"), { y: 6, duration: 0.9, ease: "sine.inOut", yoyo: true, repeat: -1 });

      // Parallax while the hero scrolls out of view. Distances are a share of
      // the screen height; "scrub" lets each part trail the scroll a little.
      const scroll = { trigger: hero, start: "top top", end: "bottom top", scrub: 0.6, invalidateOnRefresh: true };
      const drift = (share: number) => () => window.innerHeight * share;
      gsap.to(q("[data-hero-name]"), { y: drift(-0.18), ease: "none", scrollTrigger: scroll });
      gsap.to(q("[data-hero-frame]"), { y: drift(0.12), ease: "none", scrollTrigger: scroll });
      gsap.to(q("[data-hero-zoom]"), { scale: 1.15, ease: "none", scrollTrigger: scroll });
      q("[data-hero-drift]").forEach((element) => {
        const share = Number(element.dataset.heroDrift) || 0;
        gsap.to(element, { y: drift(share), ease: "none", scrollTrigger: scroll });
      });
      gsap.to(q("[data-hero-fade]"), {
        opacity: 0,
        ease: "none",
        scrollTrigger: { ...scroll, end: "30% top" },
      });
    });

    return () => media.revert();
  }, []);

  return (
    <section ref={heroRef} className={className}>
      {children}
    </section>
  );
}
