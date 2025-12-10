
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { NavLink } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";

const Settings = () => {
  const [settings, setSettings] = useState({
    platformName: "",
    supportEmail: "",
    maxUniversities: 0,
    autoApprove: false,
    emailNotifications: true,
    maintenanceMode: false,
    smtpHost: "",
    smtpPort: 587,
    smtpUser: "",
    smtpPassword: "",
    smtpSecure: false,
    smtpFromEmail: "",
    sessionTimeout: false,
    sessionDuration: 30
  });
  const [loading, setLoading] = useState(true);
  const [plans, setPlans] = useState<any[]>([]);
  const [editingPlan, setEditingPlan] = useState<any | null>(null);
  const [showPlanDialog, setShowPlanDialog] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await api.get('/super-admin/settings');
        setSettings(data);
      } catch (error) {
        console.error('Error fetching settings:', error);
        toast({
          title: "Error",
          description: "Failed to load settings",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    const fetchPlans = async () => {
      try {
        const data = await api.get('/plans/admin');
        setPlans(data);
      } catch (error) {
        console.error('Error fetching plans:', error);
      }
    };

    fetchSettings();
    fetchPlans();
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
      <NavLink to="/dashboard/super-admin/billing" className="block px-3 py-2 rounded-md hover:bg-muted">
        Billing
      </NavLink>
      <NavLink to="/dashboard/super-admin/settings" className="block px-3 py-2 rounded-md bg-primary/10 text-primary font-medium">
        Settings
      </NavLink>
    </nav>
  );

  const handleSave = async () => {
    try {
      await api.post('/super-admin/settings', settings);

      toast({
        title: "Settings Saved",
        description: "Your platform settings have been updated.",
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive"
      });
    }
  };

  const handleChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  if (loading) {
    return (
      <DashboardLayout sidebar={sidebarContent} title="Platform Settings">
        <div className="flex items-center justify-center h-full">
          <p>Loading settings...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout sidebar={sidebarContent} title="Platform Settings">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Platform Settings</h2>
          <p className="text-muted-foreground">Manage global platform configuration</p>
        </div>

        <Tabs defaultValue="general" className="space-y-4">
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="email">Email</TabsTrigger>
            <TabsTrigger value="plans">Subscription Plans</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Platform Information</CardTitle>
                <CardDescription>Basic platform configuration</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="platform-name">Platform Name</Label>
                  <Input
                    id="platform-name"
                    value={settings.platformName}
                    onChange={(e) => handleChange('platformName', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="support-email">Support Email</Label>
                  <Input
                    id="support-email"
                    type="email"
                    value={settings.supportEmail}
                    onChange={(e) => handleChange('supportEmail', e.target.value)}
                  />
                </div>

                <Button onClick={handleSave}>Save Changes</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Feature Toggles</CardTitle>
                <CardDescription>Enable or disable platform features</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Auto-approve Applications</p>
                    <p className="text-sm text-muted-foreground">Automatically approve new university applications</p>
                  </div>
                  <Switch
                    checked={settings.autoApprove}
                    onCheckedChange={async (checked) => {
                      handleChange('autoApprove', checked);
                      // Auto-save when toggle changes
                      try {
                        await api.post('/super-admin/settings', { ...settings, autoApprove: checked });
                        toast({
                          title: "Settings Updated",
                          description: `Auto-approve ${checked ? 'enabled' : 'disabled'}`,
                        });
                      } catch (error) {
                        console.error('Error saving settings:', error);
                        toast({
                          title: "Error",
                          description: "Failed to save settings",
                          variant: "destructive"
                        });
                      }
                    }}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Email Notifications</p>
                    <p className="text-sm text-muted-foreground">Send email notifications for important events</p>
                  </div>
                  <Switch
                    checked={settings.emailNotifications}
                    onCheckedChange={async (checked) => {
                      handleChange('emailNotifications', checked);
                      // Auto-save when toggle changes
                      try {
                        await api.post('/super-admin/settings', { ...settings, emailNotifications: checked });
                        toast({
                          title: "Settings Updated",
                          description: `Email notifications ${checked ? 'enabled' : 'disabled'}`,
                        });
                      } catch (error) {
                        console.error('Error saving settings:', error);
                        toast({
                          title: "Error",
                          description: "Failed to save settings",
                          variant: "destructive"
                        });
                      }
                    }}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Maintenance Mode</p>
                    <p className="text-sm text-muted-foreground">Put platform in maintenance mode</p>
                  </div>
                  <Switch
                    checked={settings.maintenanceMode}
                    onCheckedChange={async (checked) => {
                      handleChange('maintenanceMode', checked);
                      // Auto-save when toggle changes
                      try {
                        await api.post('/super-admin/settings', { ...settings, maintenanceMode: checked });
                        toast({
                          title: "Settings Updated",
                          description: `Maintenance mode ${checked ? 'enabled' : 'disabled'}`,
                        });
                      } catch (error) {
                        console.error('Error saving settings:', error);
                        toast({
                          title: "Error",
                          description: "Failed to save settings",
                          variant: "destructive"
                        });
                      }
                    }}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Configure platform security options</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Session Timeout</p>
                    <p className="text-sm text-muted-foreground">Auto-logout after inactivity</p>
                  </div>
                  <Switch
                    checked={settings.sessionTimeout}
                    onCheckedChange={async (checked) => {
                      handleChange('sessionTimeout', checked);
                      try {
                        await api.post('/super-admin/settings', { ...settings, sessionTimeout: checked });
                        toast({
                          title: "Settings Updated",
                          description: `Session timeout ${checked ? 'enabled' : 'disabled'}`,
                        });
                      } catch (error) {
                        console.error('Error saving settings:', error);
                        toast({
                          title: "Error",
                          description: "Failed to save settings",
                          variant: "destructive"
                        });
                      }
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="session-duration">Session Duration (minutes)</Label>
                  <Input
                    id="session-duration"
                    type="number"
                    value={settings.sessionDuration}
                    onChange={(e) => handleChange('sessionDuration', parseInt(e.target.value))}
                  />
                </div>
                <Button onClick={handleSave}>Save Changes</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="email" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Email Configuration</CardTitle>
                <CardDescription>Configure SMTP and email templates</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="smtp-host">SMTP Host</Label>
                  <Input
                    id="smtp-host"
                    placeholder="smtp.gmail.com"
                    value={settings.smtpHost || ''}
                    onChange={(e) => handleChange('smtpHost', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtp-port">SMTP Port</Label>
                  <Input
                    id="smtp-port"
                    type="number"
                    value={settings.smtpPort || 587}
                    onChange={(e) => handleChange('smtpPort', parseInt(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtp-user">SMTP Username</Label>
                  <Input
                    id="smtp-user"
                    value={settings.smtpUser || ''}
                    onChange={(e) => handleChange('smtpUser', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtp-password">SMTP Password</Label>
                  <Input
                    id="smtp-password"
                    type="password"
                    value={settings.smtpPassword || ''}
                    onChange={(e) => handleChange('smtpPassword', e.target.value)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="smtp-secure" className="font-medium">Secure Connection (SSL/TLS)</Label>
                    <p className="text-sm text-muted-foreground">Use true for port 465, false for other ports</p>
                  </div>
                  <Switch
                    id="smtp-secure"
                    checked={settings.smtpSecure || false}
                    onCheckedChange={(checked) => handleChange('smtpSecure', checked)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="from-email">From Email</Label>
                  <Input
                    id="from-email"
                    type="email"
                    value={settings.smtpFromEmail || ''}
                    onChange={(e) => handleChange('smtpFromEmail', e.target.value)}
                  />
                </div>
                <Button onClick={handleSave}>Save Configuration</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="plans" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Subscription Plans</CardTitle>
                <CardDescription>Manage pricing and plan features</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  {plans.map((plan) => (
                    <div key={plan.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-semibold">{plan.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {plan.max_students >= 999999 ? 'Unlimited' : `Up to ${plan.max_students.toLocaleString()}`} students
                          </p>
                        </div>
                        <p className="text-2xl font-bold">{plan.price}</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingPlan(plan);
                          setShowPlanDialog(true);
                        }}
                      >
                        Edit Plan
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Edit Plan Dialog */}
            {showPlanDialog && editingPlan && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                  <CardHeader>
                    <CardTitle>Edit {editingPlan.name}</CardTitle>
                    <CardDescription>Update plan details and features</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Plan Name</Label>
                      <Input
                        value={editingPlan.name}
                        onChange={(e) => setEditingPlan({ ...editingPlan, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Price</Label>
                      <Input
                        value={editingPlan.price}
                        onChange={(e) => setEditingPlan({ ...editingPlan, price: e.target.value })}
                        placeholder="$299/mo"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Max Students</Label>
                      <Input
                        type="number"
                        value={editingPlan.max_students}
                        onChange={(e) => setEditingPlan({ ...editingPlan, max_students: parseInt(e.target.value) })}
                      />
                      <p className="text-xs text-muted-foreground">Use 999999 for unlimited</p>
                    </div>
                    <div className="space-y-2">
                      <Label>Features (one per line)</Label>
                      <textarea
                        className="w-full min-h-[150px] p-2 border rounded-md bg-background text-foreground"
                        value={Array.isArray(editingPlan.features) ? editingPlan.features.join('\n') : ''}
                        onChange={(e) => setEditingPlan({ ...editingPlan, features: e.target.value.split('\n').filter(f => f.trim()) })}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={editingPlan.active}
                        onCheckedChange={(checked) => setEditingPlan({ ...editingPlan, active: checked })}
                      />
                      <Label>Active</Label>
                    </div>
                  </CardContent>
                  <div className="flex gap-2 p-6 pt-0">
                    <Button
                      onClick={async () => {
                        try {
                          await api.put(`/plans/${editingPlan.id}`, editingPlan);
                          toast({
                            title: "Plan Updated",
                            description: "Subscription plan has been updated successfully.",
                          });
                          setShowPlanDialog(false);
                          // Refresh plans
                          const data = await api.get('/plans/admin');
                          setPlans(data);
                        } catch (error) {
                          console.error('Error updating plan:', error);
                          toast({
                            title: "Error",
                            description: "Failed to update plan",
                            variant: "destructive"
                          });
                        }
                      }}
                    >
                      Save Changes
                    </Button>
                    <Button variant="outline" onClick={() => setShowPlanDialog(false)}>
                      Cancel
                    </Button>
                  </div>
                </Card>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
