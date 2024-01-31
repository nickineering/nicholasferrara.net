import leetcodeLogo from "~/images/leetcode.svg";
import styles from "~/styles/link.module.css";

export default function LeetCode() {
  return (
    <a
      href="https://leetcode.com/nickineering/"
      target="_blank"
      rel="noreferrer"
      className={styles.socialLink}
    >
      <img
        src={leetcodeLogo}
        className={styles.linkLogo}
        alt="Nicholas Ferrara's LeetCode profile"
      />
      <span>LeetCode</span>
    </a>
  );
}
