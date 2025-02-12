"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Music2, ArrowRight } from "lucide-react";
import { toast } from "sonner";

interface Song {
  id: string;
  name: string;
  artist: string;
  album_image?: string;
}

export default function Home() {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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
      setCurrentSong(song);
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

  const handleNextSong = async () => {
    try {
      setIsLoading(true);
      await fetchRandomSong();
    } catch (error) {
      toast.error("Failed to load next song");
    } finally {
      setIsLoading(false);
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
              <h1 className="text-4xl font-bold">Song Judge</h1>
            </div>
          </div>

          {/* Controls */}
          <Card className="p-6">
            <div className="flex justify-end">
              <Button 
                onClick={handleNextSong}
                size="lg"
                className="gap-2"
                disabled={isLoading}
              >
                {isLoading ? "Loading..." : "Next Song"}
                {!isLoading && <ArrowRight className="w-5 h-5" />}
              </Button>
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
                className="rounded-lg"
              />
            )}
          </div>

          {/* Song Details */}
          <Card className={`p-6 ${isLoading ? 'opacity-50' : ''}`}>
            {currentSong ? (
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
            ) : (
              <div className="text-center space-y-4">
                <h2 className="text-2xl font-bold">Welcome to Song Judge!</h2>
                <p className="text-muted-foreground">
                  Click "Next Song" to start judging songs.
                </p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}