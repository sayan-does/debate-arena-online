
import React from "react";
import { PlayerStats } from "@/services/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import DebateHistory from "./DebateHistory";
import { Trophy, Clock, AlertCircle, Users, TrendingUp, Award } from "lucide-react";

interface ProfileStatsProps {
  stats: PlayerStats;
}

const ProfileStats: React.FC<ProfileStatsProps> = ({ stats }) => {
  const { player, history } = stats;
  
  const totalDebates = player.wins + player.losses;
  const winRate = totalDebates > 0 ? (player.wins / totalDebates) * 100 : 0;
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{player.username}</CardTitle>
          <CardDescription>
            Player profile and statistics
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex flex-col items-center justify-center p-4 bg-blue-50 rounded-lg">
              <Trophy size={32} className="text-yellow-500 mb-2" />
              <p className="text-sm font-medium">Wins</p>
              <p className="text-2xl font-bold">{player.wins}</p>
            </div>
            
            <div className="flex flex-col items-center justify-center p-4 bg-red-50 rounded-lg">
              <AlertCircle size={32} className="text-red-500 mb-2" />
              <p className="text-sm font-medium">Losses</p>
              <p className="text-2xl font-bold">{player.losses}</p>
            </div>
            
            <div className="flex flex-col items-center justify-center p-4 bg-green-50 rounded-lg">
              <Award size={32} className="text-green-500 mb-2" />
              <p className="text-sm font-medium">Total Score</p>
              <p className="text-2xl font-bold">{player.total_score}</p>
            </div>
            
            <div className="flex flex-col items-center justify-center p-4 bg-purple-50 rounded-lg">
              <Users size={32} className="text-purple-500 mb-2" />
              <p className="text-sm font-medium">Ranking</p>
              <p className="text-2xl font-bold">#{player.ranking}</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <div className="flex items-center mb-2">
                <TrendingUp size={20} className="mr-2 text-blue-500" />
                <h3 className="text-lg font-semibold">Win Rate</h3>
              </div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium">Total debates: {totalDebates}</span>
                <span className="text-sm font-medium">{winRate.toFixed(1)}%</span>
              </div>
              <Progress value={winRate} className="h-2" />
            </div>
            
            <div>
              <div className="flex items-center mb-2">
                <Clock size={20} className="mr-2 text-blue-500" />
                <h3 className="text-lg font-semibold">Debate Activity</h3>
              </div>
              <div className="bg-muted p-4 rounded-lg">
                {totalDebates > 0 ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="h-4 w-4 rounded-full bg-debate-navy"></div>
                      <span>{player.wins} wins</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="h-4 w-4 rounded-full bg-debate-red"></div>
                      <span>{player.losses} losses</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="h-4 w-4 rounded-full bg-gray-400"></div>
                      <span>{history.filter(d => d.result === "aborted").length} aborted</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground">No debate activity yet</p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <DebateHistory history={history} />
    </div>
  );
};

export default ProfileStats;
