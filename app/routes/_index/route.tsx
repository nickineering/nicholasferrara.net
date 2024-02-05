import type { MetaFunction } from "@remix-run/cloudflare";
import Bio from "~/components/Bio";
import ContactForm from "~/components/ContactForm";
import ExternalLinks from "~/components/ExternalLinks";
import Faq from "~/components/Faq";
import profile from "~/images/profile.jpg";
import styles from "~/styles/_index.module.css";

export const meta: MetaFunction = () => {
  return [
    { title: "Nicholas Ferrara - Software Engineer" },
    {
      name: "description",
      content:
        "A full stack polyglot senior software engineer focusing on process automation based in London, United Kingdom.",
    },
  ];
};

export default function Index() {
  return (
    <div className={styles.container}>
      <h1>Nicholas Ferrara - Software Engineer</h1>
      <div className={styles.flexContainer}>
        <Bio />
        <div>
          <img
            src={profile}
            alt="Nicholas Ferrara smiling in the sunset"
            className={styles.profile}
          />
          <ExternalLinks />
        </div>
      </div>
      <ContactForm />
      <Faq />
    </div>
  );
}
