import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { MOTION_TOKENS } from "@/lib/motion-tokens";

gsap.registerPlugin(ScrollTrigger);

const SELECTORS = {
  eyebrow: '[data-hero-motion="eyebrow"]',
  title: '[data-hero-motion="title"]',
  practice: '[data-hero-motion="practice"]',
  action: '[data-hero-motion="action"]',
  socials: '[data-hero-motion="socials"]',
  poster: '[data-hero-motion="poster"]',
  content: '[data-hero-motion="content"]',
} as const;

export function createHeroChoreography(hero: HTMLElement) {
  const context = gsap.context(() => {
    const media = gsap.matchMedia();
    const motionTargets = hero.querySelectorAll<HTMLElement>("[data-hero-motion]");
    const poster = hero.querySelector<HTMLElement>(SELECTORS.poster);

    media.add("(prefers-reduced-motion: reduce)", () => {
      gsap.set(motionTargets, { clearProps: "all" });
      if (poster) gsap.set(poster, { autoAlpha: 1, clearProps: "transform" });
    });

    media.add("(prefers-reduced-motion: no-preference)", () => {
      const content = hero.querySelector<HTMLElement>(SELECTORS.content);
      const eyebrow = hero.querySelector<HTMLElement>(SELECTORS.eyebrow);
      const title = hero.querySelector<HTMLElement>(SELECTORS.title);
      const practice = hero.querySelector<HTMLElement>(SELECTORS.practice);
      const actions = hero.querySelectorAll<HTMLElement>(SELECTORS.action);
      const socials = hero.querySelector<HTMLElement>(SELECTORS.socials);
      const sceneOwner = document.querySelector<HTMLElement>("[data-lab-scene-ready]");

      let entrance: gsap.core.Timeline | undefined;
      let departure: gsap.core.Tween | undefined;
      let handoff: gsap.core.Tween | undefined;
      let animationFrame = 0;

      const syncPosterWithScene = () => {
        if (!poster || !sceneOwner) return;

        const isSceneReady = sceneOwner.dataset.labSceneReady === "true";
        handoff?.kill();
        handoff = gsap.to(poster, {
          autoAlpha: isSceneReady ? 0 : 1,
          duration: MOTION_TOKENS.duration.standard,
          ease: MOTION_TOKENS.easing.standard,
          overwrite: "auto",
        });
      };

      let sceneObserver: MutationObserver | undefined;
      if (sceneOwner) {
        sceneObserver = new MutationObserver(syncPosterWithScene);
        sceneObserver.observe(sceneOwner, {
          attributes: true,
          attributeFilter: ["data-lab-scene-ready"],
        });
      }

      animationFrame = window.requestAnimationFrame(() => {
        entrance = gsap.timeline({ defaults: { ease: MOTION_TOKENS.easing.enter } });

        entrance
          .from(eyebrow, {
            autoAlpha: 0,
            y: MOTION_TOKENS.distance.subtle,
            duration: MOTION_TOKENS.duration.standard,
          })
          .from(
            title,
            {
              autoAlpha: 0,
              y: MOTION_TOKENS.distance.editorial,
              duration: MOTION_TOKENS.duration.deliberate,
            },
            MOTION_TOKENS.delay.editorialStep,
          )
          .from(
            practice,
            {
              autoAlpha: 0,
              y: MOTION_TOKENS.distance.control,
              duration: MOTION_TOKENS.duration.standard,
            },
            MOTION_TOKENS.delay.editorialStep * 2.75,
          )
          .from(
            actions,
            {
              autoAlpha: 0,
              y: MOTION_TOKENS.distance.control,
              duration: MOTION_TOKENS.duration.standard,
              stagger: MOTION_TOKENS.delay.editorialStep,
            },
            MOTION_TOKENS.delay.editorialStep * 4.5,
          )
          .from(
            socials,
            {
              autoAlpha: 0,
              y: MOTION_TOKENS.distance.subtle,
              duration: MOTION_TOKENS.duration.standard,
            },
            MOTION_TOKENS.delay.editorialStep * 6,
          );

        if (poster && sceneOwner?.dataset.labSceneReady !== "true") {
          entrance.from(
            poster,
            {
              autoAlpha: MOTION_TOKENS.opacity.mediaArrival,
              scale: MOTION_TOKENS.scale.mediaArrival,
              duration: MOTION_TOKENS.duration.deliberate,
            },
            MOTION_TOKENS.delay.editorialStep * 1.75,
          );
        }

        if (content) {
          departure = gsap.to(content, {
            autoAlpha: MOTION_TOKENS.opacity.departure,
            y: -MOTION_TOKENS.distance.departure,
            ease: MOTION_TOKENS.easing.linear,
            scrollTrigger: {
              trigger: hero,
              start: MOTION_TOKENS.scroll.heroStart,
              end: MOTION_TOKENS.scroll.heroEnd,
              scrub: MOTION_TOKENS.scroll.scrub,
              invalidateOnRefresh: true,
            },
          });
        }

        if (sceneOwner?.dataset.labSceneReady === "true") {
          syncPosterWithScene();
        }
      });

      return () => {
        window.cancelAnimationFrame(animationFrame);
        sceneObserver?.disconnect();
        entrance?.kill();
        departure?.scrollTrigger?.kill();
        departure?.kill();
        handoff?.kill();
      };
    });

    return () => media.revert();
  }, hero);

  return () => context.revert();
}
