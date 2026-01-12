// import Navbar from "@/components/ui/Navbar";
import HeroSection from "@/components/home-sections/HeroSection";
import InANutshellSection from "@/components/home-sections/InANutshellSection";
import OurServicesSection from "@/components/home-sections/OurServicesSection";
import ProblemStatementSection from "@/components/home-sections/ProblemStatementSection";
import SolutionSection from "@/components/home-sections/SolutionSection";
import CompleteAIWorkforceSection from "@/components/home-sections/CompleteAIWorkforceSection";
import AIBenefitsSection from "@/components/home-sections/AIBenefitsSection";
import CustomAIAgentsSection from "@/components/home-sections/CustomAIAgentsSection";

{/* <last-eight components> */}
import Results from "@/components/custom/results";
import CTA6 from "@/components/custom/cta6";
import CTA7 from "@/components/custom/cta7";
import FAQ from "@/components/custom/faq";
import AboutUs from "@/components/custom/aboutUs";
import FinalCta from "@/components/custom/finalCta";
import VoiceAgent from "@/components/custom/voice-agent";

export default function Home() {
  return (
    <div className="w-screen min-h-screen flex flex-col bg-bgBlack">
      {/* <Navbar /> */}
      <HeroSection />
      <VoiceAgent />
      <AIBenefitsSection />
      <InANutshellSection />
      <OurServicesSection />
      <ProblemStatementSection />
      <SolutionSection />
      <CompleteAIWorkforceSection />
      <CustomAIAgentsSection/>
      {/* <last-eight components> */}
      <Results/>
      <CTA6/>
      <CTA7/>
      <FAQ/>
      <AboutUs/>
      <FinalCta/>
      </div>
  );
}
