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
        "A full-stack polyglot senior software engineer focusing on process automation based in London, United Kingdom.",
    },
  ];
};

export default function Index() {
  return (
    <div className={`${styles.container} container`}>
      <h1>Nicholas Ferrara - Software Engineer</h1>
      <section className={styles.flexContainer}>
        <Bio />
        <aside className={styles.imageAndLinks}>
          <img
            src={profile}
            alt="Nick smiling while hiking on a mountain"
            className={styles.profile}
          />
          <ExternalLinks />
        </aside>
      </section>
      <ContactForm />
      <Faq />
    </div>
  );
}
