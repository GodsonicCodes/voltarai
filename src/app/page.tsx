// import Navbar from "@/components/ui/Navbar";
import HeroSection from "@/components/home-sections/HeroSection";
import InANutshellSection from "@/components/home-sections/InANutshellSection";
import OurServicesSection from "@/components/home-sections/OurServicesSection";
import ProblemStatementSection from "@/components/home-sections/ProblemStatementSection";
import SolutionSection from "@/components/home-sections/SolutionSection";
import CompleteAIWorkforceSection from "@/components/home-sections/CompleteAIWorkforceSection";
import {AIBenefitsSection, CustomAIAgentsSection} from "@/components/home-sections";

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
            <CustomAIAgentsSection />
        </div>
    );
}
