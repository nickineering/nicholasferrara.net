import styles from "./Home.module.css";

export default function Home() {
  return (
    <div className={styles.container}>
      <h1>Nicholas Ferrara - Software Engineer</h1>
      <p>Hey, I&apos;m Nick 👋</p>
      <p>
        Ever since I was a teenager I&apos;ve been fascinated by what we can do
        with code.
      </p>
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
