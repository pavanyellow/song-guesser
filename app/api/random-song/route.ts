import { NextResponse } from 'next/server';
import { getPlaylistTracks, refreshSpotifyToken } from '@/lib/spotify';

export async function GET() {
  try {
    await refreshSpotifyToken();
    const tracks = await getPlaylistTracks();
    const randomTrack = tracks[Math.floor(Math.random() * tracks.length)];
    
    // Add album image to the track data
    return NextResponse.json({
      ...randomTrack,
      album_image: randomTrack.album_image
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch random song' },
      { status: 500 }
    );
  }
}