
import React from "react";
import { useNavigate } from "react-router-dom";
import { Player } from "@/services/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Trophy, Users, AlertCircle } from "lucide-react";

interface PlayerStatsProps {
  player: Player;
}

const PlayerStats: React.FC<PlayerStatsProps> = ({ player }) => {
  const navigate = useNavigate();
  
  const totalDebates = player.wins + player.losses;
  const winRate = totalDebates > 0 ? (player.wins / totalDebates) * 100 : 0;
  
  const handleViewProfile = () => {
    navigate(`/profile/${player.username}`);
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle>Your Stats</CardTitle>
          <Button variant="ghost" size="sm" onClick={handleViewProfile}>
            View Profile
          </Button>
        </div>
        <CardDescription>
          Debate performance overview
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            <div>
              <p className="text-sm font-medium">Wins</p>
              <p className="text-2xl font-bold">{player.wins}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <div>
              <p className="text-sm font-medium">Losses</p>
              <p className="text-2xl font-bold">{player.losses}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-blue-500" />
            <div>
              <p className="text-sm font-medium">Ranking</p>
              <p className="text-2xl font-bold">#{player.ranking}</p>
            </div>
          </div>
        </div>
        
        <div className="mt-4 space-y-3">
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium">Win Rate</span>
              <span className="text-sm font-medium">{winRate.toFixed(1)}%</span>
            </div>
            <Progress value={winRate} className="h-2" />
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium">Total Score</span>
              <span className="text-sm font-medium">{player.total_score} pts</span>
            </div>
            <Progress value={Math.min(100, (player.total_score / 1000) * 100)} className="h-2" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PlayerStats;
