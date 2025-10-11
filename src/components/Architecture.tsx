import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Server, Database, Lock, Zap, Cloud, Shield, Crown } from "lucide-react";

const architectureFeatures = [
  {
    icon: Server,
    title: "Multi-Tenant SaaS",
    description: "Isolated data for each university with shared infrastructure for optimal performance and cost efficiency."
  },
  {
    icon: Database,
    title: "Scalable Database",
    description: "PostgreSQL-powered architecture that grows with your needs, from single institution to nationwide deployment."
  },
  {
    icon: Lock,
    title: "Row-Level Security",
    description: "Advanced security policies ensure data isolation between tenants and role-based access control."
  },
  {
    icon: Zap,
    title: "High Performance",
    description: "Optimized queries and caching strategies deliver lightning-fast response times even under heavy load."
  },
  {
    icon: Cloud,
    title: "Cloud Infrastructure",
    description: "Deployed on reliable cloud infrastructure with automatic scaling and 99.9% uptime guarantee."
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "SOC 2 compliant with encryption at rest and in transit, regular security audits, and GDPR compliance."
  }
];

export const Architecture = () => {
  return (
    <section className="py-24 px-4 bg-gradient-hero">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            Enterprise-Grade
            <span className="block bg-gradient-primary bg-clip-text text-transparent">
              Architecture
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Built on modern cloud infrastructure with security and scalability at its core
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {architectureFeatures.map((feature, index) => (
            <Card 
              key={index}
              className="border-border/50 shadow-card hover:shadow-elegant transition-all duration-300 bg-card/50 backdrop-blur-sm"
            >
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Visual architecture diagram placeholder */}
        <div className="mt-16 p-8 rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 shadow-elegant">
          <div className="flex flex-col items-center gap-8">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-2">System Architecture</h3>
              <p className="text-muted-foreground">Hierarchical multi-tenant structure</p>
            </div>
            
            <div className="flex flex-col md:flex-row gap-6 items-center justify-center w-full">
              <Card className="w-48 shadow-card">
                <CardHeader className="text-center">
                  <Crown className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
                  <CardTitle className="text-sm">Super Admin</CardTitle>
                </CardHeader>
              </Card>
              
              <div className="text-2xl text-muted-foreground">→</div>
              
              <Card className="w-48 shadow-card">
                <CardHeader className="text-center">
                  <Server className="w-8 h-8 mx-auto mb-2 text-primary" />
                  <CardTitle className="text-sm">Universities</CardTitle>
                </CardHeader>
              </Card>
              
              <div className="text-2xl text-muted-foreground">→</div>
              
              <div className="flex flex-col gap-3">
                <Card className="w-48 shadow-card">
                  <CardHeader className="text-center p-3">
                    <CardTitle className="text-xs">Faculties</CardTitle>
                  </CardHeader>
                </Card>
                <Card className="w-48 shadow-card">
                  <CardHeader className="text-center p-3">
                    <CardTitle className="text-xs">Departments</CardTitle>
                  </CardHeader>
                </Card>
                <Card className="w-48 shadow-card">
                  <CardHeader className="text-center p-3">
                    <CardTitle className="text-xs">Courses</CardTitle>
                  </CardHeader>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
