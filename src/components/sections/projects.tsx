"use client";

import Image from "next/image";
import { motion, type Variants, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Github } from "lucide-react";

import { PROJECT_RECORDS, type ProjectRecord } from "@/data/project-records";
import { useMediaQuery } from "@/hooks/use-media-query";
import styles from "./projects.module.scss";

const projects = Object.values(PROJECT_RECORDS);
const EASE = [0.22, 1, 0.36, 1] as const;

const ProjectActions = ({
  project,
  actionsVisible,
  reducedMotion,
}: {
  project: ProjectRecord;
  actionsVisible: boolean;
  reducedMotion: boolean;
}) => {
  const transition = {
    duration: reducedMotion ? 0 : 0.35,
    ease: EASE,
  };
  const actionVariants: Variants = {
    rest: { opacity: actionsVisible ? 1 : 0, y: actionsVisible ? 0 : 10 },
    hover: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      className={styles.projectActions}
      variants={actionVariants}
      transition={transition}
      role="group"
      aria-label={`${project.title} external links`}
    >
      {project.live ? (
        <motion.a
          href={project.live}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.projectAction}
          whileHover={reducedMotion ? undefined : { scale: 1.04, y: -2 }}
          whileFocus={reducedMotion ? undefined : { scale: 1.04, y: -2 }}
          transition={transition}
          aria-label={`Open ${project.title} live demo in a new tab`}
        >
          <span>Live demo</span>
          <ArrowUpRight aria-hidden="true" />
        </motion.a>
      ) : null}
      {project.github ? (
        <motion.a
          href={project.github}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.projectAction}
          whileHover={reducedMotion ? undefined : { scale: 1.04, y: -2 }}
          whileFocus={reducedMotion ? undefined : { scale: 1.04, y: -2 }}
          transition={transition}
          aria-label={`Open ${project.title} GitHub repository in a new tab`}
        >
          <span>GitHub</span>
          <Github aria-hidden="true" />
        </motion.a>
      ) : null}
    </motion.div>
  );
};

const ProjectCard = ({
  project,
  actionsVisible,
  reducedMotion,
}: {
  project: ProjectRecord;
  actionsVisible: boolean;
  reducedMotion: boolean;
}) => {
  const transition = {
    duration: reducedMotion ? 0 : 0.35,
    ease: EASE,
  };
  const cardVariants: Variants = {
    rest: { scale: 1, y: 0 },
    hover: {
      scale: reducedMotion ? 1 : 1.008,
      y: reducedMotion ? 0 : -8,
    },
  };
  const imageVariants: Variants = {
    rest: { scale: 1 },
    hover: { scale: reducedMotion ? 1 : 1.04 },
  };
  const revealVariants: Variants = {
    rest: { opacity: 0 },
    hover: { opacity: 1 },
  };

  return (
    <motion.article
      className={styles.projectCard}
      data-project-card
      tabIndex={0}
      aria-labelledby={`project-${project.id}-title`}
      aria-describedby={`project-${project.id}-description`}
      variants={cardVariants}
      initial="rest"
      animate="rest"
      whileHover="hover"
      whileFocus="hover"
      transition={transition}
    >
      <motion.div
        className={styles.cardGlow}
        variants={revealVariants}
        transition={transition}
        aria-hidden="true"
      />

      <div className={styles.mediaFrame} data-project-media>
        <motion.div
          className={styles.mediaSurface}
          variants={imageVariants}
          transition={transition}
        >
          <Image
            className={styles.projectImage}
            src={project.src}
            alt={`${project.title} project interface`}
            fill
            sizes="(max-width: 959px) calc(100vw - 4rem), (max-width: 1400px) 42vw, 590px"
          />
        </motion.div>
        <motion.div
          className={styles.mediaShade}
          variants={revealVariants}
          transition={transition}
          aria-hidden="true"
        />
        <ProjectActions
          project={project}
          actionsVisible={actionsVisible}
          reducedMotion={reducedMotion}
        />
      </div>

      <div className={styles.projectBody}>
        <h3 id={`project-${project.id}-title`} className={styles.projectTitle}>
          {project.title}
        </h3>
        <p
          id={`project-${project.id}-description`}
          className={styles.valueProposition}
        >
          {project.valueProposition}
        </p>
      </div>
    </motion.article>
  );
};

const ProjectsSection = () => {
  const prefersReducedMotion = useReducedMotion();
  const actionsVisible = useMediaQuery("(hover: none), (pointer: coarse)");
  const reducedMotion = Boolean(prefersReducedMotion);

  return (
    <section
      id="projects"
      className={styles.projects}
      aria-labelledby="projects-title"
    >
      <div className={styles.container}>
        <header className={styles.introduction}>
          <h2 id="projects-title" className={styles.title}>
            Featured projects.
          </h2>
          <p className={styles.statement}>
            Seven product experiments shaped around useful constraints.
          </p>
        </header>

        <ol className={styles.projectGrid} aria-label="Featured projects">
          {projects.map((project, index) => (
            <motion.li
              key={project.id}
              initial={reducedMotion ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.14 }}
              transition={{
                duration: reducedMotion ? 0 : 0.55,
                delay: reducedMotion ? 0 : Math.min(index, 3) * 0.06,
                ease: EASE,
              }}
            >
              <ProjectCard
                project={project}
                actionsVisible={actionsVisible}
                reducedMotion={reducedMotion}
              />
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
};

export default ProjectsSection;
