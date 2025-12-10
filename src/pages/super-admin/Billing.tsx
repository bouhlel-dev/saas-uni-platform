import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DollarSign, TrendingUp, CreditCard, Building2, Download } from "lucide-react";
import { NavLink } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

const Billing = () => {
  const [stats, setStats] = useState({
    totalRevenue: "$0",
    activeSubscriptions: 0,
    mrr: "$0",
    payingUniversities: 0
  });
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBilling = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/super-admin/billing`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setStats(data.stats);
          setTransactions(data.transactions);
        } else {
          console.error('Failed to fetch billing data:', response.status, response.statusText);
          toast({
            title: "Error",
            description: `Failed to load billing data: ${response.statusText}`,
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error('Error fetching billing data:', error);
        toast({
          title: "Error",
          description: "Failed to load billing data",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBilling();
  }, []);

  const sidebarContent = (
    <nav className="space-y-2">
      <NavLink to="/dashboard/super-admin" className="block px-3 py-2 rounded-md hover:bg-muted">
        Overview
      </NavLink>
      <NavLink to="/dashboard/super-admin/universities" className="block px-3 py-2 rounded-md hover:bg-muted">
        Universities
      </NavLink>
      <NavLink to="/dashboard/super-admin/applications" className="block px-3 py-2 rounded-md hover:bg-muted">
        Applications
      </NavLink>
      <NavLink to="/dashboard/super-admin/billing" className="block px-3 py-2 rounded-md bg-primary/10 text-primary font-medium">
        Billing
      </NavLink>
      <NavLink to="/dashboard/super-admin/settings" className="block px-3 py-2 rounded-md hover:bg-muted">
        Settings
      </NavLink>
    </nav>
  );

  const statCards = [
    { title: "Total Revenue", value: stats.totalRevenue, change: "+23%", icon: DollarSign },
    { title: "Active Subscriptions", value: stats.activeSubscriptions.toString(), change: "+12", icon: CreditCard },
    { title: "MRR", value: stats.mrr, change: "+18%", icon: TrendingUp },
    { title: "Paying Universities", value: stats.payingUniversities.toString(), change: "+12", icon: Building2 },
  ];

  if (loading) {
    return (
      <DashboardLayout sidebar={sidebarContent} title="Billing & Revenue">
        <div className="flex items-center justify-center h-full">
          <p>Loading billing data...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout sidebar={sidebarContent} title="Billing & Revenue">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Billing Overview</h2>
            <p className="text-muted-foreground">Track revenue and subscription payments</p>
          </div>
          <Button onClick={() => toast({ title: "Report Exported", description: "Downloading billing report..." })}>
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {statCards.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3" />
                  {stat.change} from last month
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Revenue Chart Placeholder */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
            <CardDescription>Monthly recurring revenue over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center border-2 border-dashed rounded-lg">
              <p className="text-muted-foreground">Revenue chart visualization</p>
            </div>
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Latest subscription payments from universities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {transactions.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center">
                      <DollarSign className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium">{tx.university}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">{tx.id}</Badge>
                        <span className="text-xs text-muted-foreground">{tx.date}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant="secondary">{tx.plan}</Badge>
                    <div className="text-right">
                      <p className="font-bold text-lg">{tx.amount}</p>
                      <Badge variant={tx.status === "Paid" ? "default" : "secondary"} className="text-xs">
                        {tx.status}
                      </Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toast({
                        title: "Invoice Downloaded",
                        description: `${tx.id} invoice downloaded successfully.`
                      })}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Billing;
