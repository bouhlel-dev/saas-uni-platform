import { ReactNode, useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { GraduationCap, LogOut, Loader2, Menu } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

interface DashboardLayoutProps {
  children: ReactNode;
  sidebar: ReactNode;
  title: string;
}

export const DashboardLayout = ({ children, sidebar, title }: DashboardLayoutProps) => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const showToast = (title: string, description: string, variant: "default" | "destructive" = "default") => {
    const toast = document.createElement('div');
    toast.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg max-w-md z-50 ${variant === 'destructive'
        ? 'bg-red-600 text-white'
        : 'bg-white text-gray-900 border border-gray-200'
      }`;
    toast.innerHTML = `
      <div class="font-semibold mb-1">${title}</div>
      <div class="text-sm ${variant === 'destructive' ? 'text-red-100' : 'text-gray-600'}">${description}</div>
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 4000);
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        localStorage.clear();
        window.location.href = "/auth";
        return;
      }

      const response = await fetch(`${API_BASE_URL}/auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Logout failed");
      }

      showToast("Logged Out", "You have been successfully logged out.");

      setTimeout(() => {
        window.location.href = "/auth";
      }, 1000);

    } catch (error) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      showToast(
        "Logged Out",
        "You have been logged out locally.",
        "destructive"
      );

      setTimeout(() => {
        window.location.href = "/auth";
      }, 1000);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-sm dark:bg-background/95 dark:border-border">
        <div className="container flex h-16 items-center px-4 mx-auto">
          <div className="flex items-center gap-2 mr-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden mr-2">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0">
                <div className="p-4 border-b">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center shadow">
                      <GraduationCap className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-lg font-bold text-gray-800 dark:text-foreground">EduManage</span>
                  </div>
                </div>
                <div className="p-4">
                  {sidebar}
                </div>
              </SheetContent>
            </Sheet>

            <div className="hidden md:flex w-8 h-8 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 items-center justify-center shadow">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="hidden md:block text-lg font-bold text-gray-800 dark:text-foreground">EduManage</span>
          </div>

          <div className="flex-1">
            <h1 className="text-lg font-semibold text-gray-700 dark:text-foreground">{title}</h1>
          </div>

          <div className="flex items-center gap-2">
            <ModeToggle />
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20"
            >
              {isLoggingOut ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Logging out...
                </>
              ) : (
                <>
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </>
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden lg:block w-64 border-r bg-white min-h-[calc(100vh-4rem)] shadow-sm dark:bg-card dark:border-border">
          <div className="p-4">
            {sidebar}
          </div>
        </aside>

        {/* Page Content */}
        <main className="flex-1 p-6 animate-in fade-in zoom-in-95 duration-300">
          {children}
        </main>
      </div>
    </div>
  );
};