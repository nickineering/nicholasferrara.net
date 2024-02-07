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
        url="/Nicholas_Ferrara_CV_From_Website.pdf"
        logo={cvIcon}
      />
      <p>Based in central London 🇬🇧</p>
    </div>
  );
}
