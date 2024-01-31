import linkedinLogo from "~/images/linkedin.png";
import styles from "~/styles/link.module.css";

export default function LinkedIn() {
  return (
    <a
      href="https://www.linkedin.com/in/nicholasferrara/"
      target="_blank"
      rel="noreferrer"
      className={styles.socialLink}
    >
      <img
        src={linkedinLogo}
        className={styles.linkLogo}
        alt="Nicholas Ferrara's LinkedIn profile"
      />
      <span>LinkedIn</span>
    </a>
  );
}
