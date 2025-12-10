import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

interface RequestAccessDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    selectedPlan?: string;
}

export function RequestAccessDialog({ open, onOpenChange, selectedPlan }: RequestAccessDialogProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        institutionName: "",
        country: "",
        role: "",
        message: "",
        subscriptionPlan: selectedPlan || ""
    });

    useEffect(() => {
        if (selectedPlan) {
            setFormData(prev => ({ ...prev, subscriptionPlan: selectedPlan }));
        }
    }, [selectedPlan]);

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch(`${API_BASE_URL}/request-access`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to submit request');
            }

            setIsSuccess(true);
            toast({
                title: "Request Submitted",
                description: "We've received your request and will contact you soon.",
            });
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        onOpenChange(false);
        // Reset form after a delay to allow animation to finish
        setTimeout(() => {
            setIsSuccess(false);
            setFormData({
                name: "",
                email: "",
                institutionName: "",
                country: "",
                role: "",
                message: "",
                subscriptionPlan: selectedPlan || ""
            });
        }, 300);
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Request Access</DialogTitle>
                    <DialogDescription>
                        Fill out the form below to request access for your institution.
                    </DialogDescription>
                    {selectedPlan && (
                        <div className="mt-2">
                            <Badge variant="secondary" className="text-sm">
                                Selected Plan: {selectedPlan}
                            </Badge>
                        </div>
                    )}
                </DialogHeader>

                {isSuccess ? (
                    <div className="py-10 text-center space-y-4">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                            <CheckCircle2 className="w-8 h-8 text-green-600" />
                        </div>
                        <h3 className="text-xl font-semibold">Request Received!</h3>
                        <p className="text-muted-foreground max-w-xs mx-auto">
                            Thank you for your interest. Our team will review your request and get back to you at <strong>{formData.email}</strong> shortly.
                        </p>
                        <Button onClick={handleClose} className="mt-4">
                            Close
                        </Button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4 py-2">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input
                                    id="name"
                                    placeholder="John Doe"
                                    value={formData.name}
                                    onChange={(e) => handleChange("name", e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Work Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="john@university.edu"
                                    value={formData.email}
                                    onChange={(e) => handleChange("email", e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="institution">Institution Name</Label>
                            <Input
                                id="institution"
                                placeholder="University of Technology"
                                value={formData.institutionName}
                                onChange={(e) => handleChange("institutionName", e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="country">Country</Label>
                            <Input
                                id="country"
                                placeholder="United States"
                                value={formData.country}
                                onChange={(e) => handleChange("country", e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="role">Your Role</Label>
                            <Select
                                value={formData.role}
                                onValueChange={(value) => handleChange("role", value)}
                                required
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select your role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="University Admin">University Administrator</SelectItem>
                                    <SelectItem value="Department Head">Department Head</SelectItem>
                                    <SelectItem value="IT Director">IT Director</SelectItem>
                                    <SelectItem value="Other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="message">Message (Optional)</Label>
                            <Textarea
                                id="message"
                                placeholder="Tell us about your institution's needs..."
                                value={formData.message}
                                onChange={(e) => handleChange("message", e.target.value)}
                                rows={3}
                            />
                        </div>

                        <div className="flex justify-end gap-3 pt-4">
                            <Button type="button" variant="outline" onClick={handleClose}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Submitting...
                                    </>
                                ) : (
                                    "Submit Request"
                                )}
                            </Button>
                        </div>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    );
}
