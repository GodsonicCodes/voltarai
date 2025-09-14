// Import all section components for the landing page
import Navbar from "@/components/Navbar";
// import GlobalBackground from "@/components/GlobalBackground";
import {
  HeroSection,
  AIBenefitsSection,
  InANutshellSection,
  OurServicesSection,
  ProblemStatementSection,
  SolutionSection,
  CompleteAIWorkforceSection,
  CustomAIAgentsSection,
} from "@/components/home-sections";



export default function Home() {
  return (
    <main className="bg-bgBlack relative min-h-screen">
      {/* Global animated background circles for entire page */}
      {/*<GlobalBackground />*/}

      {/* Top navigation bar with brand and CTA */}
      <div className="relative z-20">
        <Navbar />
      </div>

      {/* Hero section with social proof, headline, and primary CTA */}
      <div className="relative z-10">
        <HeroSection />
      </div>

      {/* AI benefits introduction with secondary CTA */}
      <div className="relative z-10">
        <AIBenefitsSection />
      </div>

      {/* Company mission and key performance statistics */}
      <div className="relative z-10">
        <InANutshellSection />
      </div>

      {/* Four main AI service offerings in a grid layout */}
      <div className="relative z-10">
        <OurServicesSection />
      </div>

      {/* Problem identification to create urgency */}
      <div className="relative z-10">
        <ProblemStatementSection />
      </div>

      {/* AI solution presentation with benefits */}
      <div className="relative z-10">
        <SolutionSection />
      </div>

      {/* Comprehensive AI workforce showcase */}
      <div className="relative z-10">
        <CompleteAIWorkforceSection />
      </div>

      {/* Custom AI agent examples and capabilities */}
      <div className="relative z-10">
        <CustomAIAgentsSection />
      </div>

      {/* for testing white images */}
      
    </main>
  );
}
