import styles from "~/styles/link.module.css";

interface SocialLinkProps {
  alt: string;
  logo: string;
  name: string;
  url: string;
}

export default function SocialLink({ alt, name, url, logo }: SocialLinkProps) {
  return (
    <div className={styles.socialLinkContainer}>
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        className={styles.socialLink}
      >
        <img
          src={logo}
          className={styles.linkLogo}
          alt={"Nicholas Ferrara's " + alt}
        />
        <span>{name}</span>
      </a>
    </div>
  );
}
