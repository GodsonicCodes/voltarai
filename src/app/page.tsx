// import Navbar from "@/components/ui/Navbar";
import HeroSection from "@/components/home-sections/HeroSection";
import InANutshellSection from "@/components/home-sections/InANutshellSection";
import OurServicesSection from "@/components/home-sections/OurServicesSection";
import ProblemStatementSection from "@/components/home-sections/ProblemStatementSection";
import SolutionSection from "@/components/home-sections/SolutionSection";
import CompleteAIWorkforceSection from "@/components/home-sections/CompleteAIWorkforceSection";
import AIBenefitsSection from "@/components/home-sections/AIBenefitsSection";
import { CustomAIAgentsSection } from "@/components/home-sections";

export default function Home() {
  return (
    <div className="w-screen min-h-screen flex flex-col bg-bgBlack">
      {/* <Navbar /> */}
      <HeroSection />
      <AIBenefitsSection />
      <InANutshellSection />
      <OurServicesSection />
      <ProblemStatementSection />
      <SolutionSection />
      <CompleteAIWorkforceSection />
      <CustomAIAgentsSection/>
    </div>
    <div className="w-screen h-screen flex flex-col justify-center items-center bg-bgBlack">
      <h1 className="text-9xl font-bold textradialgradientgrey">VoltarAi</h1>
      <h1 className="text-6xl font-bold textradialgradientblue">True AI-Automation</h1>
    </div>
  );
}
