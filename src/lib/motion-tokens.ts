export const MOTION_TOKENS = {
  duration: {
    quick: 0.2,
    standard: 0.4,
    deliberate: 0.7,
  },
  delay: {
    editorialStep: 0.08,
  },
  distance: {
    subtle: 8,
    control: 12,
    editorial: 24,
    departure: 32,
  },
  easing: {
    enter: "power3.out",
    standard: "power2.out",
    linear: "none",
  },
  opacity: {
    mediaArrival: 0.72,
    departure: 0.18,
  },
  scale: {
    mediaArrival: 0.985,
  },
  scroll: {
    heroStart: "top top",
    heroEnd: "bottom top",
    scrub: 0.6,
  },
} as const;

