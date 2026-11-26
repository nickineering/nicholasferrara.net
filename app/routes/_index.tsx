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
import { Env } from "~/types/Env";

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

export const loader = ({ context, request }: LoaderFunctionArgs) => {
  // Set by the contact form redirect when JavaScript is unavailable.
  const contact = new URL(request.url).searchParams.get("contact");
  const contactStatus: "success" | "error" | undefined =
    contact === "success" || contact === "error" ? contact : undefined;
  return {
    TURNSTILE_SITE_KEY_PUBLIC: (context.env as Env).TURNSTILE_SITE_KEY_PUBLIC,
    contactStatus,
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
      <ContactForm
        TURNSTILE_SITE_KEY_PUBLIC={data.TURNSTILE_SITE_KEY_PUBLIC}
        initialStatus={data.contactStatus}
      />
      <Faq />
      <Footer />
    </div>
  );
}
