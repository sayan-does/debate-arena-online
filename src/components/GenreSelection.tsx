
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, Genre } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

const GenreSelection: React.FC = () => {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const genresData = await api.getGenres();
        setGenres(genresData);
      } catch (error) {
        toast.error("Failed to load debate genres");
      } finally {
        setLoading(false);
      }
    };

    fetchGenres();
  }, []);

  const handleGenreSelect = (genreId: string) => {
    setSelectedGenre(genreId);
  };

  const handleContinue = () => {
    if (selectedGenre) {
      navigate(`/topics/${selectedGenre}`);
    } else {
      toast.error("Please select a genre to continue");
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-[150px] w-full rounded-lg" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Skeleton className="h-[200px] w-full rounded-lg" />
          <Skeleton className="h-[200px] w-full rounded-lg" />
          <Skeleton className="h-[200px] w-full rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Select a Debate Genre</CardTitle>
          <CardDescription>
            Choose a category that interests you for your debate
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {genres.map((genre) => (
          <Card 
            key={genre.id}
            className={`cursor-pointer transition-all ${selectedGenre === genre.id ? 'ring-2 ring-primary scale-105' : 'hover:shadow-md'}`}
            onClick={() => handleGenreSelect(genre.id)}
          >
            <CardHeader>
              <CardTitle>{genre.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{genre.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-end mt-6">
        <Button 
          onClick={handleContinue}
          disabled={!selectedGenre}
          className="debate-button-primary"
        >
          Continue to Topics
        </Button>
      </div>
    </div>
  );
};

export default GenreSelection;
