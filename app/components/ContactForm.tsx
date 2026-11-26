import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import { useRef, useState, type FormEvent } from "react";
import { ClientOnly } from "~/components/ClientOnly";
import styles from "~/styles/_index.module.css";

export type ContactStatus = "idle" | "sending" | "success" | "error";

interface ContactFormProps {
  TURNSTILE_SITE_KEY_PUBLIC: string;
  /** Result of a no-JavaScript submission, read from the URL after redirect. */
  initialStatus?: "success" | "error";
}

interface ContactResponse {
  success: boolean;
  message?: string;
}

const SUCCESS_MESSAGE =
  "Thanks for getting in touch! I'll take a look at your message as soon as possible.";
const FALLBACK_ERROR_MESSAGE =
  "Sorry, your message could not be sent. Please try again, or contact me on LinkedIn.";

export const ContactForm: React.FC<ContactFormProps> = ({
  TURNSTILE_SITE_KEY_PUBLIC,
  initialStatus,
}: ContactFormProps) => {
  const [status, setStatus] = useState<ContactStatus>(initialStatus ?? "idle");
  const [errorMessage, setErrorMessage] = useState(FALLBACK_ERROR_MESSAGE);
  const turnstileRef = useRef<TurnstileInstance>();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    setStatus("sending");

    try {
      const response = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      });
      const result: ContactResponse = await response.json();

      if (response.ok && result.success) {
        form.reset();
        setStatus("success");
      } else {
        setErrorMessage(result.message ?? FALLBACK_ERROR_MESSAGE);
        setStatus("error");
      }
    } catch {
      setErrorMessage(FALLBACK_ERROR_MESSAGE);
      setStatus("error");
    } finally {
      // A Turnstile token can only be used once.
      turnstileRef.current?.reset();
    }
  };

  if (status === "success") {
    return (
      <section id="contact">
        <h2>Contact me</h2>
        <article className={styles.thankYou} role="status" aria-live="polite">
          <span className={styles.thankYouIcon} aria-hidden="true">
            ✓
          </span>
          <div>
            <h3>Message sent</h3>
            <p>{SUCCESS_MESSAGE}</p>
            <button
              type="button"
              className="secondary outline"
              onClick={() => {
                setStatus("idle");
              }}
            >
              Send another message
            </button>
          </div>
        </article>
        <hr />
      </section>
    );
  }

  const sending = status === "sending";

  return (
    <section id="contact">
      <h2>Contact me</h2>
      {status === "error" && (
        <article className={styles.formError} role="alert">
          {errorMessage}
        </article>
      )}
      <form
        method="post"
        action="/api/contact_form"
        onSubmit={(event) => void handleSubmit(event)}
      >
        <fieldset className="grid" disabled={sending}>
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            aria-label="Your Name"
            autoComplete="name"
            maxLength={100}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            aria-label="Your Email"
            autoComplete="email"
            maxLength={255}
            required
          />
        </fieldset>
        <textarea
          name="message"
          placeholder="Your Message"
          aria-label="Your Message"
          rows={5}
          required
          disabled={sending}
        ></textarea>
        <div className={styles.turnstileContainer}>
          <ClientOnly>
            {TURNSTILE_SITE_KEY_PUBLIC && (
              <Turnstile
                ref={turnstileRef}
                siteKey={TURNSTILE_SITE_KEY_PUBLIC}
              />
            )}
          </ClientOnly>
        </div>
        <button type="submit" disabled={sending} aria-busy={sending}>
          {sending ? "Sending…" : "Send"}
        </button>
      </form>
      <hr />
    </section>
  );
};
