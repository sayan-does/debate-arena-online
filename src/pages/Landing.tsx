
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import AuthForm from "@/components/AuthForm";
import { Button } from "@/components/ui/button";
import { ArrowRight, Brain, Shield, Zap } from "lucide-react";

const Landing: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  // If already authenticated, redirect to dashboard
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);
  
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Brain className="h-8 w-8 text-debate-navy" />
            <span className="font-heading text-xl font-bold">Debate Arena</span>
          </div>
          {isAuthenticated && (
            <Button onClick={() => navigate("/dashboard")} className="debate-button-primary">
              Go to Dashboard
            </Button>
          )}
        </div>
      </header>
      
      <main className="flex-1">
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6 flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0 md:pr-8">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 font-heading tracking-tight">
                Challenge Your <span className="text-debate-navy">Intellect</span>, Sharpen Your <span className="text-debate-red">Arguments</span>
              </h1>
              <p className="text-lg mb-6">
                Join Debate Arena and engage in structured debates on various topics. 
                Test your reasoning, improve your persuasion skills, and climb the rankings.
              </p>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Shield className="h-6 w-6 text-debate-navy shrink-0 mt-1" />
                  <div>
                    <h3 className="font-medium">Structured Format</h3>
                    <p className="text-muted-foreground">
                      Five rounds of carefully evaluated arguments with fair scoring
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Zap className="h-6 w-6 text-debate-red shrink-0 mt-1" />
                  <div>
                    <h3 className="font-medium">Diverse Topics</h3>
                    <p className="text-muted-foreground">
                      Debate on sports, philosophy, cinema, music, geopolitics and more
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Users className="h-6 w-6 text-debate-navy shrink-0 mt-1" />
                  <div>
                    <h3 className="font-medium">Competitive Rankings</h3>
                    <p className="text-muted-foreground">
                      Track your progress, improve your skills, and climb the leaderboard
                    </p>
                  </div>
                </div>
              </div>
              <div className="hidden md:block mt-8">
                <Button 
                  onClick={() => document.getElementById("auth-section")?.scrollIntoView({ behavior: "smooth" })}
                  className="debate-button-primary"
                >
                  Get Started <ArrowRight size={16} className="ml-2" />
                </Button>
              </div>
            </div>
            <div className="md:w-1/2">
              <div 
                id="auth-section" 
                className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 md:ml-auto"
              >
                <AuthForm />
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="bg-gray-100 py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Debate Arena. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
