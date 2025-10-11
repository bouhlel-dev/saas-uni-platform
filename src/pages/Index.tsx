import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { Roles } from "@/components/Roles";
import { Architecture } from "@/components/Architecture";
import { CTA } from "@/components/CTA";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <div id="features">
        <Features />
      </div>
      <div id="roles">
        <Roles />
      </div>
      <div id="architecture">
        <Architecture />
      </div>
      <CTA />
      <Footer />
    </div>
  );
};

export default Index;
