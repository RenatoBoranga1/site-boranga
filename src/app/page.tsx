import type { Metadata } from "next";
import { resolveExperience } from "@/lib/experience";
import { ExperiencePage } from "@/components/ExperiencePage";
import { UnavailableExperience } from "@/sections/UnavailableExperience";
import type { RawSearchParams } from "@/types/bottle";

type HomeProps = { searchParams: Promise<RawSearchParams> };
export async function generateMetadata({ searchParams }: HomeProps): Promise<Metadata> {
  return (await searchParams).token !== undefined ? { robots: { index: false, follow: false }, referrer: "no-referrer" } : {};
}
export default async function Home({ searchParams }: HomeProps) {
  const experience = resolveExperience(await searchParams);
  if (experience.state === "disabled") return <UnavailableExperience disabled />;
  return <ExperiencePage experience={experience} />;
}
