// Debate API Service

import { toast } from "sonner";

// Base URL for API calls
const API_BASE_URL = "http://127.0.0.1:8000";

// API error handler
const handleApiError = (error: any) => {
  console.error("API Error:", error);
  const errorMessage = error.response?.data?.detail || "An unexpected error occurred";
  toast.error(errorMessage);
  return Promise.reject(error);
};

// Types
export interface Player {
  username: string;
  wins: number;
  losses: number;
  total_score: number;
  ranking: number;
}

export interface DebateHistory {
  id: string;
  topic: string;
  opponent: string;
  result: "win" | "loss" | "aborted";
  score: number;
  date: string;
}

export interface PlayerStats {
  player: Player;
  history: DebateHistory[];
}

export interface Genre {
  id: string;
  name: string;
  description: string;
}

export interface Topic {
  id: string;
  title: string;
  description: string;
}

export interface Room {
  room_key: string;
  topic: Topic;
  player1: string;
  player2: string | null;
  current_round: number;
  current_turn: string | null;
  status: "waiting" | "in_progress" | "completed" | "aborted";
}

export interface Argument {
  player: string;
  content: string;
  round: number;
  score: number | null;
}

export interface RoomStatus {
  room: Room;
  topic: Topic;
  arguments: Argument[];
  scores: {
    player1: number;
    player2: number;
  };
  winner: string | null;
}

// API functions
export const api = {
  // Player Management
  createPlayer: async (username: string): Promise<Player> => {
    try {
      const response = await fetch(`${API_BASE_URL}/players/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw error;
      }
      
      return response.json();
    } catch (error) {
      return handleApiError(error);
    }
  },
  
  verifyPlayer: async (username: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}/players/${username}`);
      return response.ok;
    } catch (error) {
      return false;
    }
  },
  
  getPlayerStats: async (username: string): Promise<PlayerStats> => {
    try {
      const response = await fetch(`${API_BASE_URL}/player/history/${username}`);
      
      if (!response.ok) {
        const error = await response.json();
        throw error;
      }
      
      return response.json();
    } catch (error) {
      return handleApiError(error);
    }
  },
  
  // Debate Preparation
  getGenres: async (): Promise<Genre[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/genres`);
      
      if (!response.ok) {
        const error = await response.json();
        throw error;
      }
      
      return response.json();
    } catch (error) {
      return handleApiError(error);
    }
  },
  
  getTopics: async (genre: string): Promise<Topic[]> => {
    try {
      const response = await fetch(`${API_BASE_URL}/topics/${genre}`);
      
      if (!response.ok) {
        const error = await response.json();
        throw error;
      }
      
      return response.json();
    } catch (error) {
      return handleApiError(error);
    }
  },
  
  createRoom: async (playerName: string, topicId: string): Promise<Room> => {
    try {
      const response = await fetch(`${API_BASE_URL}/create-room/${playerName}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic_id: topicId }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw error;
      }
      
      return response.json();
    } catch (error) {
      return handleApiError(error);
    }
  },
  
  joinRoom: async (roomKey: string, playerName: string): Promise<Room> => {
    try {
      const response = await fetch(`${API_BASE_URL}/join-room/${roomKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ player_name: playerName }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw error;
      }
      
      return response.json();
    } catch (error) {
      return handleApiError(error);
    }
  },
  
  // Debate Flow
  submitArgument: async (roomKey: string, playerName: string, argument: string): Promise<RoomStatus> => {
    try {
      const response = await fetch(`${API_BASE_URL}/submit-argument/${roomKey}/${playerName}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ argument }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw error;
      }
      
      return response.json();
    } catch (error) {
      return handleApiError(error);
    }
  },
  
  getRoomStatus: async (roomKey: string): Promise<RoomStatus> => {
    try {
      const response = await fetch(`${API_BASE_URL}/room-status/${roomKey}`);
      
      if (!response.ok) {
        const error = await response.json();
        throw error;
      }
      
      return response.json();
    } catch (error) {
      return handleApiError(error);
    }
  },
  
  abortDebate: async (roomKey: string, playerName: string): Promise<RoomStatus> => {
    try {
      const response = await fetch(`${API_BASE_URL}/abort-debate/${roomKey}/${playerName}`, {
        method: "POST",
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw error;
      }
      
      return response.json();
    } catch (error) {
      return handleApiError(error);
    }
  },
};

export default api;
