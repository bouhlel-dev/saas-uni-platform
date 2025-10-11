import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface ViewDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  details: Array<{ label: string; value: string | number; badge?: boolean }>;
}

export function ViewDetailsDialog({ open, onOpenChange, title, description, details }: ViewDetailsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <div className="space-y-4 py-4">
          {details.map((detail, idx) => (
            <div key={idx}>
              <div className="flex items-center justify-between py-3">
                <span className="text-sm text-muted-foreground">{detail.label}</span>
                {detail.badge ? (
                  <Badge variant="secondary">{detail.value}</Badge>
                ) : (
                  <span className="font-medium">{detail.value}</span>
                )}
              </div>
              {idx < details.length - 1 && <Separator />}
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
