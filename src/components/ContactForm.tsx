"use client";

import { config } from "@/data/config";
import React from "react";
import styles from "./sections/contact.module.scss";

type SubmissionState = "idle" | "submitting" | "success" | "error";

const ContactForm = () => {
  const [fullName, setFullName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [submissionState, setSubmissionState] =
    React.useState<SubmissionState>("idle");

  const isSubmitting = submissionState === "submitting";

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmissionState("submitting");

    try {
      const response = await fetch("/api/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName,
          email,
          message,
        }),
      });
      const data = await response.json();

      if (!response.ok || data.error || data.resendError) {
        throw new Error("Contact request failed");
      }

      setFullName("");
      setEmail("");
      setMessage("");
      setSubmissionState("success");
    } catch {
      setSubmissionState("error");
    }
  };

  return (
    <>
      <form
        className={styles.contactForm}
        onSubmit={handleSubmit}
        aria-busy={isSubmitting}
      >
        <div className={styles.fieldRow}>
          <div className={styles.field}>
            <label htmlFor="contact-full-name">Full name</label>
            <input
              id="contact-full-name"
              name="fullName"
              type="text"
              autoComplete="name"
              minLength={2}
              required
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="contact-email">Email address</label>
            <input
              id="contact-email"
              name="email"
              type="email"
              autoComplete="email"
              inputMode="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>
        </div>

        <div className={styles.field}>
          <label htmlFor="contact-message">Project context</label>
          <textarea
            id="contact-message"
            name="message"
            rows={7}
            minLength={10}
            required
            aria-describedby="contact-message-guidance"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
          />
          <p id="contact-message-guidance" className={styles.fieldGuidance}>
            Include at least 10 characters. Your details are used only to reply.
          </p>
        </div>

        <button
          type="submit"
          className={styles.submitButton}
          disabled={isSubmitting}
          aria-describedby="contact-form-status"
        >
          {isSubmitting ? "Sending inquiry…" : "Send inquiry"}
        </button>

        <div
          id="contact-form-status"
          className={styles.submissionFeedback}
          data-state={submissionState}
          role={submissionState === "error" ? "alert" : "status"}
          aria-live={submissionState === "error" ? "assertive" : "polite"}
        >
          {submissionState === "success" && (
            <p>
              Message received. Thank you—I&apos;ll reply as soon as possible.
            </p>
          )}
          {submissionState === "error" && (
            <p>
              The message could not be sent. Check the fields or email me
              directly at <a href={`mailto:${config.email}`}>{config.email}</a>.
            </p>
          )}
        </div>
      </form>

      <noscript>
        <p className={styles.noScriptFallback}>
          The secure form requires JavaScript. You can still contact me directly
          at <a href={`mailto:${config.email}`}>{config.email}</a>.
        </p>
      </noscript>
    </>
  );
};

export default ContactForm;
