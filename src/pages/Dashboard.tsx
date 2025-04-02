
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { api, PlayerStats as PlayerStatsType } from "@/services/api";
import PlayerStatsComponent from "@/components/PlayerStats";
import JoinRoom from "@/components/JoinRoom";
import DebateHistory from "@/components/DebateHistory";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Brain, LogOut, Plus } from "lucide-react";

const Dashboard: React.FC = () => {
  const { currentUser, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [playerStats, setPlayerStats] = useState<PlayerStatsType | null>(null);
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
      if (!currentUser) return;
      
      try {
        setLoading(true);
        const stats = await api.getPlayerStats(currentUser.username);
        setPlayerStats(stats);
      } catch (error) {
        toast.error("Failed to load player statistics");
      } finally {
        setLoading(false);
      }
    };
    
    fetchPlayerStats();
  }, [currentUser]);
  
  const handleCreateDebate = () => {
    navigate("/create");
  };
  
  const handleLogout = () => {
    logout();
    navigate("/");
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
        <div className="space-y-8">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          
          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-[200px] w-full rounded-lg" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Skeleton className="h-[200px] w-full rounded-lg" />
                <Skeleton className="h-[200px] w-full rounded-lg" />
              </div>
              <Skeleton className="h-[300px] w-full rounded-lg" />
            </div>
          ) : (
            <>
              {playerStats && <PlayerStatsComponent player={playerStats.player} />}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Start a New Debate</CardTitle>
                    <CardDescription>
                      Create a new debate room on a topic of your choice
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4 text-muted-foreground">
                      Choose from various genres and challenge other players to intellectual battles
                    </p>
                    <Button
                      onClick={handleCreateDebate}
                      className="w-full debate-button-primary"
                    >
                      <Plus size={16} className="mr-2" />
                      Create New Debate
                    </Button>
                  </CardContent>
                </Card>
                
                <JoinRoom />
              </div>
              
              {playerStats && <DebateHistory history={playerStats.history} />}
            </>
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

export default Dashboard;
