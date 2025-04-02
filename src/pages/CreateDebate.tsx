
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import GenreSelection from "@/components/GenreSelection";
import { Button } from "@/components/ui/button";
import { Brain, LogOut, ArrowLeft } from "lucide-react";

const CreateDebate: React.FC = () => {
  const { currentUser, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  // If not authenticated, redirect to landing
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);
  
  const handleLogout = () => {
    logout();
    navigate("/");
  };
  
  const handleBack = () => {
    navigate("/dashboard");
  };
  
  if (!currentUser) {
    return null;
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Brain className="h-7 w-7 text-debate-navy" />
            <span className="font-heading text-xl font-bold">Debate Arena</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium hidden md:inline-block">
              Welcome, {currentUser.username}
            </span>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut size={16} className="mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" onClick={handleBack}>
              <ArrowLeft size={20} />
            </Button>
            <h1 className="text-2xl font-bold">Create New Debate</h1>
          </div>
          
          <GenreSelection />
        </div>
      </main>
      
      <footer className="bg-gray-100 py-4 mt-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Debate Arena. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default CreateDebate;
