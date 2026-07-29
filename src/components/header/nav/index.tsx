import Link from "next/link";
import { forwardRef, type SyntheticEvent } from "react";

import { config } from "@/data/config";
import { links } from "@/components/header/config";
import styles from "./style.module.scss";

interface NavProps {
  currentChapter: string;
  onCancel: () => void;
  onClose: () => void;
  onNavigate: () => void;
  onRequestClose: () => void;
}

const Nav = forwardRef<HTMLDialogElement, NavProps>(
  (
    {
      currentChapter,
      onCancel,
      onClose,
      onNavigate,
      onRequestClose,
    },
    ref,
  ) => {
    const handleCancel = (event: SyntheticEvent<HTMLDialogElement>) => {
      event.preventDefault();
      onCancel();
    };

    return (
      <dialog
        ref={ref}
        id="primary-navigation-dialog"
        className={styles.dialog}
        aria-labelledby="primary-navigation-title"
        onCancel={handleCancel}
        onClose={onClose}
      >
        <div className={styles.dialogRail}>
          <div className={styles.dialogIdentity}>
            <span className={styles.railLabel}>Identity</span>
            <span className={styles.railValue}>{config.author}</span>
          </div>
          <div className={styles.dialogChapter}>
            <span className={styles.railLabel}>Chapter</span>
            <span className={styles.railValue}>{currentChapter}</span>
          </div>
          <button
            type="button"
            className={styles.closeButton}
            data-navigation-close
            onClick={onRequestClose}
          >
            <span>Close</span>
            <span className={styles.closeGlyph} aria-hidden="true" />
          </button>
        </div>

        <div className={styles.navigationFrame}>
          <p className={styles.eyebrow}>Directory / Primary</p>
          <h2 id="primary-navigation-title" className={styles.title}>
            Navigate the laboratory
          </h2>

          <nav aria-label="Primary navigation" className={styles.navigation}>
            <ol>
              {links.map((link, index) => {
                const isCurrent =
                  currentChapter === link.title ||
                  (currentChapter === "Landing" && link.title === "Home");

                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      target={link.target}
                      aria-current={isCurrent ? "page" : undefined}
                      onClick={onNavigate}
                    >
                      <span className={styles.linkIndex} aria-hidden="true">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span>{link.title}</span>
                      <span className={styles.linkStatus} aria-hidden="true">
                        {isCurrent ? "Active" : "Open"}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ol>
          </nav>
        </div>
      </dialog>
    );
  },
);

Nav.displayName = "Nav";

export default Nav;
