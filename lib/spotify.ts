import SpotifyWebApi from 'spotify-web-api-node';

if (!process.env.SPOTIFY_CLIENT_ID || !process.env.SPOTIFY_CLIENT_SECRET) {
  throw new Error('Missing Spotify credentials');
}

export const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
});

export async function refreshSpotifyToken() {
  try {
    const data = await spotifyApi.clientCredentialsGrant();
    spotifyApi.setAccessToken(data.body.access_token);
    return data.body.access_token;
  } catch (error) {
    console.error('Error refreshing Spotify token:', error);
    throw error;
  }
}

export async function getPlaylistTracks() {
  try {
    if (!process.env.SPOTIFY_PLAYLIST_ID) {
      throw new Error('Missing playlist ID');
    }
    
    const response = await spotifyApi.getPlaylistTracks(process.env.SPOTIFY_PLAYLIST_ID);
    return response.body.items.map(item => ({
      id: item.track.id,
      name: item.track.name,
      artist: item.track.artists[0].name,
      preview_url: item.track.preview_url,
      album_image: item.track.album.images[0]?.url
    }));
  } catch (error) {
    console.error('Error fetching playlist tracks:', error);
    throw error;
  }
}