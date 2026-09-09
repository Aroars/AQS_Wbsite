"use client";

import { useEffect, useRef, useState, type RefObject } from "react";

/** Site nav height once the page has scrolled; TabNav's sticky top matches it */
const NAV_H = 53;
/** Upward wheel travel that releases the barrier: about a dozen mouse notches, or one firm trackpad swipe */
const THRESHOLD = 1200;
/** How long the accumulated travel survives without another upward tick */
const IDLE_RESET = 1600;
/** Wheel input is swallowed this long while the page glides back to the intro */
const RELEASE_LOCK = 900;

/**
 * Scroll-snap barrier for the toolbox title strip.
 *
 * Downward: native CSS scroll snap (html.toolbox-snap + .toolbox-snap-target)
 * docks the strip under the site nav whenever a scroll ends near it, so the
 * tab bar lands flush at the top instead of half an intro showing.
 *
 * Upward: once docked, wheel-up is held and accumulated. Clearing THRESHOLD
 * releases it with a smooth scroll to the intro, so a stray notch cannot drag
 * the header back down but a deliberate scroll still gets there. Returns the
 * 0..1 progress toward release for a visual cue. Touch scrolling is untouched:
 * it gets the CSS snap only.
 */
export function useSnapBarrier(target: RefObject<HTMLElement | null>): number {
  const [progress, setProgress] = useState(0);
  const travelled = useRef(0);
  const idleTimer = useRef<number | undefined>(undefined);
  const releasing = useRef(false);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("toolbox-snap");

    const reset = () => {
      travelled.current = 0;
      setProgress(0);
    };

    const onWheel = (e: WheelEvent) => {
      const el = target.current;
      if (!el) return;
      if (releasing.current) {
        e.preventDefault();
        return;
      }
      if (e.deltaY >= 0) {
        if (travelled.current) reset();
        return;
      }
      const docked = Math.abs(el.getBoundingClientRect().top - NAV_H) < 6;
      if (!docked) {
        if (travelled.current) reset();
        return;
      }

      e.preventDefault();
      const px =
        e.deltaMode === 1 ? -e.deltaY * 16 : e.deltaMode === 2 ? -e.deltaY * window.innerHeight : -e.deltaY;
      travelled.current += px;
      window.clearTimeout(idleTimer.current);

      if (travelled.current >= THRESHOLD) {
        releasing.current = true;
        reset();
        window.scrollTo({ top: 0, behavior: "smooth" });
        window.setTimeout(() => {
          releasing.current = false;
        }, RELEASE_LOCK);
        return;
      }

      setProgress(Math.min(1, travelled.current / THRESHOLD));
      idleTimer.current = window.setTimeout(reset, IDLE_RESET);
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      root.classList.remove("toolbox-snap");
      window.removeEventListener("wheel", onWheel);
      window.clearTimeout(idleTimer.current);
    };
  }, [target]);

  return progress;
}
