import { createFileRoute } from "@tanstack/react-router";
import { VerduraApp } from "@/components/verdura/VerduraApp";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Verdura — Greenhouse monitoring & safe control" },
      { name: "description", content: "Mobile prototype for monitoring greenhouse sensors and safely controlling irrigation." },
      { property: "og:title", content: "Verdura — Greenhouse monitoring & safe control" },
      { property: "og:description", content: "Mobile prototype for monitoring greenhouse sensors and safely controlling irrigation." },
    ],
  }),
  component: VerduraApp,
});
