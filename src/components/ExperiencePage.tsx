import "server-only";
import { createHash } from "node:crypto";
import { Header } from "@/components/Header";
import { MotionRuntime } from "@/components/MotionRuntime";
import { ExperienceGate } from "@/components/ExperienceGate";
import { PersonalInvitation } from "@/sections/PersonalInvitation";
import { PersonalPairing } from "@/sections/PersonalPairing";
import { YourEdition } from "@/sections/YourEdition";
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
import { sanitizeExperienceToken } from "@/lib/experience-token";
import type { ResolvedExperience } from "@/types/experience";

export function ExperiencePage({ experience, individualRoute = false }: { experience: ResolvedExperience; individualRoute?: boolean }) {
  const { bottle, customer, pairing, message, token } = experience;
  const individual = Boolean(token && (individualRoute || sanitizeExperienceToken(token)));
  const analytics = individual && token ? {
    lot: bottle.lot, bottle: bottle.bottle, pairingId: pairing?.id,
    identifier: createHash("sha256").update(token).digest("hex"),
  } : undefined;
  const personalization = { customerName: customer?.name, pairingName: pairing?.name, message };
  const content = <>
    <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>
    <Header />
    <MotionRuntime bottle={bottle} analytics={analytics} />
    <main id="conteudo">
      <Hero />
      <BrandStory />
      <JabuticabaSection />
      <SensoryProfile />
      <RitualSection />
      <PairingSection />
      {pairing && <PersonalPairing pairing={pairing} customerName={customer?.name} />}
      <BottleIdentity bottle={bottle} />
      <YourEdition bottle={bottle} personalization={personalization} />
      <DigitalCertificate bottle={bottle} personalization={{ customerName: customer?.name, pairingName: pairing?.name }}
        experiencePath={individual ? `/e/${token}` : undefined} analytics={analytics} />
      <ServingGuide />
      <ExperienceCards />
      <Ingredients />
      <GiftSection />
    </main>
    <Footer />
  </>;
  return customer && analytics ? <ExperienceGate key={token} analytics={analytics}
    invitation={<PersonalInvitation name={customer.name} message={message} pairingName={pairing?.name} />}>{content}</ExperienceGate> : content;
}
