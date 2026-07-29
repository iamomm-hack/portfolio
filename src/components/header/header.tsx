"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

import { config } from "@/data/config";
import Nav from "./nav";
import styles from "./style.module.scss";

const HOME_CHAPTERS = [
  { id: "hero", label: "Landing" },
  { id: "skills", label: "Skills" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "contact", label: "Contact" },
] as const;

function useCurrentChapter() {
  const pathname = usePathname();
  const [chapter, setChapter] = useState("Landing");

  useEffect(() => {
    if (pathname !== "/") {
      setChapter(pathname === "/blogs" ? "Blogs" : "Laboratory");
      return;
    }

    const targets = HOME_CHAPTERS.flatMap(({ id, label }) => {
      const element = document.getElementById(id);
      return element ? [{ element, label }] : [];
    });

    const visibleTargets = new Map<Element, IntersectionObserverEntry>();
    const updateChapter = () => {
      const activeTarget = Array.from(visibleTargets.values()).sort(
        (left, right) =>
          Math.abs(left.boundingClientRect.top) -
          Math.abs(right.boundingClientRect.top),
      )[0];
      const match = targets.find(({ element }) => element === activeTarget?.target);
      if (match) setChapter(match.label);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) visibleTargets.set(entry.target, entry);
          else visibleTargets.delete(entry.target);
        });
        updateChapter();
      },
      { rootMargin: "-18% 0px -68% 0px", threshold: 0 },
    );

    targets.forEach(({ element }) => observer.observe(element));
    return () => observer.disconnect();
  }, [pathname]);

  return chapter;
}

const Header = () => {
  const [isActive, setIsActive] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const shouldReturnFocusRef = useRef(true);
  const currentChapter = useCurrentChapter();

  const closeNavigation = useCallback((returnFocus = true) => {
    shouldReturnFocusRef.current = returnFocus;
    dialogRef.current?.close();
    setIsActive(false);
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (!isActive) {
      if (dialog.open) dialog.close();
      return;
    }

    const previousOverflow = document.body.style.overflow;
    if (!dialog.open) dialog.showModal();
    dialog.querySelector<HTMLElement>("[data-navigation-close]")?.focus();
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isActive]);

  useEffect(() => {
    if (!isActive) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeNavigation(true);
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [closeNavigation, isActive]);

  const handleDialogClose = () => {
    setIsActive(false);
    if (shouldReturnFocusRef.current) triggerRef.current?.focus();
    shouldReturnFocusRef.current = true;
  };

  return (
    <header className={styles.header}>
      <div className={styles.rail} data-control-rail>
        <Link
          href="/"
          className={styles.identity}
          aria-label={`${config.author}, home`}
        >
          <span className={styles.railLabel}>Identity</span>
          <span className={styles.railValue}>{config.author}</span>
        </Link>

        <div className={styles.chapter} aria-live="polite" aria-atomic="true">
          <span className={styles.railLabel}>Chapter</span>
          <span className={styles.railValue}>{currentChapter}</span>
        </div>

        <button
          ref={triggerRef}
          type="button"
          className={styles.menuTrigger}
          aria-expanded={isActive}
          aria-controls="primary-navigation-dialog"
          aria-label="Open navigation"
          onClick={() => setIsActive(true)}
        >
          <span>Menu</span>
          <span className={styles.menuGlyph} aria-hidden="true">
            <span />
            <span />
          </span>
        </button>
      </div>

      <Nav
        ref={dialogRef}
        currentChapter={currentChapter}
        onCancel={() => closeNavigation(true)}
        onClose={handleDialogClose}
        onNavigate={() => closeNavigation(false)}
        onRequestClose={() => closeNavigation(true)}
      />
    </header>
  );
};

export default Header;
