import type { MetaFunction } from "@remix-run/cloudflare";
import Home from "../components/Home";

export const meta: MetaFunction = () => {
  return [
    { title: "Nicholas Ferrara - Software Engineer" },
    {
      name: "description",
      content: "The portfolio website of Nicholas Ferrara.",
    },
  ];
};

export default function Index() {
  return <Home />;
}
