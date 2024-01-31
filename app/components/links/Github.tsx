import githubLogo from "~/images/github.svg";
import styles from "~/styles/link.module.css";

export default function Github() {
  return (
    <a
      href="https://github.com/nickineering"
      target="_blank"
      rel="noreferrer"
      className={styles.socialLink}
    >
      <img
        src={githubLogo}
        className={styles.linkLogo}
        alt="Nicholas Ferrara's Github profile"
      />
      <span>Github</span>
    </a>
  );
}
