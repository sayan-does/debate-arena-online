
import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api, RoomStatus, Argument } from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { ClipboardCopy, Send, AlertTriangle, Clock } from "lucide-react";

const ARGUMENT_MAX_LENGTH = 1000;
const REFRESH_INTERVAL = 5000;
const LOADING_STATES = ["loading", "submitting", "aborting"];

const DebateRoom: React.FC = () => {
  const { roomKey } = useParams<{ roomKey: string }>();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [roomStatus, setRoomStatus] = useState<RoomStatus | null>(null);
  const [argument, setArgument] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [aborting, setAborting] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const refreshIntervalRef = useRef<number | null>(null);
  const roomKeyRef = useRef(roomKey);
  
  // Check if current user is in the debate
  const isPlayerInRoom = currentUser && roomStatus && 
    (roomStatus.room.player1 === currentUser.username || roomStatus.room.player2 === currentUser.username);
  
  // Check if it's the current user's turn
  const isUserTurn = isPlayerInRoom && currentUser && roomStatus?.room.current_turn === currentUser.username;
  
  // Group arguments by round
  const argumentsByRound = roomStatus?.arguments.reduce<Record<number, Argument[]>>((acc, arg) => {
    if (!acc[arg.round]) {
      acc[arg.round] = [];
    }
    acc[arg.round].push(arg);
    return acc;
  }, {}) || {};
  
  // Check if the debate is over
  const isDebateOver = roomStatus?.room.status === "completed" || roomStatus?.room.status === "aborted";
  
  // Fetch room status
  const fetchRoomStatus = async () => {
    if (!roomKey) return;
    
    try {
      setLoading(true);
      const status = await api.getRoomStatus(roomKey);
      setRoomStatus(status);
      
      // If debate is over, navigate to results
      if (status.room.status === "completed" || status.room.status === "aborted") {
        if (refreshIntervalRef.current) {
          clearInterval(refreshIntervalRef.current);
          refreshIntervalRef.current = null;
        }
        // Only navigate if we haven't already
        if (window.location.pathname !== `/results/${roomKey}`) {
          navigate(`/results/${roomKey}`);
        }
      }
    } catch (error) {
      toast.error("Failed to load debate room status");
    } finally {
      setLoading(false);
    }
  };
  
  // Initialize the component
  useEffect(() => {
    fetchRoomStatus();
    
    // Set up polling interval for room status
    refreshIntervalRef.current = window.setInterval(() => {
      if (LOADING_STATES.some(state => eval(state))) return;
      fetchRoomStatus();
    }, REFRESH_INTERVAL);
    
    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
    };
  }, [roomKey]);
  
  // Handle submitting an argument
  const handleSubmitArgument = async () => {
    if (!roomKey || !currentUser || !argument.trim() || !isUserTurn) return;
    
    try {
      setSubmitting(true);
      await api.submitArgument(roomKey, currentUser.username, argument.trim());
      setArgument("");
      toast.success("Argument submitted successfully!");
      await fetchRoomStatus();
    } catch (error) {
      toast.error("Failed to submit argument");
    } finally {
      setSubmitting(false);
    }
  };
  
  // Handle aborting the debate
  const handleAbortDebate = async () => {
    if (!roomKey || !currentUser || !isPlayerInRoom) return;
    
    try {
      setAborting(true);
      await api.abortDebate(roomKey, currentUser.username);
      toast.success("Debate aborted successfully");
      navigate(`/results/${roomKey}`);
    } catch (error) {
      toast.error("Failed to abort debate");
    } finally {
      setAborting(false);
    }
  };
  
  // Copy room key to clipboard
  const copyRoomKey = () => {
    if (!roomKey) return;
    
    navigator.clipboard.writeText(roomKey);
    setCopied(true);
    toast.success("Room key copied to clipboard!");
    
    setTimeout(() => setCopied(false), 2000);
  };
  
  if (loading && !roomStatus) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-[100px] w-full rounded-lg" />
        <Skeleton className="h-[300px] w-full rounded-lg" />
        <Skeleton className="h-[100px] w-full rounded-lg" />
      </div>
    );
  }
  
  if (!roomStatus) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Room Not Found</CardTitle>
          <CardDescription>
            The debate room you're looking for doesn't exist or has been closed.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button onClick={() => navigate("/dashboard")} className="debate-button-primary">
            Return to Dashboard
          </Button>
        </CardFooter>
      </Card>
    );
  }
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">{roomStatus.topic.title}</CardTitle>
              <CardDescription>{roomStatus.topic.description}</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">Room Key:</span>
              <Badge variant="outline" className="font-mono">{roomKey}</Badge>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={copyRoomKey}
                disabled={copied}
              >
                <ClipboardCopy size={16} />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="flex flex-col items-center">
              <div className="text-sm mb-1">Player 1</div>
              <div className="font-semibold">{roomStatus.room.player1}</div>
              <div className="text-sm mt-2">Score: {roomStatus.scores.player1}</div>
              {roomStatus.room.current_turn === roomStatus.room.player1 && (
                <Badge className="mt-1 bg-green-100 text-green-800 hover:bg-green-100">
                  Current Turn
                </Badge>
              )}
            </div>
            
            <div className="flex flex-col items-center">
              <div className="text-sm mb-1">Player 2</div>
              <div className="font-semibold">
                {roomStatus.room.player2 || "Waiting for opponent..."}
              </div>
              {roomStatus.room.player2 && (
                <>
                  <div className="text-sm mt-2">Score: {roomStatus.scores.player2}</div>
                  {roomStatus.room.current_turn === roomStatus.room.player2 && (
                    <Badge className="mt-1 bg-green-100 text-green-800 hover:bg-green-100">
                      Current Turn
                    </Badge>
                  )}
                </>
              )}
            </div>
          </div>
          
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Badge variant="outline">Round {roomStatus.room.current_round}/5</Badge>
              <Badge variant={roomStatus.room.status === "waiting" ? "secondary" : roomStatus.room.status === "in_progress" ? "default" : "outline"}>
                {roomStatus.room.status === "waiting" ? "Waiting" : 
                 roomStatus.room.status === "in_progress" ? "In Progress" : 
                 roomStatus.room.status === "completed" ? "Completed" : "Aborted"}
              </Badge>
            </div>
            
            {isPlayerInRoom && roomStatus.room.status === "in_progress" && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="text-debate-red border-debate-red hover:bg-debate-red/10">
                    <AlertTriangle size={16} className="mr-2" />
                    Abort Debate
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Aborting the debate will incur a <span className="font-bold text-debate-red">30-point penalty</span>. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleAbortDebate}
                      className="bg-debate-red text-white hover:bg-debate-red/90"
                      disabled={aborting}
                    >
                      {aborting ? "Aborting..." : "Yes, Abort Debate"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
          
          <Separator className="my-4" />
          
          <div className="space-y-6">
            {Object.entries(argumentsByRound).map(([round, args]) => (
              <div key={round} className="space-y-2">
                <h3 className="text-sm font-medium">Round {round}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {args.map((arg, index) => (
                    <div
                      key={`${arg.player}-${arg.round}-${index}`}
                      className={`argument-area ${arg.player === roomStatus.room.player1 ? 'border-blue-200' : 'border-green-200'}`}
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
        
        {roomStatus.room.status === "in_progress" && isPlayerInRoom && (
          <CardFooter className="flex-col space-y-4">
            <Separator />
            
            {isUserTurn ? (
              <>
                <div className="w-full space-y-2">
                  <div className="flex justify-between items-center">
                    <label htmlFor="argument" className="text-sm font-medium">
                      Your Argument
                    </label>
                    <div className="flex items-center space-x-2">
                      <Clock size={14} />
                      <span className="text-xs text-muted-foreground">
                        Your turn - submit your argument
                      </span>
                    </div>
                  </div>
                  
                  <Textarea
                    id="argument"
                    placeholder="Write your argument here..."
                    value={argument}
                    onChange={(e) => setArgument(e.target.value)}
                    disabled={submitting}
                    className="min-h-[150px]"
                    maxLength={ARGUMENT_MAX_LENGTH}
                  />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">
                      {argument.length}/{ARGUMENT_MAX_LENGTH} characters
                    </span>
                    <Progress 
                      value={(argument.length / ARGUMENT_MAX_LENGTH) * 100} 
                      className="w-32 h-2"
                    />
                  </div>
                </div>
                
                <Button
                  onClick={handleSubmitArgument}
                  disabled={submitting || !argument.trim()}
                  className="w-full debate-button-primary"
                >
                  {submitting ? (
                    "Submitting..."
                  ) : (
                    <>
                      <Send size={16} className="mr-2" />
                      Submit Argument
                    </>
                  )}
                </Button>
              </>
            ) : (
              <div className="w-full p-4 bg-muted rounded-lg flex items-center justify-center space-x-2">
                <Clock size={20} className="text-muted-foreground" />
                <span className="text-muted-foreground">
                  Waiting for {roomStatus.room.current_turn} to submit an argument...
                </span>
              </div>
            )}
          </CardFooter>
        )}
        
        {roomStatus.room.status === "waiting" && isPlayerInRoom && (
          <CardFooter>
            <div className="w-full p-4 bg-muted rounded-lg flex items-center justify-center space-x-2">
              <Clock size={20} className="text-muted-foreground" />
              <span className="text-muted-foreground">
                Waiting for another player to join...
              </span>
            </div>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

export default DebateRoom;
