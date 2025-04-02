
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

const JoinRoom: React.FC = () => {
  const [roomKey, setRoomKey] = useState("");
  const [joining, setJoining] = useState(false);
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomKey.trim() || !currentUser) return;
    
    try {
      setJoining(true);
      await api.joinRoom(roomKey.trim(), currentUser.username);
      toast.success("Joined debate room successfully!");
      navigate(`/room/${roomKey.trim()}`);
    } catch (error) {
      toast.error("Failed to join room. Please check the room key.");
    } finally {
      setJoining(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Join Existing Debate</CardTitle>
        <CardDescription>
          Enter a room key to join an existing debate
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleJoin}>
        <CardContent>
          <div className="flex flex-col space-y-4">
            <Input
              type="text"
              id="room-key"
              placeholder="Enter room key"
              value={roomKey}
              onChange={(e) => setRoomKey(e.target.value)}
              disabled={joining}
              required
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            type="submit" 
            className="w-full debate-button-primary"
            disabled={joining || !roomKey.trim()}
          >
            {joining ? "Joining..." : "Join Debate"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default JoinRoom;
