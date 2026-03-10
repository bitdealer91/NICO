"use client";

import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";
import { useLayoutEffect, useRef, useState } from "react";

function useElementWidth(ref: React.RefObject<HTMLElement | null>) {
  const [width, setWidth] = useState(0);

  useLayoutEffect(() => {
    function update() {
      if (ref.current) setWidth(ref.current.offsetWidth);
    }
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [ref]);

  return width;
}

function wrap(min: number, max: number, v: number) {
  const range = max - min;
  if (range === 0) return min;
  return (((v - min) % range + range) % range) + min;
}

type ScrollVelocityTextProps = {
  text: string;
  className?: string;
  baseVelocity?: number;
  numCopies?: number;
  damping?: number;
  stiffness?: number;
};

export function ScrollVelocityText({
  text,
  className,
  baseVelocity = 50,
  numCopies = 12,
  damping = 50,
  stiffness = 400,
}: ScrollVelocityTextProps) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping, stiffness });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], {
    clamp: false,
  });

  const copyRef = useRef<HTMLSpanElement>(null);
  const copyWidth = useElementWidth(copyRef);

  const x = useTransform(baseX, (v) => {
    if (copyWidth === 0) return "0px";
    return `${wrap(-copyWidth, 0, v)}px`;
  });

  const directionFactor = useRef(1);

  useAnimationFrame((_, delta) => {
    let moveBy = directionFactor.current * baseVelocity * (delta / 1000);

    if (velocityFactor.get() < 0) {
      directionFactor.current = -1;
    } else if (velocityFactor.get() > 0) {
      directionFactor.current = 1;
    }

    moveBy += directionFactor.current * moveBy * velocityFactor.get();
    baseX.set(baseX.get() + moveBy);
  });

  return (
    <div className="overflow-hidden whitespace-nowrap">
      <motion.div className="inline-flex" style={{ x }}>
        {Array.from({ length: numCopies }).map((_, i) => (
          <span
            key={i}
            ref={i === 0 ? copyRef : undefined}
            className={className}
          >
            {text}&nbsp;
          </span>
        ))}
      </motion.div>
    </div>
  );
}
