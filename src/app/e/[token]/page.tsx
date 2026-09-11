import type { Metadata } from "next";
import { ExperiencePage } from "@/components/ExperiencePage";
import { UnavailableExperience } from "@/sections/UnavailableExperience";
import { getExperienceByToken } from "@/lib/experience";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Sua experiência | BORANGA",
  description: "Uma experiência BORANGA reservada para você.",
  robots: { index: false, follow: false },
  referrer: "no-referrer",
  alternates: { canonical: "/" },
};
export default async function IndividualExperience({ params }: { params: Promise<{ token: string }> }) {
  const experience = getExperienceByToken((await params).token);
  if (experience.state === "invalid" || experience.state === "disabled") {
    return <UnavailableExperience disabled={experience.state === "disabled"} />;
  }
  return <ExperiencePage experience={experience} individualRoute />;
}
