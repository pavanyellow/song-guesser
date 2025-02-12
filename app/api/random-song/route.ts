import { NextResponse, NextRequest } from 'next/server';
import SpotifyWebApi from 'spotify-web-api-node';

// Token cache
let accessToken: string | null = null;
let tokenExpirationTime: number | null = null;

// List of search terms to get a variety of songs
const searchTerms = [
  'a', 'e', 'i', 'o', 'u',  // Vowels give diverse results
  'the', 'love', 'you', 'in', 'my',  // Common words in song titles
];

console.log('Environment variables:', {
  SPOTIFY_CLIENT_ID: process.env.SPOTIFY_CLIENT_ID,
  SPOTIFY_CLIENT_SECRET: process.env.SPOTIFY_CLIENT_SECRET
});

if (!process.env.SPOTIFY_CLIENT_ID || !process.env.SPOTIFY_CLIENT_SECRET) {
  throw new Error('Missing Spotify credentials');
}

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
});

async function getValidToken() {
  // Check if we have a valid cached token
  if (accessToken && tokenExpirationTime && Date.now() < tokenExpirationTime) {
    console.log('Using cached access token');
    return accessToken;
  }

  // Get new token
  console.log('Getting new access token...');
  const data = await spotifyApi.clientCredentialsGrant();
  accessToken = data.body.access_token;
  // Set expiration time 5 minutes before actual expiry to be safe
  tokenExpirationTime = Date.now() + (data.body.expires_in - 300) * 1000;
  console.log('New access token obtained');
  return accessToken;
}

export async function GET(request: NextRequest) {
  try {
    // Get a valid token (either cached or new)
    const token = await getValidToken();
    spotifyApi.setAccessToken(token);

    // Get a random search term
    const searchTerm = searchTerms[Math.floor(Math.random() * searchTerms.length)];
    console.log('Searching for tracks with term:', searchTerm);
    
    // Search for tracks
    const response = await spotifyApi.searchTracks(searchTerm, {
      limit: 50,
      market: 'US'
    });
    
    if (!response.body.tracks?.items) {
      throw new Error('Invalid response from Spotify API');
    }

    const tracks = response.body.tracks.items
      .filter(track => !track.is_local) // Filter out local tracks
      .map(track => ({
        id: track.id,
        name: track.name,
        artist: track.artists[0].name,
        album_image: track.album.images[0]?.url
      }));

    if (tracks.length === 0) {
      throw new Error('No tracks found');
    }

    const randomTrack = tracks[Math.floor(Math.random() * tracks.length)];
    console.log('Successfully selected random track:', randomTrack.name);
    
    return NextResponse.json(randomTrack);
  } catch (error: any) {
    console.error('Error details:', error?.body || error);
    // Check for specific Spotify API errors
    if (error?.body?.error?.status === 401) {
      return NextResponse.json({ error: 'Invalid or expired access token' }, { status: 401 });
    }
    const message = error?.body?.error?.message || error?.message || 'Failed to fetch random song';
    const status = error?.body?.error?.status || 500;
    return NextResponse.json({ error: message }, { status });
  }
}