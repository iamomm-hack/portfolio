"use client";
import React, { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { Application, SPEObject, SplineEvent } from "@splinetool/runtime";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
const Spline = React.lazy(() => import("@splinetool/react-spline"));
import { Skill, SkillNames, SKILLS } from "@/data/constants";
import { sleep } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useRouter } from "next/navigation";
import { Section, getKeyboardState } from "./animated-background-config";
import { useSounds } from "@/hooks/use-sounds";

gsap.registerPlugin(ScrollTrigger);

type AnimatedBackgroundProps = {
  isSceneActive: boolean;
  onSceneReady: (application: Application | null) => void;
  onSceneVisible: () => void;
};

const AnimatedBackground = ({
  isSceneActive,
  onSceneReady,
  onSceneVisible,
}: AnimatedBackgroundProps) => {
  const isMobile = useMediaQuery("(max-width: 767px)");
  const splineContainer = useRef<HTMLDivElement>(null);
  const [splineApp, setSplineApp] = useState<Application>();
  const selectedSkillRef = useRef<Skill | null>(null);

  const { playPressSound, playReleaseSound } = useSounds();

  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [activeSection, setActiveSection] = useState<Section>("hero");

  // Animation controllers refs
  const bongoAnimationRef = useRef<{ start: () => void; stop: () => void }>();
  const keycapAnimationsRef = useRef<{
    start: () => void;
    stop: () => void;
    dispose: () => void;
  }>();

  const [keyboardRevealed, setKeyboardRevealed] = useState(false);
  const router = useRouter();
  const sceneActiveRef = useRef(isSceneActive);
  const sceneAnimationsRef = useRef<Set<gsap.core.Animation>>(new Set());
  const sceneScrollTriggersRef = useRef<Set<ScrollTrigger>>(new Set());

  const trackSceneAnimation = useCallback((
    animation: gsap.core.Animation,
    persistent = false,
  ) => {
    sceneAnimationsRef.current.add(animation);
    if (!sceneActiveRef.current) animation.pause();

    if (!persistent) {
      animation.eventCallback("onComplete", () => {
        sceneAnimationsRef.current.delete(animation);
      });
    }
  }, []);

  const killSceneAnimation = useCallback((animation: gsap.core.Animation) => {
    animation.kill();
    sceneAnimationsRef.current.delete(animation);
  }, []);

  // --- Event Handlers ---

  const handleMouseHover = useCallback((e: SplineEvent) => {
    if (!splineApp || selectedSkillRef.current?.name === e.target.name) return;

    if (e.target.name === "body" || e.target.name === "platform") {
      if (selectedSkillRef.current) playReleaseSound();
      setSelectedSkill(null);
      selectedSkillRef.current = null;
      if (splineApp.getVariable("heading") && splineApp.getVariable("desc")) {
        splineApp.setVariable("heading", "");
        splineApp.setVariable("desc", "");
      }
    } else {
      if (!selectedSkillRef.current || selectedSkillRef.current.name !== e.target.name) {
        const skill = SKILLS[e.target.name as SkillNames];
        if (skill) {
          if (selectedSkillRef.current) playReleaseSound();
          playPressSound();
          setSelectedSkill(skill);
          selectedSkillRef.current = skill;
        }
      }
    }
  }, [playPressSound, playReleaseSound, splineApp]);

  const handleSplineInteractions = useCallback(() => {
    if (!splineApp) return;

    const isInputFocused = () => {
      const activeElement = document.activeElement;
      return (
        activeElement &&
        (activeElement.tagName === "INPUT" ||
          activeElement.tagName === "TEXTAREA" ||
          (activeElement as HTMLElement).isContentEditable)
      );
    };

    const handleKeyUp = () => {
      if (!splineApp || isInputFocused()) return;
      playReleaseSound();
      splineApp.setVariable("heading", "");
      splineApp.setVariable("desc", "");
    };
    const handleKeyDown = (e: SplineEvent) => {
      if (!splineApp || isInputFocused()) return;
      const skill = SKILLS[e.target.name as SkillNames];
      if (skill) {
        playPressSound();
        setSelectedSkill(skill);
        selectedSkillRef.current = skill;
        splineApp.setVariable("heading", skill.label);
        splineApp.setVariable("desc", skill.shortDescription);
      }
    };

    splineApp.addEventListener("keyUp", handleKeyUp);
    splineApp.addEventListener("keyDown", handleKeyDown);
    splineApp.addEventListener("mouseHover", handleMouseHover);

    return () => {
      splineApp.removeEventListener("keyUp", handleKeyUp);
      splineApp.removeEventListener("keyDown", handleKeyDown);
      splineApp.removeEventListener("mouseHover", handleMouseHover);
    };
  }, [handleMouseHover, playPressSound, playReleaseSound, splineApp]);

  // --- Animation Setup Helpers ---

  const createSectionTimeline = useCallback((
    triggerId: string,
    targetSection: Section,
    prevSection: Section,
    start: string = "top 50%",
    end: string = "bottom bottom"
  ) => {
    if (!splineApp) return;
    const kbd = splineApp.findObjectByName("keyboard");
    if (!kbd) return;

    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: triggerId,
        start,
        end,
        scrub: true,
        onEnter: () => {
          setActiveSection(targetSection);
          const state = getKeyboardState({ section: targetSection, isMobile });
          trackSceneAnimation(gsap.to(kbd.scale, { ...state.scale, duration: 1 }));
          trackSceneAnimation(gsap.to(kbd.position, { ...state.position, duration: 1 }));
          trackSceneAnimation(gsap.to(kbd.rotation, { ...state.rotation, duration: 1 }));
        },
        onLeaveBack: () => {
          setActiveSection(prevSection);
          const state = getKeyboardState({ section: prevSection, isMobile, });
          trackSceneAnimation(gsap.to(kbd.scale, { ...state.scale, duration: 1 }));
          trackSceneAnimation(gsap.to(kbd.position, { ...state.position, duration: 1 }));
          trackSceneAnimation(gsap.to(kbd.rotation, { ...state.rotation, duration: 1 }));
        },
      },
    });

    trackSceneAnimation(timeline, true);
    if (timeline.scrollTrigger) {
      sceneScrollTriggersRef.current.add(timeline.scrollTrigger);
      if (!sceneActiveRef.current) timeline.scrollTrigger.disable(false);
    }
    return timeline;
  }, [isMobile, splineApp, trackSceneAnimation]);

  const setupScrollAnimations = useCallback(() => {
    if (!splineApp || !splineContainer.current) return [];
    const kbd = splineApp.findObjectByName("keyboard");
    if (!kbd) return [];

    // Initial state
    const heroState = getKeyboardState({ section: "hero", isMobile });
    gsap.set(kbd.scale, heroState.scale);
    gsap.set(kbd.position, heroState.position);

    // Section transitions
    return [
      createSectionTimeline("#skills", "skills", "hero"),
      createSectionTimeline("#projects", "projects", "skills", "top 70%"),
      createSectionTimeline("#contact", "contact", "projects", "top 30%"),
    ].filter((timeline): timeline is gsap.core.Timeline => Boolean(timeline));
  }, [createSectionTimeline, isMobile, splineApp]);

  const getBongoAnimation = useCallback(() => {
    const framesParent = splineApp?.findObjectByName("bongo-cat");
    const frame1 = splineApp?.findObjectByName("frame-1");
    const frame2 = splineApp?.findObjectByName("frame-2");

    if (!frame1 || !frame2 || !framesParent) {
      return { start: () => { }, stop: () => { } };
    }

    let interval: NodeJS.Timeout | undefined;
    const start = () => {
      if (interval || !sceneActiveRef.current) return;
      let i = 0;
      framesParent.visible = true;
      interval = setInterval(() => {
        if (i % 2) {
          frame1.visible = false;
          frame2.visible = true;
        } else {
          frame1.visible = true;
          frame2.visible = false;
        }
        i++;
      }, 100);
    };
    const stop = () => {
      if (interval) clearInterval(interval);
      interval = undefined;
      framesParent.visible = false;
      frame1.visible = false;
      frame2.visible = false;
    };
    return { start, stop };
  }, [splineApp]);

  const getKeycapsAnimation = useCallback(() => {
    if (!splineApp) {
      return { start: () => { }, stop: () => { }, dispose: () => { } };
    }

    let tweens: gsap.core.Tween[] = [];
    let resetTimer: ReturnType<typeof setTimeout> | undefined;
    const removePrevTweens = () => {
      if (resetTimer) clearTimeout(resetTimer);
      resetTimer = undefined;
      tweens.forEach(killSceneAnimation);
      tweens = [];
    };

    const start = () => {
      if (!sceneActiveRef.current) return;
      removePrevTweens();
      Object.values(SKILLS)
        .sort(() => Math.random() - 0.5)
        .forEach((skill, idx) => {
          const keycap = splineApp.findObjectByName(skill.name);
          if (!keycap) return;
          const t = gsap.to(keycap.position, {
            y: Math.random() * 200 + 200,
            duration: Math.random() * 2 + 2,
            delay: idx * 0.6,
            repeat: -1,
            yoyo: true,
            yoyoEase: "none",
            ease: "elastic.out(1,0.3)",
          });
          trackSceneAnimation(t, true);
          tweens.push(t);
        });
    };

    const stop = () => {
      removePrevTweens();
      Object.values(SKILLS).forEach((skill) => {
        const keycap = splineApp.findObjectByName(skill.name);
        if (!keycap) return;
        const t = gsap.to(keycap.position, {
          y: 0,
          duration: 4,
          repeat: 1,
          ease: "elastic.out(1,0.7)",
        });
        trackSceneAnimation(t);
        tweens.push(t);
      });
      resetTimer = setTimeout(removePrevTweens, 1000);
    };

    return { start, stop, dispose: removePrevTweens };
  }, [killSceneAnimation, splineApp, trackSceneAnimation]);

  const updateKeyboardTransform = useCallback(async () => {
    if (!splineApp || !sceneActiveRef.current) return;
    const kbd = splineApp.findObjectByName("keyboard");
    if (!kbd) return;

    kbd.visible = false;
    await sleep(400);
    if (!sceneActiveRef.current) return;
    kbd.visible = true;
    setKeyboardRevealed(true);
    onSceneVisible();

    const currentState = getKeyboardState({ section: activeSection, isMobile });
    const keyboardReveal = gsap.fromTo(
      kbd.scale,
      { x: 0.01, y: 0.01, z: 0.01 },
      {
        ...currentState.scale,
        duration: 1.5,
        ease: "elastic.out(1, 0.6)",
      }
    );
    trackSceneAnimation(keyboardReveal);

    const allObjects = splineApp.getAllObjects();
    const keycaps = allObjects.filter((obj) => obj.name === "keycap");

    await sleep(900);
    if (!sceneActiveRef.current) return;

    if (isMobile) {
      const mobileKeyCaps = allObjects.filter((obj) => obj.name === "keycap-mobile");
      mobileKeyCaps.forEach((keycap) => { keycap.visible = true; });
    } else {
      const desktopKeyCaps = allObjects.filter((obj) => obj.name === "keycap-desktop");
      desktopKeyCaps.forEach(async (keycap, idx) => {
        await sleep(idx * 70);
        if (!sceneActiveRef.current) return;
        keycap.visible = true;
      });
    }

    keycaps.forEach(async (keycap, idx) => {
      keycap.visible = false;
      await sleep(idx * 70);
      if (!sceneActiveRef.current) return;
      keycap.visible = true;
      const keycapReveal = gsap.fromTo(
        keycap.position,
        { y: 200 },
        { y: 50, duration: 0.5, delay: 0.1, ease: "bounce.out" }
      );
      trackSceneAnimation(keycapReveal);
    });
  }, [activeSection, isMobile, onSceneVisible, splineApp, trackSceneAnimation]);

  // --- Effects ---

  useEffect(() => {
    sceneActiveRef.current = isSceneActive;

    if (isSceneActive) gsap.ticker.wake();

    sceneScrollTriggersRef.current.forEach((trigger) => {
      if (isSceneActive) trigger.enable();
      else trigger.disable(false);
    });

    sceneAnimationsRef.current.forEach((animation) => {
      if (isSceneActive) animation.resume();
      else animation.pause();
    });

    if (!isSceneActive) {
      bongoAnimationRef.current?.stop();
      gsap.ticker.sleep();
    }
  }, [isSceneActive]);

  // Initialize GSAP and Spline interactions
  useEffect(() => {
    if (!splineApp) return;
    const sceneScrollTriggers = sceneScrollTriggersRef.current;
    const removeInteractions = handleSplineInteractions();
    const sectionTimelines = setupScrollAnimations();
    bongoAnimationRef.current = getBongoAnimation();
    keycapAnimationsRef.current = getKeycapsAnimation();
    return () => {
      removeInteractions?.();
      bongoAnimationRef.current?.stop();
      keycapAnimationsRef.current?.dispose();
      sectionTimelines.forEach((timeline) => {
        if (timeline.scrollTrigger) {
          timeline.scrollTrigger.kill();
          sceneScrollTriggers.delete(timeline.scrollTrigger);
        }
        killSceneAnimation(timeline);
      });
    }

  }, [
    getBongoAnimation,
    getKeycapsAnimation,
    handleSplineInteractions,
    killSceneAnimation,
    setupScrollAnimations,
    splineApp,
  ]);

  // Handle keyboard text visibility based on theme and section
  useEffect(() => {
    if (!splineApp) return;
    const textDesktopDark = splineApp.findObjectByName("text-desktop-dark");
    const textDesktopLight = splineApp.findObjectByName("text-desktop");
    const textMobileDark = splineApp.findObjectByName("text-mobile-dark");
    const textMobileLight = splineApp.findObjectByName("text-mobile");

    if (!textDesktopDark || !textDesktopLight || !textMobileDark || !textMobileLight) return;

    const setVisibility = (
      dDark: boolean,
      dLight: boolean,
      mDark: boolean,
      mLight: boolean
    ) => {
      textDesktopDark.visible = dDark;
      textDesktopLight.visible = dLight;
      textMobileDark.visible = mDark;
      textMobileLight.visible = mLight;
    };

    if (activeSection !== "skills") {
      setVisibility(false, false, false, false);
    } else {
      isMobile
        ? setVisibility(false, false, false, true)
        : setVisibility(false, true, false, false);
    }
  }, [splineApp, isMobile, activeSection]);

  useEffect(() => {
    if (!selectedSkill || !splineApp) return;
    // console.log(selectedSkill)
    splineApp.setVariable("heading", selectedSkill.label);
    splineApp.setVariable("desc", selectedSkill.shortDescription);
  }, [selectedSkill, splineApp]);

  // Handle rotation and teardown animations based on active section
  useEffect(() => {
    if (!splineApp || !isSceneActive) return;

    let cancelled = false;
    let rotateKeyboard: gsap.core.Tween | undefined;
    let teardownKeyboard: gsap.core.Tween | undefined;

    const kbd = splineApp.findObjectByName("keyboard");

    if (kbd) {
      rotateKeyboard = gsap.to(kbd.rotation, {
        y: Math.PI * 2 + kbd.rotation.y,
        duration: 10,
        repeat: -1,
        yoyo: true,
        yoyoEase: true,
        ease: "back.inOut",
        delay: 2.5,
        paused: true, // Start paused
      });
      trackSceneAnimation(rotateKeyboard, true);

      teardownKeyboard = gsap.fromTo(
        kbd.rotation,
        { y: 0, x: -Math.PI, z: 0 },
        {
          y: -Math.PI / 2,
          duration: 5,
          repeat: -1,
          yoyo: true,
          yoyoEase: true,
          delay: 2.5,
          immediateRender: false,
          paused: true,
        }
      );
      trackSceneAnimation(teardownKeyboard, true);
    }

    const manageAnimations = async () => {
      // Reset text if not in skills
      if (activeSection !== "skills") {
        splineApp.setVariable("heading", "");
        splineApp.setVariable("desc", "");
      }

      // Handle Rotate/Teardown Tweens
      if (activeSection === "hero") {
        rotateKeyboard?.restart();
        teardownKeyboard?.pause();
      } else if (activeSection === "contact") {
        rotateKeyboard?.pause();
      } else {
        rotateKeyboard?.pause();
        teardownKeyboard?.pause();
      }

      // Handle Bongo Cat
      if (activeSection === "projects") {
        await sleep(300);
        if (cancelled || !sceneActiveRef.current) return;
        bongoAnimationRef.current?.start();
      } else {
        await sleep(200);
        bongoAnimationRef.current?.stop();
      }

      // Handle Contact Section Animations
      if (activeSection === "contact") {
        await sleep(600);
        if (cancelled || !sceneActiveRef.current) return;
        teardownKeyboard?.restart();
        keycapAnimationsRef.current?.start();
      } else {
        await sleep(600);
        teardownKeyboard?.pause();
        keycapAnimationsRef.current?.stop();
      }
    };

    manageAnimations();

    return () => {
      cancelled = true;
      if (rotateKeyboard) killSceneAnimation(rotateKeyboard);
      if (teardownKeyboard) killSceneAnimation(teardownKeyboard);
      bongoAnimationRef.current?.stop();
      keycapAnimationsRef.current?.dispose();
    };
  }, [
    activeSection,
    isSceneActive,
    killSceneAnimation,
    splineApp,
    trackSceneAnimation,
  ]);

  // Reveal keyboard on load/route change
  useEffect(() => {
    const hash = activeSection === "hero" ? "#" : `#${activeSection}`;
    router.push("/" + hash, { scroll: false });

    if (!splineApp || !isSceneActive || keyboardRevealed) return;
    updateKeyboardTransform();
  }, [
    activeSection,
    isSceneActive,
    keyboardRevealed,
    router,
    splineApp,
    updateKeyboardTransform,
  ]);

  useEffect(() => {
    const sceneScrollTriggers = sceneScrollTriggersRef.current;
    const sceneAnimations = sceneAnimationsRef.current;
    return () => {
      onSceneReady(null);
      sceneScrollTriggers.forEach((trigger) => trigger.kill());
      sceneScrollTriggers.clear();
      sceneAnimations.forEach((animation) => animation.kill());
      sceneAnimations.clear();
      gsap.ticker.sleep();
    };
  }, [onSceneReady]);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Spline
        className="fixed z-scene h-full w-full"
        ref={splineContainer}
        onLoad={(app: Application) => {
          setSplineApp(app);
          onSceneReady(app);
        }}
        scene="/assets/skills-keyboard.spline"
      />
    </Suspense>
  );
};

export default AnimatedBackground;
