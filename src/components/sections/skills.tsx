import { SkillNames, SKILLS } from "@/data/constants";
import styles from "./skills.module.scss";

const SKILL_GROUPS = [
  {
    label: "Language & interface",
    description: "Type-safe interfaces shaped for clarity, speed, and resilience.",
    skills: [
      SkillNames.JS,
      SkillNames.TS,
      SkillNames.HTML,
      SkillNames.CSS,
      SkillNames.REACT,
      SkillNames.VUE,
      SkillNames.NEXTJS,
      SkillNames.TAILWIND,
    ],
  },
  {
    label: "Runtime & data",
    description: "Application services and data layers designed as one system.",
    skills: [
      SkillNames.NODEJS,
      SkillNames.EXPRESS,
      SkillNames.POSTGRES,
      SkillNames.MONGODB,
      SkillNames.FIREBASE,
      SkillNames.WORDPRESS,
    ],
  },
  {
    label: "Delivery & infrastructure",
    description: "Repeatable environments from local development to production.",
    skills: [
      SkillNames.LINUX,
      SkillNames.DOCKER,
      SkillNames.NGINX,
      SkillNames.AWS,
      SkillNames.VERCEL,
    ],
  },
  {
    label: "Engineering workflow",
    description: "Disciplined tooling for maintainable, collaborative delivery.",
    skills: [
      SkillNames.GIT,
      SkillNames.GITHUB,
      SkillNames.NPM,
      SkillNames.PRETTIER,
      SkillNames.VIM,
    ],
  },
] as const;

const SkillsSection = () => {
  return (
    <section
      id="skills"
      className={styles.skills}
      aria-labelledby="skills-title"
    >
      <div className={styles.stage}>
        <header className={styles.introduction}>
          <p className={styles.eyebrow}>02 / Systems repertoire</p>
          <h2 id="skills-title" className={styles.title}>
            Engineering the seams.
          </h2>
          <p className={styles.statement}>
            The useful work happens between disciplines: interface and runtime,
            protocol and product, prototype and production.
          </p>
        </header>

        <aside className={styles.interactionGuide} aria-label="Keyboard interaction guide">
          <span className={styles.guideLabel}>Interactive field</span>
          <p>
            Hover or press a technology key to inspect it. The complete text
            index remains available here.
          </p>
        </aside>

        <div
          className={styles.capabilityIndex}
          aria-labelledby="capability-index-title"
        >
          <p id="capability-index-title" className={styles.indexLabel}>
            Capability index / 24 instruments
          </p>

          <div className={styles.groups}>
            {SKILL_GROUPS.map((group) => (
              <section key={group.label} className={styles.group}>
                <h3>{group.label}</h3>
                <p>{group.description}</p>
                <ul>
                  {group.skills.map((skillName) => {
                    const skill = SKILLS[skillName];

                    return (
                      <li key={skill.name}>
                        <span>{skill.label}</span>
                        <span className={styles.srOnly}>
                          {skill.shortDescription}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </section>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
