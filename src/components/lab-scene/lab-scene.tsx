"use client";

import type { Application } from "@splinetool/runtime";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import AnimatedBackground from "@/components/animated-background";
import { useMediaQuery } from "@/hooks/use-media-query";
import {
  createExpensiveExperienceToken,
  expensiveExperienceOwner,
} from "./experience-owner";
import LaboratoryEnvironment from "./laboratory-environment";

const SCENE_SECTION_IDS = ["hero", "skills"] as const;

function isElementInViewport(element: Element) {
  const bounds = element.getBoundingClientRect();
  return bounds.bottom > 0 && bounds.top < window.innerHeight;
}

function useSceneViewportPresence() {
  const [isInViewport, setIsInViewport] = useState(false);

  useEffect(() => {
    const targets = SCENE_SECTION_IDS.map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => Boolean(element));

    if (targets.length === 0) return;

    const visibleTargets = new Set<Element>();
    targets.forEach((target) => {
      if (isElementInViewport(target)) visibleTargets.add(target);
    });
    setIsInViewport(visibleTargets.size > 0);

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) visibleTargets.add(entry.target);
        else visibleTargets.delete(entry.target);
      });
      setIsInViewport(visibleTargets.size > 0);
    });

    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, []);

  return isInViewport;
}

function useDocumentVisibility() {
  const [isDocumentVisible, setIsDocumentVisible] = useState(true);

  useEffect(() => {
    const updateVisibility = () => {
      setIsDocumentVisible(document.visibilityState === "visible");
    };

    updateVisibility();
    document.addEventListener("visibilitychange", updateVisibility);
    return () => document.removeEventListener("visibilitychange", updateVisibility);
  }, []);

  return isDocumentVisible;
}

export default function LabScene() {
  const ownerToken = useMemo(
    () => createExpensiveExperienceToken("scene"),
    [],
  );
  const applicationRef = useRef<Application | null>(null);
  const isSceneActiveRef = useRef(false);
  const [hasOwnership, setHasOwnership] = useState(false);
  const [isSceneReady, setIsSceneReady] = useState(false);
  const isReducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const isInViewport = useSceneViewportPresence();
  const isDocumentVisible = useDocumentVisibility();

  useEffect(() => {
    const acquired = expensiveExperienceOwner.acquire(ownerToken);
    setHasOwnership(acquired);

    return () => {
      expensiveExperienceOwner.release(ownerToken);
      applicationRef.current?.stop();
      applicationRef.current = null;
    };
  }, [ownerToken]);

  const shouldLoadScene = hasOwnership && !isReducedMotion;
  const isSceneActive =
    shouldLoadScene && isInViewport && isDocumentVisible;

  useEffect(() => {
    isSceneActiveRef.current = isSceneActive;
    const application = applicationRef.current;
    if (!application) return;

    if (isSceneActive) application.play();
    else application.stop();
  }, [isSceneActive]);

  const handleSceneReady = useCallback(
    (application: Application | null) => {
      applicationRef.current = application;
      if (!application) {
        setIsSceneReady(false);
        return;
      }

      if (isSceneActiveRef.current) application.play();
      else application.stop();
    },
    [],
  );

  const handleSceneVisible = useCallback(() => {
    setIsSceneReady(true);
  }, []);

  return (
    <div
      className="contents"
      data-lab-scene-active={isSceneActive}
      data-lab-scene-loaded={shouldLoadScene}
      data-lab-scene-owner={hasOwnership ? "scene" : "none"}
      data-lab-scene-ready={isSceneReady}
    >
      <LaboratoryEnvironment />
      {shouldLoadScene ? (
        <AnimatedBackground
          isSceneActive={isSceneActive}
          onSceneReady={handleSceneReady}
          onSceneVisible={handleSceneVisible}
        />
      ) : null}
    </div>
  );
}
