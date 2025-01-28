import { Turnstile } from "@marsidev/react-turnstile";
import styles from "~/styles/_index.module.css";

interface ContactFormProps {
  TURNSTILE_SITE_KEY_PUBLIC: string;
}

export const ContactForm: React.FC<ContactFormProps> = (
  props: ContactFormProps
) => {
  return (
    <section>
      <h2>Contact me</h2>
      <form method="post" action="/api/contact_form">
        <fieldset className="grid">
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            maxLength={100}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            maxLength={255}
            required
          />
        </fieldset>
        <textarea
          name="message"
          placeholder="Your Message"
          rows={5}
          required
        ></textarea>
        <div className={styles.turnstileContainer}>
          <Turnstile siteKey={props.TURNSTILE_SITE_KEY_PUBLIC} />
        </div>
        <button type="submit">Send</button>
      </form>
      <hr />
    </section>
  );
};
