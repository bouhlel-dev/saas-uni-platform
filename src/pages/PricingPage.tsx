import { Navbar } from "@/components/Navbar";
import { PricingPlans } from "@/components/PricingPlans";
import { Footer } from "@/components/Footer";
import { useNavigate } from "react-router-dom";

const PricingPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <div className="pt-20"> {/* Add padding for fixed navbar if needed */}
                <PricingPlans onClose={() => navigate('/')} />
            </div>
            <Footer />
        </div>
    );
};

export default PricingPage;
