import type { MetaFunction } from "@remix-run/cloudflare";
import { LoaderFunctionArgs } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import Bio from "~/components/Bio";
import { ContactForm } from "~/components/ContactForm";
import ExternalLinks from "~/components/ExternalLinks";
import Faq from "~/components/Faq";
import Footer from "~/components/Footer";
import profile from "~/images/profile.jpg";
import styles from "~/styles/_index.module.css";
import { PagesEnv } from "~/types/PagesEnv";

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

export const loader = ({ context }: LoaderFunctionArgs) => {
  return {
    TURNSTILE_SITE_KEY_PUBLIC: (context.env as PagesEnv)
      .TURNSTILE_SITE_KEY_PUBLIC,
  };
};

export default function Index() {
  const data = useLoaderData<typeof loader>();

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
      <ContactForm TURNSTILE_SITE_KEY_PUBLIC={data.TURNSTILE_SITE_KEY_PUBLIC} />
      <Faq />
      <Footer />
    </div>
  );
}
