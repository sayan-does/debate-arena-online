
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api, Topic } from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

const TopicSelection: React.FC = () => {
  const { genreId } = useParams<{ genreId: string }>();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [creatingRoom, setCreatingRoom] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchTopics = async () => {
      if (!genreId) return;
      
      try {
        const topicsData = await api.getTopics(genreId);
        setTopics(topicsData);
      } catch (error) {
        toast.error("Failed to load debate topics");
      } finally {
        setLoading(false);
      }
    };

    fetchTopics();
  }, [genreId]);

  const handleTopicSelect = (topicId: string) => {
    setSelectedTopic(topicId);
  };

  const handleCreateRoom = async () => {
    if (!selectedTopic || !currentUser) return;
    
    try {
      setCreatingRoom(true);
      const room = await api.createRoom(currentUser.username, selectedTopic);
      toast.success("Debate room created successfully!");
      navigate(`/room/${room.room_key}`);
    } catch (error) {
      toast.error("Failed to create debate room");
    } finally {
      setCreatingRoom(false);
    }
  };

  const handleBack = () => {
    navigate("/create");
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-[100px] w-full rounded-lg" />
        <div className="space-y-4">
          <Skeleton className="h-[200px] w-full rounded-lg" />
          <Skeleton className="h-[200px] w-full rounded-lg" />
          <Skeleton className="h-[200px] w-full rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="icon" onClick={handleBack}>
          <ArrowLeft size={20} />
        </Button>
        <h2 className="text-2xl font-bold">Select a Topic</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Choose a Debate Topic</CardTitle>
          <CardDescription>
            Select one of the following topics for your debate
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="space-y-4">
        {topics.map((topic) => (
          <Card 
            key={topic.id}
            className={`cursor-pointer transition-all ${selectedTopic === topic.id ? 'ring-2 ring-primary' : 'hover:shadow-md'}`}
            onClick={() => handleTopicSelect(topic.id)}
          >
            <CardHeader>
              <CardTitle>{topic.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{topic.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-end mt-6">
        <Button 
          onClick={handleCreateRoom}
          disabled={!selectedTopic || creatingRoom}
          className="debate-button-primary"
        >
          {creatingRoom ? "Creating Room..." : "Create Debate Room"}
        </Button>
      </div>
    </div>
  );
};

export default TopicSelection;
