
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { api, PlayerStats } from "@/services/api";
import ProfileStats from "@/components/ProfileStats";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Brain, LogOut, ArrowLeft } from "lucide-react";

const ProfilePage: React.FC = () => {
  const { username } = useParams<{ username: string }>();
  const { currentUser, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [playerStats, setPlayerStats] = useState<PlayerStats | null>(null);
  const [loading, setLoading] = useState(true);
  
  // If not authenticated, redirect to landing
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);
  
  // Fetch player stats
  useEffect(() => {
    const fetchPlayerStats = async () => {
      if (!username) return;
      
      try {
        setLoading(true);
        const stats = await api.getPlayerStats(username);
        setPlayerStats(stats);
      } catch (error) {
        toast.error("Failed to load player profile");
      } finally {
        setLoading(false);
      }
    };
    
    fetchPlayerStats();
  }, [username]);
  
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
            <h1 className="text-2xl font-bold">Player Profile</h1>
          </div>
          
          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-[200px] w-full rounded-lg" />
              <Skeleton className="h-[300px] w-full rounded-lg" />
            </div>
          ) : (
            playerStats ? (
              <ProfileStats stats={playerStats} />
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Player not found</p>
                <Button
                  onClick={handleBack}
                  className="mt-4 debate-button-primary"
                >
                  Return to Dashboard
                </Button>
              </div>
            )
          )}
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

export default ProfilePage;
