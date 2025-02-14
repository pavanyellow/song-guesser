"use client";

import { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Music2, Trophy, SkipForward, XCircle, Crown } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import confetti from 'canvas-confetti';

interface Song {
  id: string;
  name: string;
  artist: string;
  album_image?: string;
}

interface Team {
  name: string;
  score: number;
}

const DEFAULT_TEAM_NAMES = [
  "Melody Masters",
  "Beat Breakers",
  "Rhythm Raiders",
  "Tune Titans",
  "Sound Squad",
  "Note Ninjas"
];

const getRandomTeamNames = () => {
  return [...DEFAULT_TEAM_NAMES]
    .sort(() => Math.random() - 0.5)
    .slice(0, 2);
};

export default function Home() {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [nextSong, setNextSong] = useState<Song | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [maxPoints, setMaxPoints] = useState(5);
  const [winner, setWinner] = useState<Team | null>(null);
  const [teams, setTeams] = useState<[Team, Team]>(() => {
    const randomNames = getRandomTeamNames();
    return [
      { name: randomNames[0], score: 0 },
      { name: randomNames[1], score: 0 }
    ];
  });

  const fetchRandomSong = async () => {
    try {
      const response = await fetch('/api/random-song');
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to fetch song');
      }
      const song = await response.json();
      if (!song?.id) {
        throw new Error('Invalid song data');
      }
      return song;
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Failed to fetch song");
      }
      return null;
    }
  };

  const preloadNextSong = useCallback(async () => {
    const song = await fetchRandomSong();
    setNextSong(song);
  }, []);

  const advanceToNextSong = useCallback(() => {
    setCurrentSong(nextSong);
    setNextSong(null);
  }, [nextSong]);

  const handleNextSong = async () => {
    try {
      setIsLoading(true);
      
      // If we have a preloaded song, use it
      if (nextSong) {
        advanceToNextSong();
        // Start preloading the next song immediately
        await preloadNextSong();
      } else {
        // Fallback in case we don't have a preloaded song
        const song = await fetchRandomSong();
        setCurrentSong(song);
        // Still try to preload the next song
        await preloadNextSong();
      }
    } catch (error) {
      toast.error("Failed to load next song");
    } finally {
      setIsLoading(false);
    }
  };

  // Preload first song when component mounts
  useEffect(() => {
    preloadNextSong();
  }, [preloadNextSong]);

  // Preload next song whenever current song changes
  useEffect(() => {
    if (currentSong && !nextSong && !isLoading) {
      preloadNextSong();
    }
  }, [currentSong, nextSong, isLoading, preloadNextSong]);

  const handleTeamNameChange = (index: number, name: string) => {
    setTeams(prev => {
      const newTeams = [...prev] as [Team, Team];
      newTeams[index] = { ...newTeams[index], name };
      return newTeams;
    });
  };

  const handleStartGame = () => {
    if (!teams[0].name || !teams[1].name) {
      toast.error("Please enter names for both teams");
      return;
    }
    if (teams[0].name === teams[1].name) {
      toast.error("Teams must have different names");
      return;
    }
    setGameStarted(true);
    handleNextSong();
  };

  const triggerWinAnimation = () => {
    const duration = 3 * 1000;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };
    
    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min;
    }

    const interval: any = setInterval(() => {
      const particleCount = 50;
    
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      });
    }, 250);
    
    setTimeout(() => clearInterval(interval), duration);
  };

  const handleScore = (teamIndex: number) => {
    setTeams(prev => {
      const newTeams = [...prev] as [Team, Team];
      const newScore = newTeams[teamIndex].score + 1;
      newTeams[teamIndex] = {
        ...newTeams[teamIndex],
        score: newScore
      };

      if (newScore >= maxPoints) {
        setWinner(newTeams[teamIndex]);
        triggerWinAnimation();
      }
      
      return newTeams;
    });
    handleNextSong();
  };

  const handleResetGame = () => {
    setGameStarted(false);
    setCurrentSong(null);
    setWinner(null);
    const randomNames = getRandomTeamNames();
    setTeams([
      { name: randomNames[0], score: 0 },
      { name: randomNames[1], score: 0 }
    ]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Music2 className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
                Song Judge
              </h1>
            </div>
            {gameStarted && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleResetGame}
                className="text-muted-foreground hover:text-destructive transition-colors gap-2"
              >
                <XCircle className="w-4 h-4" />
                End Game
              </Button>
            )}
          </div>

          {!gameStarted ? (
            // Team Setup
            <Card className="p-8 space-y-8">
              <div className="space-y-2 text-center">
                <h2 className="text-3xl font-bold">Welcome to Song Judge!</h2>
                <p className="text-muted-foreground">
                  First team to {maxPoints} points wins the game
                </p>
              </div>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Team 1 Name</label>
                    <Input
                      value={teams[0].name}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleTeamNameChange(0, e.target.value)}
                      className="h-10"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Team 2 Name</label>
                    <Input
                      value={teams[1].name}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleTeamNameChange(1, e.target.value)}
                      className="h-10"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Points to Win</label>
                  <Input
                    type="number"
                    min="1"
                    max="20"
                    value={maxPoints}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMaxPoints(Math.max(1, Math.min(20, parseInt(e.target.value) || 1)))}
                    className="h-10"
                  />
                </div>
                <div className="pt-4">
                  <Button 
                    onClick={handleStartGame}
                    size="lg"
                    className="w-full h-16 text-lg bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                  >
                    Start Game
                  </Button>
                </div>
              </div>
            </Card>
          ) : (
            <>
              {/* Winner Overlay */}
              {winner && (
                <Card className="p-8 border-2 border-primary mb-8 bg-gradient-to-r from-primary/10 to-background">
                  <div className="text-center space-y-4">
                    <Crown className="w-16 h-16 text-primary mx-auto" />
                    <h2 className="text-3xl font-bold">{winner.name} Wins!</h2>
                    <p className="text-xl text-muted-foreground">Final Score: {winner.score} points</p>
                    <Button
                      onClick={handleResetGame}
                      size="lg"
                      variant="outline"
                      className="min-w-[200px]"
                    >
                      Play Again
                    </Button>
                  </div>
                </Card>
              )}

              {/* Scoreboard */}
              <Card className="p-8 border-2">
                <div className="flex justify-between items-center gap-8">
                  <div className="flex-1 text-center space-y-4">
                    <div className="space-y-1">
                      <h3 className="text-xl font-bold">{teams[0].name}</h3>
                      <div className="text-4xl font-bold text-primary">{teams[0].score}</div>
                      <div className="text-sm text-muted-foreground">of {maxPoints} points</div>
                    </div>
                    <Button 
                      onClick={() => handleScore(0)} 
                      size="lg"
                      className="w-full max-w-[200px] bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                      disabled={!!winner}
                    >
                      <Trophy className="w-5 h-5 mr-2" />
                      Winner!
                    </Button>
                  </div>
                  <div className="text-2xl font-bold text-muted-foreground">VS</div>
                  <div className="flex-1 text-center space-y-4">
                    <div className="space-y-1">
                      <h3 className="text-xl font-bold">{teams[1].name}</h3>
                      <div className="text-4xl font-bold text-primary">{teams[1].score}</div>
                      <div className="text-sm text-muted-foreground">of {maxPoints} points</div>
                    </div>
                    <Button 
                      onClick={() => handleScore(1)} 
                      size="lg"
                      className="w-full max-w-[200px] bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                      disabled={!!winner}
                    >
                      <Trophy className="w-5 h-5 mr-2" />
                      Winner!
                    </Button>
                  </div>
                </div>
              </Card>

              {/* Spotify Player */}
              <div className="w-full aspect-[3/1] max-h-[152px]">
                {currentSong?.id && (
                  <iframe
                    src={`https://open.spotify.com/embed/track/${currentSong.id}`}
                    width="100%"
                    height="100%"
                    style={{ minHeight: '152px' }}
                    frameBorder="0"
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy"
                    className="rounded-lg shadow-lg"
                  />
                )}
              </div>

              {/* Song Details and Controls */}
              <div className="grid grid-cols-1 md:grid-cols-[1fr,auto] gap-6">
                <Card 
                  className={`p-6 ${isLoading ? 'opacity-50' : ''} ${
                    currentSong ? 'hover:bg-muted/50 cursor-pointer transition-colors group' : ''
                  }`}
                  onClick={() => {
                    if (currentSong) {
                      const searchQuery = encodeURIComponent(`${currentSong.name} ${currentSong.artist}`);
                      window.open(`https://www.google.com/search?q=${searchQuery}`, '_blank');
                    }
                  }}
                >
                  {currentSong ? (
                    <div className="flex items-center gap-4">
                      {currentSong.album_image && (
                        <img
                          src={currentSong.album_image}
                          alt="Album Cover"
                          className="w-16 h-16 rounded-lg shadow-lg"
                        />
                      )}
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-lg leading-tight">{currentSong.name}</p>
                          <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            width="16" 
                            height="16" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="2" 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            className="opacity-50 group-hover:opacity-100 transition-opacity"
                          >
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                            <polyline points="15 3 21 3 21 9" />
                            <line x1="10" y1="14" x2="21" y2="3" />
                          </svg>
                        </div>
                        <p className="text-muted-foreground">{currentSong.artist}</p>
                        <p className="text-sm text-muted-foreground/80 mt-1 group-hover:text-primary/80">
                          Click to search song details
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center space-y-2">
                      <p className="text-muted-foreground">
                        {nextSong ? 'Loading next song...' : 'Click "Skip" to load the first song'}
                      </p>
                    </div>
                  )}
                </Card>
                
                <Card className="p-2">
                  <Button 
                    onClick={handleNextSong}
                    size="lg"
                    variant="outline"
                    className="gap-2 h-[68px] px-8"
                    disabled={isLoading || !!winner}
                  >
                    {isLoading ? "Loading..." : "Skip"}
                    <SkipForward className="w-5 h-5" />
                  </Button>
                </Card>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}