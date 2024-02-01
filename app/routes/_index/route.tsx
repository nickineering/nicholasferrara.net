import type { MetaFunction } from "@remix-run/cloudflare";
import SocialLink from "~/components/links/SocialLink";
import githubLogo from "~/images/github.svg";
import leetcodeLogo from "~/images/leetcode.svg";
import linkedinLogo from "~/images/linkedin.png";
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
        <div>
          <p>Hey, I&apos;m Nick 👋</p>
          <p>
            Ever since I was a teenager I&apos;ve been fascinated by what we can
            do with code.
          </p>
        </div>
        <img
          src={profile}
          alt="Nicholas Ferrara smiling in the sunset"
          className={styles.profile}
        />
      </div>
      <h2>
        Full stack polyglot senior software engineer focusing on process
        automation based in London, United Kingdom
      </h2>
      <SocialLink
        name={"Github"}
        url={"https://github.com/nickineering"}
        logo={githubLogo}
      />
      <SocialLink
        name={"LinkedIn"}
        url={"https://www.linkedin.com/in/nicholasferrara/"}
        logo={linkedinLogo}
      />
      <SocialLink
        name={"LeetCode"}
        url={"https://leetcode.com/nickineering/"}
        logo={leetcodeLogo}
      />
      <p>Contact form - Bio - CV - Github projects</p>
    </div>
  );
}
