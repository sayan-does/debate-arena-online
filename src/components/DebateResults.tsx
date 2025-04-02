
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api, RoomStatus, Argument } from "@/services/api";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Trophy, ArrowLeft, BarChart2 } from "lucide-react";
import { toast } from "sonner";

const DebateResults: React.FC = () => {
  const { roomKey } = useParams<{ roomKey: string }>();
  const navigate = useNavigate();
  
  const [roomStatus, setRoomStatus] = useState<RoomStatus | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Group arguments by round
  const argumentsByRound = roomStatus?.arguments.reduce<Record<number, Argument[]>>((acc, arg) => {
    if (!acc[arg.round]) {
      acc[arg.round] = [];
    }
    acc[arg.round].push(arg);
    return acc;
  }, {}) || {};
  
  // Check if the debate was aborted
  const wasAborted = roomStatus?.room.status === "aborted";
  
  // Fetch room status
  useEffect(() => {
    const fetchRoomStatus = async () => {
      if (!roomKey) return;
      
      try {
        setLoading(true);
        const status = await api.getRoomStatus(roomKey);
        setRoomStatus(status);
        
        // If debate is not over, navigate to room
        if (status.room.status !== "completed" && status.room.status !== "aborted") {
          navigate(`/room/${roomKey}`);
        }
      } catch (error) {
        toast.error("Failed to load debate results");
      } finally {
        setLoading(false);
      }
    };
    
    fetchRoomStatus();
  }, [roomKey, navigate]);
  
  const handleBackToDashboard = () => {
    navigate("/dashboard");
  };
  
  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-[100px] w-full rounded-lg" />
        <Skeleton className="h-[400px] w-full rounded-lg" />
        <Skeleton className="h-[100px] w-full rounded-lg" />
      </div>
    );
  }
  
  if (!roomStatus) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Results Not Found</CardTitle>
          <CardDescription>
            The debate results you're looking for don't exist or have been removed.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button onClick={handleBackToDashboard} className="debate-button-primary">
            Return to Dashboard
          </Button>
        </CardFooter>
      </Card>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="icon" onClick={handleBackToDashboard}>
          <ArrowLeft size={20} />
        </Button>
        <h2 className="text-2xl font-bold">Debate Results</h2>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>{roomStatus.topic.title}</CardTitle>
          <CardDescription>{roomStatus.topic.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Result Summary */}
          <div className={`p-6 rounded-lg ${wasAborted ? 'bg-red-50' : 'bg-blue-50'}`}>
            {wasAborted ? (
              <div className="text-center space-y-2">
                <Badge variant="destructive">Debate Aborted</Badge>
                <p className="text-lg font-medium">
                  This debate was aborted before completion
                </p>
                <p className="text-sm text-muted-foreground">
                  A 30-point penalty has been applied to the player who aborted
                </p>
              </div>
            ) : (
              <div className="text-center space-y-4">
                <div className="animate-celebration">
                  <Trophy size={48} className="mx-auto text-yellow-500" />
                </div>
                <h3 className="text-xl font-bold">
                  {roomStatus.winner} Wins!
                </h3>
                <div className="flex justify-center space-x-8">
                  <div className="text-center">
                    <p className="text-sm font-medium">{roomStatus.room.player1}</p>
                    <p className="text-2xl font-bold">{roomStatus.scores.player1}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium">{roomStatus.room.player2}</p>
                    <p className="text-2xl font-bold">{roomStatus.scores.player2}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Score Comparison */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold flex items-center">
              <BarChart2 size={20} className="mr-2" />
              Score Breakdown
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium">{roomStatus.room.player1}</span>
                  <span>{roomStatus.scores.player1} points</span>
                </div>
                <Progress value={(roomStatus.scores.player1 / Math.max(roomStatus.scores.player1, roomStatus.scores.player2, 100)) * 100} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium">{roomStatus.room.player2}</span>
                  <span>{roomStatus.scores.player2} points</span>
                </div>
                <Progress value={(roomStatus.scores.player2 / Math.max(roomStatus.scores.player1, roomStatus.scores.player2, 100)) * 100} className="h-2" />
              </div>
            </div>
          </div>
          
          <Separator />
          
          {/* Round-by-round breakdown */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Round-by-Round Arguments</h3>
            
            {Object.entries(argumentsByRound).map(([round, args]) => (
              <div key={round} className="space-y-3">
                <h4 className="text-md font-medium">Round {round}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {args.map((arg, index) => (
                    <div
                      key={`${arg.player}-${arg.round}-${index}`}
                      className="argument-area border"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">{arg.player}</span>
                        {arg.score !== null && (
                          <Badge variant="outline">Score: {arg.score}</Badge>
                        )}
                      </div>
                      <p className="text-sm whitespace-pre-wrap">{arg.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleBackToDashboard} className="w-full debate-button-primary">
            Return to Dashboard
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default DebateResults;
