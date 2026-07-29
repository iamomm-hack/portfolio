import { EXPERIENCE, SKILLS } from "@/data/constants";
import styles from "./experience.module.scss";

const ExperienceSection = () => {
  return (
    <section
      id="experience"
      className={styles.experience}
      aria-labelledby="experience-title"
    >
      <div className={styles.container}>
        <header className={styles.introduction}>
          <p className={styles.eyebrow}>03 / Field record</p>
          <h2 id="experience-title" className={styles.title}>
            Systems tested in the real world.
          </h2>
          <p className={styles.statement}>
            A record of applied engineering, developer education, and visual
            communication—measured by what each role made possible.
          </p>
        </header>

        <ol className={styles.timeline} aria-label="Professional experience">
          {EXPERIENCE.map((experience, index) => (
            <li key={experience.id} className={styles.entry}>
              <article aria-labelledby={`experience-${experience.id}-role`}>
                <div className={styles.sequence} aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </div>

                <div className={styles.record}>
                  <header className={styles.recordHeader}>
                    <div>
                      <p className={styles.organization}>
                        {experience.company}
                      </p>
                      <h3
                        id={`experience-${experience.id}-role`}
                        className={styles.role}
                      >
                        {experience.title}
                      </h3>
                    </div>

                    <p className={styles.duration}>
                      <span className={styles.srOnly}>Duration: </span>
                      {experience.startDate}
                      <span aria-hidden="true"> — </span>
                      <span className={styles.srOnly}>to </span>
                      {experience.endDate}
                    </p>
                  </header>

                  <div className={styles.details}>
                    <section aria-labelledby={`experience-${experience.id}-impact`}>
                      <h4
                        id={`experience-${experience.id}-impact`}
                        className={styles.detailLabel}
                      >
                        Impact
                      </h4>
                      <ul className={styles.outcomes}>
                        {experience.description.map((outcome) => (
                          <li key={outcome}>{outcome}</li>
                        ))}
                      </ul>
                    </section>

                    <section
                      className={styles.technologies}
                      aria-labelledby={`experience-${experience.id}-technologies`}
                    >
                      <h4
                        id={`experience-${experience.id}-technologies`}
                        className={styles.detailLabel}
                      >
                        Technologies
                      </h4>
                      <ul>
                        {(
                          experience.technologies ??
                          experience.skills.map(
                            (skillName) => SKILLS[skillName].label,
                          )
                        ).map((technology) => (
                          <li key={technology}>{technology}</li>
                        ))}
                      </ul>
                    </section>
                  </div>
                </div>
              </article>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};

export default ExperienceSection;
