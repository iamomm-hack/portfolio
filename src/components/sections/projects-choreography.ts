import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { MOTION_TOKENS } from "@/lib/motion-tokens";

gsap.registerPlugin(ScrollTrigger);

export function createProjectsChoreography(section: HTMLElement) {
  const context = gsap.context(() => {
    const media = gsap.matchMedia();
    const revealTargets = section.querySelectorAll<HTMLElement>(
      "[data-project-reveal]",
    );
    const projectMedia = section.querySelectorAll<HTMLElement>(
      "[data-project-media]",
    );

    media.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set(
        [...Array.from(revealTargets), ...Array.from(projectMedia)],
        { clearProps: "all" },
      );
    });

    media.add("(prefers-reduced-motion: no-preference)", () => {
      const timeline = gsap.timeline({
        defaults: {
          duration: MOTION_TOKENS.duration.deliberate,
          ease: MOTION_TOKENS.easing.enter,
        },
        scrollTrigger: {
          trigger: section,
          start: "top 76%",
          once: true,
        },
      });

      timeline.from(revealTargets, {
        opacity: 0,
        y: MOTION_TOKENS.distance.editorial,
        stagger: MOTION_TOKENS.delay.editorialStep,
      });

      return () => {
        timeline.scrollTrigger?.kill();
        timeline.kill();
      };
    });

    media.add(
      "(prefers-reduced-motion: no-preference) and (hover: hover) and (pointer: fine)",
      () => {
        const cleanups: Array<() => void> = [];
        const cards = section.querySelectorAll<HTMLElement>(
          "[data-project-card]",
        );

        cards.forEach((card) => {
          const visual = card.querySelector<HTMLElement>("[data-project-media]");
          if (!visual) return;

          let bounds: DOMRect | undefined;

          const moveX = gsap.quickTo(visual, "x", {
            duration: MOTION_TOKENS.duration.standard,
            ease: MOTION_TOKENS.easing.standard,
          });
          const moveY = gsap.quickTo(visual, "y", {
            duration: MOTION_TOKENS.duration.standard,
            ease: MOTION_TOKENS.easing.standard,
          });

          const handlePointerMove = (event: PointerEvent) => {
            if (!bounds) return;
            const horizontal = (event.clientX - bounds.left) / bounds.width - 0.5;
            const vertical = (event.clientY - bounds.top) / bounds.height - 0.5;

            moveX(horizontal * MOTION_TOKENS.distance.control);
            moveY(vertical * MOTION_TOKENS.distance.subtle);
          };

          const resetPosition = () => {
            bounds = undefined;
            moveX(0);
            moveY(0);
          };

          const captureBounds = () => {
            bounds = card.getBoundingClientRect();
          };

          card.addEventListener("pointerenter", captureBounds);
          card.addEventListener("pointermove", handlePointerMove);
          card.addEventListener("pointerleave", resetPosition);
          cleanups.push(() => {
            card.removeEventListener("pointerenter", captureBounds);
            card.removeEventListener("pointermove", handlePointerMove);
            card.removeEventListener("pointerleave", resetPosition);
            gsap.set(visual, { clearProps: "transform" });
          });
        });

        return () => cleanups.forEach((cleanup) => cleanup());
      },
    );

    return () => media.revert();
  }, section);

  return () => context.revert();
}
