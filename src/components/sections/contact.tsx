import ContactForm from "../ContactForm";
import { config } from "@/data/config";
import styles from "./contact.module.scss";

const ContactSection = () => {
  return (
    <section
      id="contact"
      className={styles.contact}
      aria-labelledby="contact-title"
    >
      <div className={styles.container}>
        <header className={styles.introduction}>
          <p className={styles.eyebrow}>05 / Open channel</p>
          <h2 id="contact-title" className={styles.title}>
            Bring the difficult problem.
          </h2>
          <p className={styles.statement}>
            The best collaborations begin before the solution is obvious. Share
            the constraint, the ambition, and what success needs to change.
          </p>
        </header>

        <div className={styles.contactGrid}>
          <aside
            className={styles.contactMethods}
            aria-labelledby="contact-methods-title"
          >
            <p className={styles.panelLabel}>Direct channels</p>
            <h3 id="contact-methods-title">Start where it feels natural.</h3>

            <address>
              <ul>
                <li>
                  <span>Email</span>
                  <a href={`mailto:${config.email}`}>{config.email}</a>
                </li>
                <li>
                  <span>LinkedIn</span>
                  <a
                    href={config.social.linkedin}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Professional profile
                    <span className={styles.srOnly}> (opens in a new tab)</span>
                  </a>
                </li>
                <li>
                  <span>GitHub</span>
                  <a
                    href={config.social.github}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Engineering record
                    <span className={styles.srOnly}> (opens in a new tab)</span>
                  </a>
                </li>
              </ul>
            </address>
          </aside>

          <div className={styles.formPanel}>
            <header>
              <p className={styles.panelLabel}>Project inquiry</p>
              <h3>Describe the system.</h3>
              <p>
                A concise brief is enough. Include the problem, current stage,
                and the outcome you are trying to create.
              </p>
            </header>
            <ContactForm />
          </div>
        </div>

        <footer className={styles.closingMetadata}>
          <dl>
            <div>
              <dt>Base</dt>
              <dd>India / UTC+05:30</dd>
            </div>
            <div>
              <dt>Practice</dt>
              <dd>Full-stack development and Web3 systems</dd>
            </div>
            <div>
              <dt>Response</dt>
              <dd>Usually within two business days</dd>
            </div>
          </dl>
          <p>End of field notes / Continue the conversation</p>
        </footer>
      </div>
    </section>
  );
};

export default ContactSection;
