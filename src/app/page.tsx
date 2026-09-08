import { getBottleIdentity } from "@/lib/bottle";
import { BrandStory } from "@/sections/BrandStory";
import { BottleIdentity } from "@/sections/BottleIdentity";
import { DigitalCertificate } from "@/sections/DigitalCertificate";
import { ExperienceCards } from "@/sections/ExperienceCards";
import { Footer } from "@/sections/Footer";
import { GiftSection } from "@/sections/GiftSection";
import { Hero } from "@/sections/Hero";
import { Ingredients } from "@/sections/Ingredients";
import { JabuticabaSection } from "@/sections/JabuticabaSection";
import { PairingSection } from "@/sections/PairingSection";
import { RitualSection } from "@/sections/RitualSection";
import { SensoryProfile } from "@/sections/SensoryProfile";
import { ServingGuide } from "@/sections/ServingGuide";
import type { RawSearchParams } from "@/types/bottle";

type HomeProps = {
  searchParams: Promise<RawSearchParams>;
};

export default async function Home({ searchParams }: HomeProps) {
  const bottle = getBottleIdentity(await searchParams);

  return (
    <>
      <main>
        <Hero />
        <BrandStory />
        <JabuticabaSection />
        <SensoryProfile />
        <RitualSection />
        <PairingSection />
        <BottleIdentity bottle={bottle} />
        <DigitalCertificate bottle={bottle} />
        <ServingGuide />
        <ExperienceCards />
        <Ingredients />
        <GiftSection />
      </main>
      <Footer />
    </>
  );
}
