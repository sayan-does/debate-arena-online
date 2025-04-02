
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import AuthForm from "@/components/AuthForm";
import { Button } from "@/components/ui/button";
import { Brain, ArrowRight, UserPlus } from "lucide-react";

const Landing: React.FC = () => {
  const [showAuthForm, setShowAuthForm] = useState(false);
  const [authType, setAuthType] = useState<"login" | "register">("login");
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // If already authenticated, redirect to dashboard
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const handleShowLogin = () => {
    setAuthType("login");
    setShowAuthForm(true);
  };

  const handleShowRegister = () => {
    setAuthType("register");
    setShowAuthForm(true);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Brain className="h-7 w-7 text-debate-navy" />
            <span className="font-heading text-xl font-bold">Debate Arena</span>
          </div>
          <div className="space-x-2">
            <Button variant="ghost" size="sm" onClick={handleShowLogin}>
              Login
            </Button>
            <Button size="sm" onClick={handleShowRegister}>
              Sign Up
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="container mx-auto px-4 py-12 md:py-24">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="md:w-1/2 space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                Sharpen Your Mind Through Structured Debates
              </h1>
              <p className="text-lg text-muted-foreground">
                Join intellectual battles on various topics. Create or join debate rooms, 
                present your arguments, and improve your persuasion skills.
              </p>
              <div className="flex space-x-4">
                <Button size="lg" onClick={handleShowRegister} className="debate-button-primary">
                  <UserPlus className="mr-2 h-5 w-5" />
                  Get Started
                </Button>
                <Button variant="outline" size="lg" onClick={handleShowLogin}>
                  <ArrowRight className="mr-2 h-5 w-5" />
                  I Already Have an Account
                </Button>
              </div>
            </div>
            <div className="md:w-1/2">
              {showAuthForm ? (
                <AuthForm type={authType} onClose={() => setShowAuthForm(false)} />
              ) : (
                <div className="bg-muted rounded-lg p-8 text-center">
                  <Brain className="h-16 w-16 mx-auto mb-4 text-debate-navy" />
                  <h2 className="text-2xl font-bold mb-2">Welcome to Debate Arena</h2>
                  <p className="text-muted-foreground">
                    Login or create an account to start debating
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-gray-100 py-4">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Debate Arena. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
