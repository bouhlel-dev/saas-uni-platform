import { Button } from "@/components/ui/button";
import { GraduationCap, Users, BookOpen, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-hero overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
            <Shield className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-foreground">Enterprise-Grade Education Platform</span>
          </div>

          {/* Main heading */}
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
            Modern University
            <span className="block bg-gradient-primary bg-clip-text text-transparent">
              Management Platform
            </span>
          </h1>

          {/* Description */}
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Empower your institution with a comprehensive SaaS solution for academic excellence.
            From multi-tenant management to student success tracking.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button
              size="lg"
              className="text-lg shadow-elegant hover:shadow-glow transition-all"
              onClick={() => navigate('/pricing')}
            >
              Request Access
            </Button>
            <Button size="lg" variant="outline" className="text-lg">
              Watch Demo
            </Button>
          </div>

          {/* Feature highlights */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-12">
            <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-card/50 backdrop-blur-sm border border-border/50 shadow-card">
              <GraduationCap className="w-8 h-8 text-primary" />
              <span className="font-semibold text-foreground">Multi-Tenant</span>
              <span className="text-sm text-muted-foreground">Architecture</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-card/50 backdrop-blur-sm border border-border/50 shadow-card">
              <Users className="w-8 h-8 text-primary" />
              <span className="font-semibold text-foreground">Role-Based</span>
              <span className="text-sm text-muted-foreground">Access Control</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-card/50 backdrop-blur-sm border border-border/50 shadow-card">
              <BookOpen className="w-8 h-8 text-primary" />
              <span className="font-semibold text-foreground">Course</span>
              <span className="text-sm text-muted-foreground">Management</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-card/50 backdrop-blur-sm border border-border/50 shadow-card">
              <Shield className="w-8 h-8 text-primary" />
              <span className="font-semibold text-foreground">Secure</span>
              <span className="text-sm text-muted-foreground">& Compliant</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
