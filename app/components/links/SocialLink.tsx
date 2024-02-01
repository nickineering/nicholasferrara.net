import styles from "~/styles/link.module.css";

interface SocialLinkProps {
  name: string;
  url: string;
  logo: string;
}

export default function SocialLink({ name, url, logo }: SocialLinkProps) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className={styles.socialLink}
    >
      <img
        src={logo}
        className={styles.linkLogo}
        alt={"Nicholas Ferrara's " + name + " profile"}
      />
      <span>{name}</span>
    </a>
  );
}
