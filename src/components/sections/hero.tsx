"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowDownRight, FileText } from "lucide-react";
import { SiGithub, SiLinkedin, SiX } from "react-icons/si";
import { useEffect, useRef } from "react";

import { config } from "@/data/config";
import { createHeroChoreography } from "./hero-choreography";
import styles from "./hero.module.scss";

const socialLinks = [
  { href: config.social.github, label: "GitHub", icon: SiGithub },
  { href: config.social.linkedin, label: "LinkedIn", icon: SiLinkedin },
  { href: config.social.twitter, label: "X", icon: SiX },
] as const;

const HeroSection = () => {
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!heroRef.current) return;
    return createHeroChoreography(heroRef.current);
  }, []);

  return (
    <section
      ref={heroRef}
      id="hero"
      className={styles.hero}
      aria-labelledby="hero-title"
    >
      <div className={styles.layout}>
        <div className={styles.content} data-hero-motion="content">
          <p className={styles.eyebrow} data-hero-motion="eyebrow">
            Independent engineering practice
          </p>

          <h1 id="hero-title" className={styles.title} data-hero-motion="title">
            Om Kumar
          </h1>

          <p className={styles.practice} data-hero-motion="practice">
            I engineer resilient digital products across full-stack systems,
            Web3, connected hardware, and applied AI.
          </p>

          <div className={styles.actions} aria-label="Portfolio actions">
            <Link
              href="#projects"
              className={styles.primaryAction}
              data-hero-motion="action"
            >
              <span>View selected work</span>
              <ArrowDownRight aria-hidden="true" size={18} strokeWidth={1.75} />
            </Link>

            <Link
              href="https://drive.google.com/file/d/1O97WCk2DrO9x6SHOqf7LvRbmkMgGIb4/view?usp=sharing"
              target="_blank"
              rel="noreferrer"
              className={styles.resumeAction}
              data-hero-motion="action"
            >
              <FileText aria-hidden="true" size={17} strokeWidth={1.75} />
              <span>Resume</span>
              <span className={styles.externalLabel}>PDF</span>
            </Link>
          </div>

          <nav
            aria-label="Social profiles"
            className={styles.socials}
            data-hero-motion="socials"
          >
            <ul>
              {socialLinks.map(({ href, label, icon: Icon }) => (
                <li key={label}>
                  <Link href={href} target="_blank" rel="noreferrer">
                    <Icon aria-hidden="true" size={16} />
                    <span>{label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <figure
          className={styles.sceneFrame}
          aria-label="Interactive skills keyboard preview"
          data-hero-motion="poster"
        >
          <Image
            src="/assets/keyboard-poster.jpg"
            alt="Colorful three-dimensional keyboard displaying technology symbols"
            width={1586}
            height={992}
            sizes="(max-width: 767px) calc(100vw - 2rem), 52vw"
            priority
            className={styles.keyboardPoster}
          />
        </figure>
      </div>
    </section>
  );
};

export default HeroSection;
