import { createFileRoute } from "@tanstack/react-router";
import { Shell } from "@/components/avara/Shell";
import { TodayPage } from "@/components/avara/TodayPage";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Today's review · Avara" },
      { name: "description", content: "Avara briefing: what needs attention today, recovery priorities, prepared actions and priority leads." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <Shell title="Today's review" subtitle="Avara briefing">
      <TodayPage />
    </Shell>
  );
}
