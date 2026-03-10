import { useMotionValueEvent, useReducedMotion, useScroll } from "framer-motion";
import { RefObject, useMemo, useState } from "react";

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

type UseScrollStepsArgs = {
  targetRef: RefObject<HTMLElement | null>;
  steps: number;
  hysteresis?: number;
};

export function useScrollSteps({ targetRef, steps, hysteresis = 0.12 }: UseScrollStepsArgs) {
  const reduceMotion = !!useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"],
  });

  const [activeIndex, setActiveIndex] = useState(0);

  const stepSize = useMemo(() => 1 / steps, [steps]);
  const margin = useMemo(() => stepSize * hysteresis, [stepSize, hysteresis]);

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const progress = clamp(p, 0, 0.999999);
    const hard = clamp(Math.floor(progress * steps), 0, steps - 1);

    setActiveIndex((current) => {
      if (reduceMotion) return hard;

      if (progress > (current + 1) * stepSize + margin) return clamp(current + 1, 0, steps - 1);
      if (progress < current * stepSize - margin) return clamp(current - 1, 0, steps - 1);

      return current;
    });
  });

  return { activeIndex, scrollYProgress, reduceMotion };
}

