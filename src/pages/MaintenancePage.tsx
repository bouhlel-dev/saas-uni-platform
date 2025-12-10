import { Button } from "@/components/ui/button";
import { Wrench } from "lucide-react";

export default function MaintenancePage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 text-center">
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                <Wrench className="w-12 h-12 text-primary" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Under Maintenance</h1>
            <p className="text-muted-foreground max-w-md mb-8">
                The platform is currently undergoing scheduled maintenance. We'll be back shortly. Thank you for your patience.
            </p>
            <Button onClick={() => window.location.reload()}>
                Check Again
            </Button>
        </div>
    );
}
