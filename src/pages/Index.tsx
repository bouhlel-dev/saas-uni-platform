import { Bot } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { Roles } from "@/components/Roles";
import { Architecture } from "@/components/Architecture";
import { CTA } from "@/components/CTA";
import { Footer } from "@/components/Footer";
import Chat from "@/components/Chat";
import { Button } from "@/components/ui/button";
import { useChatbot } from "@/components/contexts/ChatContext";

import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const Index = () => {
  const { toggleChatbot } = useChatbot();
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const element = document.querySelector(location.hash);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
        }, 100); // Small delay to ensure rendering
      }
    }
  }, [location]);
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
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleChatbot}
        title="Toggle chatbot"
        className="fixed bottom-6 right-6 z-50 rounded-full p-6 bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 transition-colors"
      >
        <Bot className="size-24" />

      </Button>
      <Chat />
    </div>
  );
};

export default Index;
