import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { RequestAccessDialog } from "@/components/RequestAccessDialog";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

interface PricingPlansProps {
    onClose?: () => void;
}

export const PricingPlans = ({ onClose }: PricingPlansProps) => {
    const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
    const [showRequestDialog, setShowRequestDialog] = useState(false);

    const [plans, setPlans] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/plans`);
                if (!response.ok) throw new Error('Failed to fetch plans');
                const data = await response.json();
                setPlans(data);
            } catch (error) {
                console.error('Error fetching plans:', error);
                // Fallback to static plans if API fails or for initial dev
                setPlans([
                    {
                        name: "Basic Plan",
                        price: "$299/mo",
                        description: "Perfect for small institutions",
                        features: ["Up to 1,000 students", "Basic Support", "Standard Analytics"],
                        popular: false
                    },
                    {
                        name: "Premium Plan",
                        price: "$999/mo",
                        description: "Ideal for growing universities",
                        features: ["Up to 10,000 students", "Priority Support", "Advanced Analytics", "Custom Branding"],
                        popular: true
                    },
                    {
                        name: "Enterprise Plan",
                        price: "$2,499/mo",
                        description: "For large institutions",
                        features: ["Unlimited students", "24/7 Dedicated Support", "Custom Integrations", "SLA"],
                        popular: false
                    }
                ]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPlans();
    }, []);

    const handleSelectPlan = (planName: string) => {
        setSelectedPlan(planName);
        setShowRequestDialog(true);
    };

    return (
        <>
            <section className="py-24 px-4 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
                <div className="container mx-auto max-w-7xl">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold mb-4">
                            Choose Your Plan
                        </h2>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Select the perfect plan for your institution. All plans include core features with flexible scaling options.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {plans.map((plan) => (
                            <Card
                                key={plan.name}
                                className={`relative ${plan.popular ? 'border-primary shadow-xl scale-105' : ''}`}
                            >
                                {plan.popular && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                        <Badge className="bg-gradient-primary text-white px-4 py-1">
                                            Most Popular
                                        </Badge>
                                    </div>
                                )}

                                <CardHeader>
                                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                                    <CardDescription>{plan.description}</CardDescription>
                                    <div className="mt-4">
                                        <span className="text-4xl font-bold">{plan.price}</span>
                                        {plan.price !== "Custom" && (
                                            <span className="text-muted-foreground ml-2">/{plan.period}</span>
                                        )}
                                    </div>
                                </CardHeader>

                                <CardContent>
                                    <ul className="space-y-3">
                                        {plan.features.map((feature, idx) => (
                                            <li key={idx} className="flex items-start gap-2">
                                                <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                                <span className="text-sm">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>

                                <CardFooter>
                                    <Button
                                        className="w-full"
                                        variant={plan.popular ? "default" : "outline"}
                                        onClick={() => handleSelectPlan(plan.name)}
                                    >
                                        Select {plan.name}
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>

                    {onClose && (
                        <div className="text-center mt-8">
                            <Button variant="ghost" onClick={onClose}>
                                Back to Home
                            </Button>
                        </div>
                    )}
                </div>
            </section>

            <RequestAccessDialog
                open={showRequestDialog}
                onOpenChange={setShowRequestDialog}
                selectedPlan={selectedPlan || undefined}
            />
        </>
    );
};
