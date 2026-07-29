import projects from "@/data/projects";
import styles from "./projects.module.scss";

const FEATURED_PROJECT_COUNT = 3;

const ProjectsSection = () => {
  const featuredProjects = projects.slice(0, FEATURED_PROJECT_COUNT);
  const archivedProjects = projects.slice(FEATURED_PROJECT_COUNT);

  return (
    <section
      id="projects"
      className={styles.projects}
      aria-labelledby="projects-title"
    >
      <div className={styles.container}>
        <header className={styles.introduction}>
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
          <div className={styles.indexHeader}>
            <h3 id="featured-projects-title">Featured projects</h3>
            <p>{String(featuredProjects.length).padStart(2, "0")} records</p>
          </div>

          <ol>
            {featuredProjects.map((project, index) => (
              <li key={project.id}>
                <article
                  className={styles.featuredProject}
                  aria-labelledby={`project-${project.id}-title`}
                  data-case-study-path={`/projects/${project.id}`}
                >
                  <div className={styles.sequence} aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </div>

                  <div className={styles.projectSummary}>
                    <h4
                      id={`project-${project.id}-title`}
                      className={styles.projectTitle}
                    >
                      {project.title}
                    </h4>
                    <p className={styles.valueProposition}>
                      {project.valueProposition}
                    </p>
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
                  </dl>

                  <div className={styles.technologyField}>
                    <p>Core technologies</p>
                    <ul aria-label={`${project.title} core technologies`}>
                      {project.coreTechnologies.map((technology) => (
                        <li key={technology}>{technology}</li>
                      ))}
                    </ul>
                  </div>

                  <p className={styles.caseStudyStatus}>
                    Case study <span>Planned</span>
                  </p>
                </article>
              </li>
            ))}
          </ol>
        </section>

        <section
          className={styles.archive}
          aria-labelledby="project-archive-title"
        >
          <div className={styles.indexHeader}>
            <h3 id="project-archive-title">Project archive</h3>
            <p>{String(archivedProjects.length).padStart(2, "0")} records</p>
          </div>

          <ol>
            {archivedProjects.map((project) => (
              <li key={project.id}>
                <article
                  className={styles.archiveProject}
                  aria-labelledby={`project-${project.id}-title`}
                  data-case-study-path={`/projects/${project.id}`}
                >
                  <div className={styles.archiveSummary}>
                    <h4 id={`project-${project.id}-title`}>{project.title}</h4>
                    <p>{project.valueProposition}</p>
                  </div>

                  <p className={styles.archiveYear}>
                    <span className={styles.srOnly}>Year: </span>
                    {project.year}
                  </p>
                  <p className={styles.archiveStatus}>
                    <span className={styles.srOnly}>Status: </span>
                    {project.status}
                  </p>

                  <ul
                    className={styles.archiveTechnologies}
                    aria-label={`${project.title} core technologies`}
                  >
                    {project.coreTechnologies.map((technology) => (
                      <li key={technology}>{technology}</li>
                    ))}
                  </ul>
                </article>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </section>
  );
};

export default ProjectsSection;
