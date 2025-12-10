import { DashboardLayout } from "@/components/DashboardLayout";
import { UniversityAdminSidebar } from "@/components/UniversityAdminSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatDate } from "@/lib/formatUtils";
import { Check, CreditCard, Download, AlertCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";

const ManageSubscription = () => {
    const [loading, setLoading] = useState(true);
    const [subscription, setSubscription] = useState<any>(null);
    const [plans, setPlans] = useState<any[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [subData, plansData] = await Promise.all([
                    api.get('/admin/subscription'),
                    api.get('/admin/subscription-plans')
                ]);
                setSubscription(subData);

                // Transform plans data if needed, or use as is
                const formattedPlans = plansData.map((p: any) => ({
                    id: p.id,
                    name: p.name,
                    price: `$${p.price}`,
                    period: `/${p.duration_months === 1 ? 'month' : 'year'}`,
                    features: p.features || [],
                    current: subData?.plan === p.name
                }));
                setPlans(formattedPlans);
            } catch (error) {
                console.error('Error fetching subscription data:', error);
                toast({
                    title: "Error",
                    description: "Failed to load subscription details",
                    variant: "destructive"
                });
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleUpgrade = async (planId: number, planName: string) => {
        try {
            await api.post('/admin/subscription/upgrade', { plan_id: planId });
            toast({
                title: "Upgrade Successful",
                description: `Successfully upgraded to ${planName} plan.`,
            });
            // Refresh data
            window.location.reload();
        } catch (error) {
            toast({
                title: "Upgrade Failed",
                description: "Failed to process upgrade request",
                variant: "destructive"
            });
        }
    };

    const handlePrintReceipt = (invoiceId: string) => {
        toast({
            title: "Downloading Receipt",
            description: `Generating receipt for invoice #${invoiceId}...`,
        });
        // Simulate download
        setTimeout(() => {
            toast({
                title: "Download Complete",
                description: "Receipt has been saved to your device.",
            });
        }, 1500);
    };

    if (loading) {
        return (
            <DashboardLayout sidebar={<UniversityAdminSidebar />} title="Manage Subscription">
                <div className="flex items-center justify-center h-full">
                    <p>Loading subscription details...</p>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout sidebar={<UniversityAdminSidebar />} title="Manage Subscription">
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold">Subscription & Billing</h2>
                        <p className="text-muted-foreground">Manage your university's plan and billing information</p>
                    </div>
                </div>

                <Tabs defaultValue="overview" className="space-y-4">
                    <TabsList>
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="plans">Available Plans</TabsTrigger>
                        <TabsTrigger value="billing">Billing History</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Current Subscription</CardTitle>
                                <CardDescription>You are currently subscribed to the <span className="font-semibold text-primary">{subscription?.plan || 'Free'}</span> plan.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="p-4 border rounded-lg">
                                        <p className="text-sm text-muted-foreground mb-1">Status</p>
                                        <Badge variant="default" className="bg-green-500 hover:bg-green-600">{subscription?.status || 'Inactive'}</Badge>
                                    </div>
                                    <div className="p-4 border rounded-lg">
                                        <p className="text-sm text-muted-foreground mb-1">Next Renewal</p>
                                        <p className="font-medium">{subscription?.renewalDate || 'N/A'}</p>
                                    </div>
                                    <div className="p-4 border rounded-lg">
                                        <p className="text-sm text-muted-foreground mb-1">Amount</p>
                                        <p className="font-medium">{subscription?.amount || '$0.00'}</p>
                                    </div>
                                    <div className="p-4 border rounded-lg">
                                        <p className="text-sm text-muted-foreground mb-1">Payment Method</p>
                                        <div className="flex items-center gap-2">
                                            <CreditCard className="w-4 h-4" />
                                            <span>•••• 4242</span>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <p className="font-medium mb-2">Plan Features:</p>
                                    <ul className="grid gap-2 sm:grid-cols-2">
                                        {(subscription?.features || []).map((feature: string, idx: number) => (
                                            <li key={idx} className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <Check className="w-4 h-4 text-green-500" />
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button variant="outline" className="mr-2">Cancel Subscription</Button>
                                <Button onClick={() => document.getElementById('plans-trigger')?.click()}>Upgrade Plan</Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>

                    <TabsContent value="plans" className="space-y-4">
                        <div className="grid gap-6 md:grid-cols-3">
                            {plans.map((plan) => (
                                <Card key={plan.id} className={`flex flex-col ${plan.current ? 'border-primary shadow-lg' : ''}`}>
                                    <CardHeader>
                                        <CardTitle className="flex items-center justify-between">
                                            {plan.name}
                                            {plan.current && <Badge>Current</Badge>}
                                        </CardTitle>
                                        <div className="mt-2">
                                            <span className="text-3xl font-bold">{plan.price}</span>
                                            <span className="text-muted-foreground">{plan.period}</span>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="flex-1">
                                        <ul className="space-y-2">
                                            {plan.features.map((feature: string, idx: number) => (
                                                <li key={idx} className="flex items-center gap-2 text-sm">
                                                    <Check className="w-4 h-4 text-green-500" />
                                                    {feature}
                                                </li>
                                            ))}
                                        </ul>
                                    </CardContent>
                                    <CardFooter>
                                        {plan.current ? (
                                            <Button className="w-full" disabled>Current Plan</Button>
                                        ) : plan.contact ? (
                                            <Button className="w-full" variant="outline">Contact Sales</Button>
                                        ) : (
                                            <Button className="w-full" onClick={() => handleUpgrade(plan.id, plan.name)}>Upgrade</Button>
                                        )}
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="billing" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Billing History</CardTitle>
                                <CardDescription>View and download your past invoices.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                                            <div className="flex items-center gap-4">
                                                <div className="p-2 bg-primary/10 rounded-full">
                                                    <CreditCard className="w-4 h-4 text-primary" />
                                                </div>
                                                <div>
                                                    <p className="font-medium">Invoice #INV-2024-00{i}</p>
                                                    <p className="text-sm text-muted-foreground">Paid on {formatDate(new Date())}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <span className="font-medium">$499.00</span>
                                                <Button variant="ghost" size="sm" onClick={() => handlePrintReceipt(`INV-2024-00${i}`)}>
                                                    <Download className="w-4 h-4 mr-2" />
                                                    Receipt
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </DashboardLayout>
    );
};

export default ManageSubscription;
