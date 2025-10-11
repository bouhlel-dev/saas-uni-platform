import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

interface ApproveApplicationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  application: {
    name: string;
    country: string;
  };
}

export function ApproveApplicationDialog({ open, onOpenChange, application }: ApproveApplicationDialogProps) {
  const [plan, setPlan] = useState("enterprise");

  const handleApprove = () => {
    toast({
      title: "Application Approved",
      description: `${application.name} has been approved with ${plan} plan.`,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Approve University Application</DialogTitle>
          <DialogDescription>
            Set up the subscription plan for {application.name}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="university">University Name</Label>
            <Input id="university" value={application.name} disabled />
          </div>
          <div className="space-y-2">
            <Label htmlFor="plan">Subscription Plan</Label>
            <Select value={plan} onValueChange={setPlan}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="basic">Basic - $99/month</SelectItem>
                <SelectItem value="premium">Premium - $299/month</SelectItem>
                <SelectItem value="enterprise">Enterprise - $999/month</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Welcome Message (Optional)</Label>
            <Textarea 
              id="notes" 
              placeholder="Add a welcome message for the university admin..."
              rows={4}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleApprove}>Approve & Send Invitation</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
