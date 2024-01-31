import type { MetaFunction } from "@remix-run/cloudflare";
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
      <p>Hey, I&apos;m Nick 👋</p>
      <p>
        Ever since I was a teenager I&apos;ve been fascinated by what we can do
        with code.
      </p>
      <img
        src={profile}
        alt="Nicholas Ferrara smiling in the sunset"
        className={styles.profile}
      />
      <h2>
        Full stack polyglot senior software engineer focusing on process
        automation based in London, United Kingdom
      </h2>
      <a href="https://github.com/nickineering">Github</a>
      <a href="https://www.linkedin.com/in/nicholasferrara/">LinkedIn</a>
      <a href="https://leetcode.com/nickineering/">LeetCode</a>
      <p>Contact form - Bio - CV - Github projects</p>
    </div>
  );
}
