import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GraduationCap, Loader2 } from "lucide-react";
import { authUtils } from "@/lib/auth";


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirmPassword, setSignupConfirmPassword] = useState("");
  const [signupRole, setSignupRole] = useState("student");
  const [signupUniversity, setSignupUniversity] = useState(null);
  const [universitySearch, setUniversitySearch] = useState("");
  const [universities, setUniversities] = useState([]);
  const [showUniversities, setShowUniversities] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");

  const [activeTab, setActiveTab] = useState("login");

  const showToast = (title, description, variant = "default") => {
    // Create toast notification element
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

  const searchUniversities = async (query) => {
    if (!query || query.trim().length < 2) {
      setUniversities([]);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/universities/search?q=${encodeURIComponent(query)}`);
      const data = await response.json();
      setUniversities(data);
    } catch (error) {
      console.error('Error searching universities:', error);
      setUniversities([]);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      // Store token and user info using auth utils
      authUtils.setToken(data.token);
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      showToast("Login Successful", "Welcome back!");

      // Navigate based on user role
      const userRole = data.user?.role || "student";

      // Redirect to appropriate dashboard
      setTimeout(() => {
        switch (userRole) {
          case "superadmin":
          case "super_admin": // Fallback
            window.location.href = "/dashboard/super-admin";
            break;
          case "admin":
          case "university_admin": // Fallback
          case "universityadmin":
            window.location.href = "/dashboard/university-admin";
            break;
          case "teacher":
          case "instructor":
            window.location.href = "/dashboard/teacher";
            break;
          case "student":
          default:
            window.location.href = "/dashboard/student";
            break;
        }
      }, 1000);

    } catch (error) {
      showToast("Login Failed", error.message || "Invalid credentials. Please try again.", "destructive");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (signupPassword !== signupConfirmPassword) {
      showToast("Password Mismatch", "Passwords do not match. Please try again.", "destructive");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: signupName,
          email: signupEmail,
          password: signupPassword,
          role: signupRole,
          university_id: signupUniversity?.id
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      showToast("Account Created", "Please check your email to verify your account.");

      // Optionally auto-login if token is returned
      if (data.token) {
        authUtils.setToken(data.token);
        if (data.user) {
          localStorage.setItem("user", JSON.stringify(data.user));

          // Auto-redirect after signup
          setTimeout(() => {
            window.location.href = "/dashboard/student";
          }, 2000);
        }
      } else {
        // Clear form fields if no auto-login
        setSignupName("");
        setSignupEmail("");
        setSignupPassword("");
        setSignupConfirmPassword("");
      }

    } catch (error) {
      showToast("Registration Failed", error.message || "Could not create account. Please try again.", "destructive");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: forgotEmail }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to send reset email");
      }

      showToast("Reset Email Sent", "Please check your email for password reset instructions.");
      setShowForgotPassword(false);
      setForgotEmail("");

    } catch (error) {
      showToast("Failed to Send Email", error.message || "Could not send reset email. Please try again.", "destructive");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative">
      <Button
        variant="ghost"
        className="absolute top-4 left-4 flex items-center gap-2"
        onClick={() => window.location.href = "/"}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-4 h-4"
        >
          <path d="m15 18-6-6 6-6" />
        </svg>
        Back to Home
      </Button>
      <div className={`w-full transition-all duration-300 ${activeTab === 'signup' ? 'max-w-4xl' : 'max-w-md'}`}>
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg">
            <GraduationCap className="w-7 h-7 text-white" />
          </div>
          <span className="text-2xl font-bold text-foreground">EduManage</span>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Welcome</CardTitle>
            <CardDescription>
              {showForgotPassword
                ? "Enter your email to reset your password"
                : "Sign in to your account or create a new one"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {showForgotPassword ? (
              <div className="space-y-4 max-w-md mx-auto">
                <div className="space-y-2">
                  <Label htmlFor="forgot-email">Email</Label>
                  <Input
                    id="forgot-email"
                    type="email"
                    placeholder="you@example.com"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      setShowForgotPassword(false);
                      setForgotEmail("");
                    }}
                    disabled={isLoading}
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handleForgotPassword}
                    className="w-full"
                    disabled={isLoading || !forgotEmail}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      "Send Reset Link"
                    )}
                  </Button>
                </div>
              </div>
            ) : (
              <Tabs defaultValue="login" className="w-full" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto mb-6">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>

                <TabsContent value="login">
                  <div className="space-y-4 max-w-md mx-auto">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="password">Password</Label>
                        <button
                          type="button"
                          onClick={() => setShowForgotPassword(true)}
                          className="text-sm text-blue-600 hover:underline"
                        >
                          Forgot password?
                        </button>
                      </div>
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        required
                      />
                    </div>
                    <Button
                      onClick={handleLogin}
                      className="w-full"
                      disabled={isLoading || !loginEmail || !loginPassword}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Signing in...
                        </>
                      ) : (
                        "Sign In"
                      )}
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="signup">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="signup-name">Full Name</Label>
                        <Input
                          id="signup-name"
                          type="text"
                          placeholder="John Doe"
                          value={signupName}
                          onChange={(e) => setSignupName(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signup-email">Email</Label>
                        <Input
                          id="signup-email"
                          type="email"
                          placeholder="you@example.com"
                          value={signupEmail}
                          onChange={(e) => setSignupEmail(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signup-password">Password</Label>
                        <Input
                          id="signup-password"
                          type="password"
                          placeholder="••••••••"
                          value={signupPassword}
                          onChange={(e) => setSignupPassword(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signup-confirm-password">Confirm Password</Label>
                        <Input
                          id="signup-confirm-password"
                          type="password"
                          placeholder="••••••••"
                          value={signupConfirmPassword}
                          onChange={(e) => setSignupConfirmPassword(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>I am a</Label>
                        <div className="flex gap-4">
                          <label className={`flex-1 flex items-center justify-center p-3 rounded-lg border cursor-pointer transition-all ${signupRole === 'student' ? 'border-blue-500 bg-blue-50 text-blue-700 font-medium ring-2 ring-blue-200' : 'border-gray-200 hover:border-gray-300'}`}>
                            <input
                              type="radio"
                              name="role"
                              value="student"
                              checked={signupRole === 'student'}
                              onChange={(e) => setSignupRole(e.target.value)}
                              className="sr-only"
                            />
                            Student
                          </label>
                          <label className={`flex-1 flex items-center justify-center p-3 rounded-lg border cursor-pointer transition-all ${signupRole === 'teacher' ? 'border-blue-500 bg-blue-50 text-blue-700 font-medium ring-2 ring-blue-200' : 'border-gray-200 hover:border-gray-300'}`}>
                            <input
                              type="radio"
                              name="role"
                              value="teacher"
                              checked={signupRole === 'teacher'}
                              onChange={(e) => setSignupRole(e.target.value)}
                              className="sr-only"
                            />
                            Teacher
                          </label>
                        </div>
                      </div>

                      <div className="space-y-2 relative">
                        <Label htmlFor="signup-university">University</Label>
                        <Input
                          id="signup-university"
                          type="text"
                          placeholder="Search for your university..."
                          value={universitySearch}
                          onChange={(e) => {
                            setUniversitySearch(e.target.value);
                            searchUniversities(e.target.value);
                            setShowUniversities(true);
                          }}
                          onFocus={() => setShowUniversities(true)}
                          required
                        />
                        {signupUniversity && (
                          <div className="mt-1 text-sm text-green-600">
                            ✓ {signupUniversity.name} ({signupUniversity.country})
                          </div>
                        )}
                        {showUniversities && universities.length > 0 && (
                          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                            {universities.map((uni) => (
                              <div
                                key={uni.id}
                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                onClick={() => {
                                  setSignupUniversity(uni);
                                  setUniversitySearch(uni.name);
                                  setShowUniversities(false);
                                }}
                              >
                                <div className="font-medium">{uni.name}</div>
                                <div className="text-sm text-gray-500">{uni.country}</div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={handleSignup}
                    className="w-full mt-6"
                    disabled={isLoading || !signupName || !signupEmail || !signupPassword || !signupConfirmPassword || !signupUniversity}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating account...
                      </>
                    ) : (
                      "Create Account"
                    )}
                  </Button>
                </TabsContent>
              </Tabs>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;