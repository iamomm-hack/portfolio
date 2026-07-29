import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { MOTION_TOKENS } from "@/lib/motion-tokens";

gsap.registerPlugin(ScrollTrigger);

const PROJECT_HOVER_DURATION = 0.3;

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
      "(prefers-reduced-motion: no-preference)",
      () => {
        const cleanups: Array<() => void> = [];
        const cards = section.querySelectorAll<HTMLElement>(
          "[data-project-card]",
        );

        cards.forEach((card) => {
          const visual = card.querySelector<HTMLElement>("[data-project-media]");
          const image = card.querySelector<HTMLElement>("[data-project-image]");
          const overlay = card.querySelector<HTMLElement>("[data-project-overlay]");
          const actions = card.querySelector<HTMLElement>("[data-project-actions]");
          const glow = card.querySelector<HTMLElement>("[data-project-glow]");
          const title = card.querySelector<HTMLElement>("[data-project-title]");
          const actionButtons = card.querySelectorAll<HTMLElement>(
            "[data-project-action]",
          );
          if (!visual) return;

          let bounds: DOMRect | undefined;

          const moveX = gsap.quickTo(visual, "x", {
            duration: PROJECT_HOVER_DURATION,
            ease: MOTION_TOKENS.easing.standard,
          });
          const moveY = gsap.quickTo(visual, "y", {
            duration: PROJECT_HOVER_DURATION,
            ease: MOTION_TOKENS.easing.standard,
          });

          const handlePointerMove = (event: PointerEvent) => {
            if (!bounds) return;
            const horizontal = (event.clientX - bounds.left) / bounds.width - 0.5;
            const vertical = (event.clientY - bounds.top) / bounds.height - 0.5;

            moveX(horizontal * MOTION_TOKENS.distance.control);
            moveY(vertical * MOTION_TOKENS.distance.subtle);
          };

          const animateCard = (isActive: boolean) => {
            const tween = {
              duration: PROJECT_HOVER_DURATION,
              ease: MOTION_TOKENS.easing.standard,
              overwrite: "auto" as const,
            };

            gsap.to(card, { ...tween, y: isActive ? -6 : 0 });
            if (image) gsap.to(image, { ...tween, scale: isActive ? 1.04 : 1 });
            if (overlay) gsap.to(overlay, { ...tween, opacity: isActive ? 0.444 : 1 });
            if (actions) {
              gsap.to(actions, {
                ...tween,
                opacity: isActive ? 1 : 0,
                y: isActive ? 0 : MOTION_TOKENS.distance.subtle,
              });
            }
            if (glow) gsap.to(glow, { ...tween, opacity: isActive ? 1 : 0 });
            if (title) {
              gsap.to(title, {
                ...tween,
                color: isActive ? "rgb(224, 232, 205)" : "rgb(242, 240, 233)",
              });
            }
          };

          const resetPosition = () => {
            bounds = undefined;
            moveX(0);
            moveY(0);
            if (!card.contains(document.activeElement)) animateCard(false);
          };

          const captureBounds = () => {
            bounds = card.getBoundingClientRect();
            animateCard(true);
          };

          const handleFocusIn = () => animateCard(true);
          const handleFocusOut = (event: FocusEvent) => {
            if (
              event.relatedTarget instanceof Node &&
              card.contains(event.relatedTarget)
            ) {
              return;
            }
            animateCard(false);
          };

          card.addEventListener("pointerenter", captureBounds);
          card.addEventListener("pointermove", handlePointerMove);
          card.addEventListener("pointerleave", resetPosition);
          card.addEventListener("focusin", handleFocusIn);
          card.addEventListener("focusout", handleFocusOut);

          actionButtons.forEach((button) => {
            const liftButton = () =>
              gsap.to(button, {
                y: -4,
                duration: PROJECT_HOVER_DURATION,
                ease: MOTION_TOKENS.easing.standard,
                overwrite: "auto",
              });
            const resetButton = () =>
              gsap.to(button, {
                y: 0,
                duration: PROJECT_HOVER_DURATION,
                ease: MOTION_TOKENS.easing.standard,
                overwrite: "auto",
              });

            button.addEventListener("pointerenter", liftButton);
            button.addEventListener("pointerleave", resetButton);
            button.addEventListener("focus", liftButton);
            button.addEventListener("blur", resetButton);
            cleanups.push(() => {
              button.removeEventListener("pointerenter", liftButton);
              button.removeEventListener("pointerleave", resetButton);
              button.removeEventListener("focus", liftButton);
              button.removeEventListener("blur", resetButton);
            });
          });

          cleanups.push(() => {
            card.removeEventListener("pointerenter", captureBounds);
            card.removeEventListener("pointermove", handlePointerMove);
            card.removeEventListener("pointerleave", resetPosition);
            card.removeEventListener("focusin", handleFocusIn);
            card.removeEventListener("focusout", handleFocusOut);
            gsap.killTweensOf([
              card,
              visual,
              image,
              overlay,
              actions,
              glow,
              title,
              ...Array.from(actionButtons),
            ]);
            gsap.set(
              [
                card,
                visual,
                image,
                overlay,
                actions,
                glow,
                title,
                ...Array.from(actionButtons),
              ].filter(Boolean),
              { clearProps: "transform,opacity,color" },
            );
          });
        });

        return () => cleanups.forEach((cleanup) => cleanup());
      },
    );

    return () => media.revert();
  }, section);

  return () => context.revert();
}
