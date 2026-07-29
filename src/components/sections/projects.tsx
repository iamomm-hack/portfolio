"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { ArrowUpRight, Github } from "lucide-react";

import { PROJECT_RECORDS, type ProjectRecord } from "@/data/project-records";
import { createProjectsChoreography } from "./projects-choreography";
import styles from "./projects.module.scss";

const projects = Object.values(PROJECT_RECORDS);

const ProjectActions = ({ project }: { project: ProjectRecord }) => (
  <div
    className={styles.projectActions}
    data-project-actions
    role="group"
    aria-label={`${project.title} external links`}
  >
    {project.github ? (
      <a
        href={project.github}
        target="_blank"
        rel="noreferrer"
        className={styles.projectAction}
        data-project-action
        aria-label={`Open ${project.title} GitHub repository in a new tab`}
      >
        <span>GitHub</span>
        <Github aria-hidden="true" />
      </a>
    ) : null}
    {project.live ? (
      <a
        href={project.live}
        target="_blank"
        rel="noreferrer"
        className={styles.projectAction}
        data-project-action
        aria-label={`Open ${project.title} live demo in a new tab`}
      >
        <span>Live demo</span>
        <ArrowUpRight aria-hidden="true" />
      </a>
    ) : null}
  </div>
);

const ProjectCard = ({ project }: { project: ProjectRecord }) => (
  <article
    className={styles.projectCard}
    tabIndex={0}
    aria-labelledby={`project-${project.id}-title`}
    aria-describedby={`project-${project.id}-description`}
    data-project-card
  >
    <div className={styles.cardGlow} data-project-glow aria-hidden="true" />

    <div className={styles.mediaFrame}>
      <div className={styles.mediaParallax} data-project-media>
        <Image
          className={styles.projectImage}
          src={project.src}
          alt={`${project.title} product interface`}
          fill
          data-project-image
          sizes="(max-width: 959px) calc(100vw - 4rem), (max-width: 1440px) 40vw, 568px"
        />
      </div>
      <div
        className={styles.mediaShade}
        data-project-overlay
        aria-hidden="true"
      />
      <ProjectActions project={project} />
    </div>

    <div className={styles.projectBody}>
      <h3
        id={`project-${project.id}-title`}
        className={styles.projectTitle}
        data-project-title
      >
        {project.title}
      </h3>
      <p
        id={`project-${project.id}-description`}
        className={styles.valueProposition}
      >
        {project.valueProposition}
      </p>
    </div>
  </article>
);

const ProjectsSection = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    return createProjectsChoreography(sectionRef.current);
  }, []);

  return (
    <section
      ref={sectionRef}
      id="projects"
      className={styles.projects}
      aria-labelledby="projects-title"
    >
      <div className={styles.container}>
        <header className={styles.introduction} data-project-reveal>
          <h2 id="projects-title" className={styles.title}>
            Selected work.
          </h2>
          <p className={styles.statement}>
            Six product experiments shaped around useful constraints.
          </p>
        </header>

        <ol className={styles.projectGrid} aria-label="Project gallery">
          {projects.map((project) => (
            <li key={project.id} data-project-reveal>
              <ProjectCard project={project} />
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};

export default ProjectsSection;
