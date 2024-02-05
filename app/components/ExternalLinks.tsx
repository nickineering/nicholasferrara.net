import SocialLink from "~/components/SocialLink";
import cvIcon from "~/images/cv.svg";
import githubLogo from "~/images/github.svg";
import leetcodeLogo from "~/images/leetcode.svg";
import linkedinLogo from "~/images/linkedin.png";

export default function ExternalLinks() {
  return (
    <div>
      <SocialLink
        name={"Github"}
        url={"https://github.com/nickineering"}
        logo={githubLogo}
      />
      <SocialLink
        name={"LinkedIn"}
        url={"https://www.linkedin.com/in/nicholasferrara/"}
        logo={linkedinLogo}
      />
      <SocialLink
        name={"LeetCode"}
        url={"https://leetcode.com/nickineering/"}
        logo={leetcodeLogo}
      />
      <SocialLink
        name={"CV"}
        url={"/Nicholas_Ferrara_CV_From_Website.pdf"}
        logo={cvIcon}
      />
      <p>I&apos;m based in central London 🇬🇧</p>
    </div>
  );
}
