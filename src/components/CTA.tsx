import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { PricingPlans } from "@/components/PricingPlans";
import { Dialog, DialogContent } from "@/components/ui/dialog";

export const CTA = () => {
  const [showPricingDialog, setShowPricingDialog] = useState(false);

  return (
    <section className="py-24 px-4 bg-gradient-primary relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto max-w-5xl relative z-10">
        <div className="text-center space-y-8">
          <h2 className="text-4xl md:text-6xl font-bold text-white">
            Ready to Transform
            <span className="block">Your Institution?</span>
          </h2>

          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
            Join leading educational institutions already using our platform to streamline operations and enhance student success.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button
              size="lg"
              variant="secondary"
              className="text-lg shadow-elegant hover:shadow-glow"
              onClick={() => setShowPricingDialog(true)}
            >
              Apply for Access
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg bg-white/10 border-white/20 text-white hover:bg-white/20"
              onClick={() => window.location.href = '/auth'}
            >
              Schedule Demo
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 max-w-3xl mx-auto">
            {[
              "No setup fees",
              "Free trial period",
              "24/7 support"
            ].map((benefit, index) => (
              <div key={index} className="flex items-center gap-3 justify-center text-white/90">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                <span className="font-medium">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Dialog open={showPricingDialog} onOpenChange={setShowPricingDialog}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] overflow-y-auto p-0">
          <PricingPlans onClose={() => setShowPricingDialog(false)} />
        </DialogContent>
      </Dialog>
    </section>
  );
};
