"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

// Slides of the Instagram Carousel mockup. Moves to the next slide every few
// seconds (not with reduced motion), with the "1/5" badge and dots like
// Instagram. No buttons: the mockup can sit inside a card link.

const SLIDE_MS = 2800;

type Slide = { src: string; alt: string };

export function CarouselSlides({ slides, sizes, preload }: { slides: Slide[]; sizes: string; preload: boolean }) {
  const [index, setIndex] = useState(0);
  const count = slides.length;

  useEffect(() => {
    if (count < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => setIndex((current) => (current + 1) % count), SLIDE_MS);
    return () => window.clearInterval(timer);
  }, [count]);

  return (
    <div className="relative aspect-[4/5] w-full bg-neutral-200">
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="flex h-full transition-transform duration-700 ease-[cubic-bezier(0.65,0,0.35,1)] motion-reduce:transition-none"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {slides.map((slide, slideIndex) => (
            <div key={slideIndex} className="relative h-full w-full shrink-0">
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                sizes={sizes}
                preload={preload && slideIndex === 0}
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      {count > 1 && (
        <>
          <span className="absolute top-[1.2cqw] right-[1.2cqw] rounded-full bg-black/60 px-[0.9cqw] py-[0.3cqw] text-[1.2cqw] leading-none font-medium text-white tabular-nums">
            {index + 1}/{count}
          </span>
          {/* Dots sit in the action row below the image, like Instagram (at most 5). */}
          <span className="absolute top-full left-1/2 mt-[2.1cqw] flex -translate-x-1/2 gap-[0.45cqw]" aria-hidden="true">
            {slides.slice(0, 5).map((_, dotIndex) => (
              <span
                key={dotIndex}
                className={`size-[0.75cqw] rounded-full transition-colors duration-300 ${
                  dotIndex === Math.min(index, 4) ? "bg-sky-500" : "bg-neutral-300"
                }`}
              />
            ))}
          </span>
        </>
      )}
    </div>
  );
}
