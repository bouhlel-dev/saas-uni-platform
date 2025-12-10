import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ShieldAlert } from "lucide-react";

const Unauthorized = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
            <div className="text-center space-y-6 max-w-md">
                <div className="flex justify-center">
                    <div className="bg-red-100 p-4 rounded-full">
                        <ShieldAlert className="w-12 h-12 text-red-600" />
                    </div>
                </div>

                <h1 className="text-3xl font-bold text-gray-900">Access Denied</h1>

                <p className="text-gray-600">
                    You do not have permission to access this page. Please contact your administrator if you believe this is a mistake.
                </p>

                <div className="flex gap-4 justify-center">
                    <Button variant="outline" onClick={() => navigate(-1)}>
                        Go Back
                    </Button>
                    <Button onClick={() => navigate("/")}>
                        Go Home
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Unauthorized;
