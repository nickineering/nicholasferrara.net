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
        <div className={styles.socialImageContainer}>
          <img
            src={logo}
            className={styles.linkLogo}
            alt={"Nicholas Ferrara's " + alt}
          />
        </div>
        <span>{name}</span>
      </a>
    </div>
  );
}
