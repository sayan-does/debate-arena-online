
import React from "react";
import { useNavigate } from "react-router-dom";
import { DebateHistory as DebateHistoryType } from "@/services/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Trophy, X, Clock } from "lucide-react";

interface DebateHistoryProps {
  history: DebateHistoryType[];
}

const DebateHistory: React.FC<DebateHistoryProps> = ({ history }) => {
  const navigate = useNavigate();
  
  const handleViewResults = (debateId: string) => {
    navigate(`/results/${debateId}`);
  };
  
  if (!history.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Debate History</CardTitle>
          <CardDescription>
            Your previous debates will appear here
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Clock size={48} className="text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No debate history yet</p>
            <p className="text-sm text-muted-foreground mt-1">
              Start a new debate to build your record
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Debate History</CardTitle>
        <CardDescription>
          Your recent debates and results
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {history.map((debate) => (
            <div
              key={debate.id}
              className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-lg border"
            >
              <div className="flex flex-col mb-2 md:mb-0">
                <div className="flex items-center space-x-2">
                  <span className="font-medium truncate max-w-xs">{debate.topic}</span>
                  <Badge
                    variant={
                      debate.result === "win"
                        ? "default"
                        : debate.result === "loss"
                        ? "destructive"
                        : "outline"
                    }
                    className="capitalize"
                  >
                    {debate.result === "win" ? (
                      <Trophy size={14} className="mr-1" />
                    ) : debate.result === "loss" ? (
                      <X size={14} className="mr-1" />
                    ) : (
                      <Clock size={14} className="mr-1" />
                    )}
                    {debate.result}
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  <span>vs. {debate.opponent}</span>
                  <span className="mx-2">•</span>
                  <span>{format(new Date(debate.date), "MMM d, yyyy")}</span>
                  <span className="mx-2">•</span>
                  <span>Score: {debate.score}</span>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleViewResults(debate.id)}
                className="mt-2 md:mt-0"
              >
                View Results
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default DebateHistory;
