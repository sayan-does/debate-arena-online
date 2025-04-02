
import React, { createContext, useContext, useState, useEffect } from "react";
import { api, Player } from "../services/api";
import { useToast } from "@/hooks/use-toast";

interface AuthContextType {
  currentUser: Player | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string) => Promise<boolean>;
  register: (username: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => false,
  register: async () => false,
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<Player | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is already logged in
    const storedUser = localStorage.getItem("debateUser");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setCurrentUser(user);
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        localStorage.removeItem("debateUser");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string): Promise<boolean> => {
    try {
      const exists = await api.verifyPlayer(username);
      if (exists) {
        const stats = await api.getPlayerStats(username);
        setCurrentUser(stats.player);
        localStorage.setItem("debateUser", JSON.stringify(stats.player));
        toast({
          title: "Login successful",
          description: `Welcome back, ${username}!`,
        });
        return true;
      } else {
        toast({
          title: "Login failed",
          description: "Player not found. Please register first.",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      toast({
        title: "Login failed",
        description: "An error occurred while logging in.",
        variant: "destructive",
      });
      return false;
    }
  };

  const register = async (username: string): Promise<boolean> => {
    try {
      const exists = await api.verifyPlayer(username);
      if (exists) {
        toast({
          title: "Registration failed",
          description: "Username already exists. Please try another one.",
          variant: "destructive",
        });
        return false;
      }

      const player = await api.createPlayer(username);
      setCurrentUser(player);
      localStorage.setItem("debateUser", JSON.stringify(player));
      toast({
        title: "Registration successful",
        description: `Welcome to Debate Arena, ${username}!`,
      });
      return true;
    } catch (error) {
      toast({
        title: "Registration failed",
        description: "An error occurred while registering.",
        variant: "destructive",
      });
      return false;
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("debateUser");
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    });
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
