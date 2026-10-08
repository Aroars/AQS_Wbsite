"use client";

import {
  Children,
  cloneElement,
  createContext,
  isValidElement,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
} from "react";

/*
 * Scroll-triggered reveals, CSS-driven. The markup renders visible; the
 * .reveal classes only hide an element when scripts run and the visitor
 * allows motion (see globals.css), and an IntersectionObserver adds
 * .is-visible once. Link previews, crawlers, and no-JS readers always get
 * the complete page.
 */

export function useRevealOnce<T extends HTMLElement>(rootMargin = "0px 0px -80px 0px") {
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin]);

  return { ref, visible };
}

interface AnimatedSectionProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  direction?: "up" | "down" | "left" | "right";
}

export function AnimatedSection({
  children,
  delay = 0,
  className = "",
  direction = "up",
}: AnimatedSectionProps) {
  const { ref, visible } = useRevealOnce<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={`reveal reveal-${direction} ${visible ? "is-visible" : ""} ${className}`}
      style={delay ? { transitionDelay: `${delay}s` } : undefined}
    >
      {children}
    </div>
  );
}

// Stagger: the container is observed once; each item delays by its index
const StaggerContext = createContext<{ visible: boolean; step: number }>({ visible: true, step: 0 });

interface StaggerItemProps {
  children: ReactNode;
  className?: string;
  /** Set by StaggerContainer */
  index?: number;
}

export function StaggerContainer({
  children,
  className = "",
  staggerDelay = 0.08,
}: {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
}) {
  const { ref, visible } = useRevealOnce<HTMLDivElement>();
  let i = 0;
  const items = Children.map(children, (child) => {
    if (!isValidElement(child) || child.type !== StaggerItem) return child;
    return cloneElement(child as ReactElement<StaggerItemProps>, { index: i++ });
  });
  return (
    <StaggerContext.Provider value={{ visible, step: staggerDelay }}>
      <div ref={ref} className={className}>
        {items}
      </div>
    </StaggerContext.Provider>
  );
}

export function StaggerItem({ children, className = "", index = 0 }: StaggerItemProps) {
  const { visible, step } = useContext(StaggerContext);
  return (
    <div
      className={`reveal reveal-item ${visible ? "is-visible" : ""} ${className}`}
      style={index ? { transitionDelay: `${index * step}s` } : undefined}
    >
      {children}
    </div>
  );
}
