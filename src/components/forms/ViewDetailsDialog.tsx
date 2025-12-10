import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { LucideIcon } from "lucide-react";

interface ViewDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  details: Array<{
    label: string;
    value: string | number;
    badge?: boolean;
    icon?: LucideIcon;
    variant?: "default" | "secondary" | "destructive" | "outline";
  }>;
}

export function ViewDetailsDialog({ open, onOpenChange, title, description, details }: ViewDetailsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader className="pb-4 border-b">
          <DialogTitle className="text-xl">{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <div className="grid gap-6 py-6">
          <div className="grid grid-cols-2 gap-4">
            {details.map((detail, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3 rounded-lg border bg-card text-card-foreground shadow-sm">
                {detail.icon && (
                  <div className="p-2 rounded-md bg-primary/10 text-primary">
                    <detail.icon className="w-4 h-4" />
                  </div>
                )}
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    {detail.label}
                  </p>
                  {detail.badge ? (
                    <Badge variant={detail.variant || "secondary"}>{detail.value}</Badge>
                  ) : (
                    <p className="font-semibold text-sm">{detail.value}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
