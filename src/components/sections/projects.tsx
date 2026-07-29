"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Github } from "lucide-react";

import { PROJECT_RECORDS, type ProjectRecord } from "@/data/project-records";
import { createProjectsChoreography } from "./projects-choreography";
import styles from "./projects.module.scss";

const FEATURED_PROJECT_COUNT = 3;
const projects = Object.values(PROJECT_RECORDS);

const ProjectActions = ({
  title,
  live,
  github,
}: {
  title: string;
  live: string;
  github?: string;
}) => (
  <div
    className={styles.projectActions}
    data-project-actions
    role="group"
    aria-label={`${title} external links`}
  >
    {github ? (
      <a
        href={github}
        target="_blank"
        rel="noreferrer"
        className={styles.projectAction}
        data-project-action
        aria-label={`Open ${title} GitHub repository in a new tab`}
      >
        <span>GitHub</span>
        <Github aria-hidden="true" />
      </a>
    ) : null}
    {live ? (
      <a
        href={live}
        target="_blank"
        rel="noreferrer"
        className={styles.projectAction}
        data-project-action
        aria-label={`Open ${title} live demo in a new tab`}
      >
        <span>Live demo</span>
        <ArrowUpRight aria-hidden="true" />
      </a>
    ) : null}
  </div>
);

const ProjectCard = ({
  project,
  index,
  hasCaseStudy,
}: {
  project: ProjectRecord;
  index: number;
  hasCaseStudy: boolean;
}) => (
  <article
    className={styles.projectCard}
    aria-labelledby={`project-${project.id}-title`}
    data-project-card
    data-case-study-path={hasCaseStudy ? `/projects/${project.id}` : undefined}
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
          sizes="(max-width: 59.99rem) calc(100vw - 2rem), (max-width: 96rem) calc(50vw - 3.75rem), 45rem"
        />
      </div>
      <div
        className={styles.mediaShade}
        data-project-overlay
        aria-hidden="true"
      />
      <ProjectActions
        title={project.title}
        live={project.live}
        github={project.github}
      />
    </div>

    <div className={styles.projectBody}>
      <div className={styles.projectIndex}>
        <span>{String(index + 1).padStart(2, "0")}</span>
        <span>{project.category}</span>
      </div>

      <div className={styles.projectSummary}>
        <h4
          id={`project-${project.id}-title`}
          className={styles.projectTitle}
        >
          {hasCaseStudy ? (
            <Link href={`/projects/${project.id}`}>
              {project.title}
              <ArrowUpRight data-project-title-icon aria-hidden="true" />
            </Link>
          ) : (
            project.title
          )}
        </h4>
        <p className={styles.valueProposition}>{project.valueProposition}</p>
      </div>

      <dl className={styles.projectMeta}>
        <div>
          <dt>Year</dt>
          <dd>{project.year}</dd>
        </div>
        <div>
          <dt>Status</dt>
          <dd>{project.status}</dd>
        </div>
        <div className={styles.technologyField}>
          <dt>Tech stack</dt>
          <dd>
            <ul aria-label={`${project.title} core technologies`}>
              {project.coreTechnologies.map((technology) => (
                <li key={technology}>{technology}</li>
              ))}
            </ul>
          </dd>
        </div>
      </dl>
    </div>
  </article>
);

const ProjectsSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const featuredProjects = projects.slice(0, FEATURED_PROJECT_COUNT);
  const archivedProjects = projects.slice(FEATURED_PROJECT_COUNT);

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
          <p className={styles.eyebrow}>04 / Selected systems</p>
          <h2 id="projects-title" className={styles.title}>
            Products built around hard constraints.
          </h2>
          <p className={styles.statement}>
            Selected work across identity, intellectual property, and open
            financial infrastructure. Each system starts with a useful problem,
            not a technology demo.
          </p>
        </header>

        <section
          className={styles.featured}
          aria-labelledby="featured-projects-title"
        >
          <div className={styles.indexHeader} data-project-reveal>
            <h3 id="featured-projects-title">Featured projects</h3>
            <p>{String(featuredProjects.length).padStart(2, "0")} records</p>
          </div>

          <ol className={styles.featuredGrid}>
            {featuredProjects.map((project, index) => (
              <li key={project.id} data-project-reveal>
                <ProjectCard project={project} index={index} hasCaseStudy />
              </li>
            ))}
          </ol>
        </section>

        <section
          className={styles.archive}
          aria-labelledby="project-archive-title"
        >
          <div className={styles.indexHeader} data-project-reveal>
            <h3 id="project-archive-title">Project archive</h3>
            <p>{String(archivedProjects.length).padStart(2, "0")} records</p>
          </div>

          <ol className={styles.archiveGrid}>
            {archivedProjects.map((project, index) => (
              <li key={project.id} data-project-reveal>
                <ProjectCard
                  project={project}
                  index={FEATURED_PROJECT_COUNT + index}
                  hasCaseStudy={false}
                />
              </li>
            ))}
          </ol>
        </section>
      </div>
    </section>
  );
};

export default ProjectsSection;
