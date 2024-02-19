import SocialLink from "~/components/SocialLink";
import cvIcon from "~/images/cv.svg";
import githubLogo from "~/images/github.svg";
import leetcodeLogo from "~/images/leetcode.svg";
import linkedinLogo from "~/images/linkedin.png";

export default function ExternalLinks() {
  return (
    <div>
      <SocialLink
        name="Github"
        alt="Github profile"
        url="https://github.com/nickineering"
        logo={githubLogo}
      />
      <SocialLink
        name="LinkedIn"
        alt="LinkedIn profile"
        url="https://www.linkedin.com/in/nicholasferrara/"
        logo={linkedinLogo}
      />
      <SocialLink
        name="LeetCode"
        alt="LeetCode profile"
        url="https://leetcode.com/nickineering/"
        logo={leetcodeLogo}
      />
      <SocialLink
        name="CV"
        alt="CV"
        url="https://docs.google.com/document/d/1JNP756D_xrkBCdV_2j_fS5Fyc_6QiTWHyZ3R18YxEiQ/"
        logo={cvIcon}
      />
      <article>Based in central London 🇬🇧</article>
    </div>
  );
}
