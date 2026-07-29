import type { ProjectRecord } from "@/data/project-records";
import Image from "next/image";
import Link from "next/link";
import styles from "./case-study-layout.module.scss";

const CASE_STUDY_SECTIONS = [
  ["overview", "Overview"],
  ["problem", "Problem"],
  ["solution", "Solution"],
  ["architecture", "Architecture"],
  ["results", "Results"],
  ["technology", "Technology"],
  ["links", "Links"],
] as const;

type CaseStudyLayoutProps = {
  project: ProjectRecord;
};

const EditorialPlaceholder = ({ children }: { children: React.ReactNode }) => (
  <div className={styles.placeholder} data-editorial-placeholder="true">
    <p className={styles.placeholderLabel}>Editorial record pending</p>
    <p>{children}</p>
  </div>
);

const CaseStudyLayout = ({ project }: CaseStudyLayoutProps) => {
  return (
    <main className={styles.caseStudy}>
      <div className={styles.shell}>
        <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
          <ol>
            <li>
              <Link href="/">Laboratory</Link>
            </li>
            <li>
              <Link href="/#projects">Projects</Link>
            </li>
            <li aria-current="page">{project.title}</li>
          </ol>
        </nav>

        <header className={styles.hero}>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>Case study / {project.status}</p>
            <h1>{project.title}</h1>
            <p className={styles.proposition}>{project.valueProposition}</p>

            <dl className={styles.heroMeta}>
              <div>
                <dt>Year</dt>
                <dd>{project.year}</dd>
              </div>
              <div>
                <dt>Domain</dt>
                <dd>{project.category}</dd>
              </div>
              <div>
                <dt>Status</dt>
                <dd>{project.status}</dd>
              </div>
            </dl>
          </div>

          <figure className={styles.heroMedia}>
            <Image
              src={project.src}
              alt={`${project.title} product interface`}
              width={1600}
              height={1000}
              sizes="(max-width: 48rem) 100vw, 58vw"
              priority
            />
          </figure>
        </header>

        <div className={styles.readingGrid}>
          <nav className={styles.sectionNavigation} aria-label="Case study sections">
            <p>On this page</p>
            <ol>
              {CASE_STUDY_SECTIONS.map(([id, label]) => (
                <li key={id}>
                  <a href={`#${id}`}>{label}</a>
                </li>
              ))}
            </ol>
          </nav>

          <article className={styles.document}>
            <section id="overview" aria-labelledby="overview-title">
              <p className={styles.sectionNumber}>01</p>
              <div>
                <h2 id="overview-title">Overview</h2>
                <p className={styles.lead}>{project.valueProposition}</p>
                <p>
                  This shared record establishes the editorial structure for
                  the complete {project.title} case study. Detailed evidence
                  will be added without changing this reading architecture.
                </p>
              </div>
            </section>

            <section id="problem" aria-labelledby="problem-title">
              <p className={styles.sectionNumber}>02</p>
              <div>
                <h2 id="problem-title">Problem</h2>
                <EditorialPlaceholder>
                  The existing project record identifies a {project.category}
                  constraint addressed by {project.valueProposition.toLowerCase()}
                  {" "}Detailed research, user context, and boundary conditions
                  will be documented in the finished study.
                </EditorialPlaceholder>
              </div>
            </section>

            <section id="solution" aria-labelledby="solution-title">
              <p className={styles.sectionNumber}>03</p>
              <div>
                <h2 id="solution-title">Solution</h2>
                <EditorialPlaceholder>
                  The current solution record is represented by the published
                  product proposition and its {project.status.toLowerCase()}
                  {" "}status. Product decisions and validation evidence remain
                  intentionally unfinished in this phase.
                </EditorialPlaceholder>
              </div>
            </section>

            <section id="architecture" aria-labelledby="architecture-title">
              <p className={styles.sectionNumber}>04</p>
              <div>
                <h2 id="architecture-title">Architecture</h2>
                <EditorialPlaceholder>
                  The architecture record will explain how the documented core
                  technologies cooperate, where system boundaries sit, and why
                  those boundaries were selected.
                </EditorialPlaceholder>
                <ol className={styles.architectureInventory}>
                  {project.coreTechnologies.map((technology, index) => (
                    <li key={technology}>
                      <span>{String(index + 1).padStart(2, "0")}</span>
                      {technology}
                    </li>
                  ))}
                </ol>
              </div>
            </section>

            <section id="results" aria-labelledby="results-title">
              <p className={styles.sectionNumber}>05</p>
              <div>
                <h2 id="results-title">Results</h2>
                <dl className={styles.resultsSummary}>
                  <div>
                    <dt>Release state</dt>
                    <dd>{project.status}</dd>
                  </div>
                  <div>
                    <dt>Record year</dt>
                    <dd>{project.year}</dd>
                  </div>
                </dl>
                <EditorialPlaceholder>
                  Verified outcomes, adoption signals, and performance measures
                  will replace this note when the individual case study is
                  authored.
                </EditorialPlaceholder>
              </div>
            </section>

            <section id="technology" aria-labelledby="technology-title">
              <p className={styles.sectionNumber}>06</p>
              <div>
                <h2 id="technology-title">Technology</h2>
                <ul className={styles.technologyList}>
                  {project.coreTechnologies.map((technology) => (
                    <li key={technology}>{technology}</li>
                  ))}
                </ul>
              </div>
            </section>

            <section id="links" aria-labelledby="links-title">
              <p className={styles.sectionNumber}>07</p>
              <div>
                <h2 id="links-title">Links</h2>
                <ul className={styles.projectLinks}>
                  {project.live && (
                    <li>
                      <a href={project.live} target="_blank" rel="noreferrer">
                        Live product
                        <span className={styles.srOnly}> (opens in a new tab)</span>
                      </a>
                    </li>
                  )}
                  {project.github && (
                    <li>
                      <a href={project.github} target="_blank" rel="noreferrer">
                        Source repository
                        <span className={styles.srOnly}> (opens in a new tab)</span>
                      </a>
                    </li>
                  )}
                </ul>
              </div>
            </section>
          </article>
        </div>
      </div>
    </main>
  );
};

export default CaseStudyLayout;
