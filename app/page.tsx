"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Music2, Timer, Crown, Volume2 } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Song {
  id: string;
  name: string;
  artist: string;
  preview_url: string;
  album_image?: string;
}

export default function Home() {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [guess, setGuess] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [scores, setScores] = useState({ team1: 0, team2: 0 });
  const [currentTeam, setCurrentTeam] = useState(1);
  const [previewLength, setPreviewLength] = useState(5);
  const [timeLeft, setTimeLeft] = useState(0);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [showJudgeView, setShowJudgeView] = useState(false);

  useEffect(() => {
    setAudio(new Audio());
  }, []);

  useEffect(() => {
    const scores = localStorage.getItem('songGuesserScores');
    if (scores) {
      setScores(JSON.parse(scores));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('songGuesserScores', JSON.stringify(scores));
  }, [scores]);

  const fetchRandomSong = async () => {
    try {
      const response = await fetch('/api/random-song');
      const song = await response.json();
      setCurrentSong(song);
      return song;
    } catch (error) {
      toast.error("Failed to fetch song");
      return null;
    }
  };

  const playSong = async () => {
    if (!audio) return;
    
    const song = await fetchRandomSong();
    if (!song?.preview_url) {
      toast.error("No preview available for this song");
      return;
    }

    setIsPlaying(true);
    setTimeLeft(previewLength);
    audio.src = song.preview_url;
    audio.play();

    const timer = setInterval(() => {
      setTimeLeft((time) => {
        if (time <= 1) {
          clearInterval(timer);
          audio.pause();
          setIsPlaying(false);
          return 0;
        }
        return time - 1;
      });
    }, 1000);
  };

  const checkGuess = async () => {
    if (!currentSong) return;

    try {
      const response = await fetch('/api/check-guess', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ guess, actualSong: currentSong }),
      });
      
      const result = await response.json();
      
      if (result.correct) {
        toast.success(`Team ${currentTeam} guessed correctly!`);
        setScores(prev => ({
          ...prev,
          [`team${currentTeam}`]: prev[`team${currentTeam}` as keyof typeof prev] + 1
        }));
      } else {
        toast.error(`Wrong! The song was "${result.actualSong}" by ${result.artist}`);
      }

      setCurrentTeam(currentTeam === 1 ? 2 : 1);
      setGuess("");
      setCurrentSong(null);
    } catch (error) {
      toast.error("Failed to check guess");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Music2 className="w-8 h-8" />
              <h1 className="text-4xl font-bold">Song Guesser</h1>
            </div>
            <Button
              variant="outline"
              onClick={() => setShowJudgeView(!showJudgeView)}
              className="gap-2"
            >
              <Crown className="w-4 h-4" />
              {showJudgeView ? "Hide Judge View" : "Show Judge View"}
            </Button>
          </div>

          {/* Game Settings */}
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={previewLength === 10}
                    onCheckedChange={(checked) => setPreviewLength(checked ? 10 : 5)}
                  />
                  <Label>10s Preview</Label>
                </div>
              </div>
              {isPlaying && (
                <div className="flex items-center gap-2 text-2xl font-bold">
                  <Timer className="w-6 h-6 animate-pulse" />
                  {timeLeft}s
                </div>
              )}
            </div>
          </Card>

          {/* Team Scores */}
          <div className="grid grid-cols-2 gap-6">
            {[1, 2].map((team) => (
              <Card
                key={team}
                className={`p-6 ${currentTeam === team ? 'ring-2 ring-primary' : ''}`}
              >
                <div className="text-center space-y-2">
                  <h2 className="text-2xl font-bold">Team {team}</h2>
                  <p className="text-4xl font-bold text-primary">
                    {scores[`team${team}` as keyof typeof scores]}
                  </p>
                  {currentTeam === team && (
                    <p className="text-sm text-muted-foreground">Current Turn</p>
                  )}
                </div>
              </Card>
            ))}
          </div>

          {/* Game Controls */}
          <Card className="p-6 space-y-6">
            <Button 
              className="w-full h-16 text-xl gap-2"
              onClick={playSong}
              disabled={isPlaying || !audio}
            >
              <Volume2 className="w-6 h-6" />
              Play Random Song
            </Button>

            <div className="flex gap-4">
              <Input
                placeholder={`Team ${currentTeam}'s guess...`}
                value={guess}
                onChange={(e) => setGuess(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && checkGuess()}
                className="text-lg"
              />
              <Button 
                onClick={checkGuess}
                disabled={!currentSong || !guess}
                className="px-8"
              >
                Submit Guess
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Judge View Dialog */}
      <Dialog open={showJudgeView} onOpenChange={setShowJudgeView}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Judge View</DialogTitle>
            <DialogDescription>
              Current song information (only visible to the judge)
            </DialogDescription>
          </DialogHeader>
          
          {currentSong && (
            <div className="space-y-4">
              {currentSong.album_image && (
                <img
                  src={currentSong.album_image}
                  alt="Album Cover"
                  className="w-full rounded-lg shadow-lg"
                />
              )}
              <div className="space-y-2">
                <p className="font-bold text-lg">{currentSong.name}</p>
                <p className="text-muted-foreground">{currentSong.artist}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}