# Song Judge

A simple web app that displays random songs from Spotify and lets you listen to them using the Spotify embedded player.

## Features

- Fetches random songs using Spotify's Web API
- Displays song details including name, artist, and album artwork
- Embedded Spotify player for instant playback
- Clean, modern UI built with Next.js and Tailwind CSS

## Tech Stack

- [Next.js 14](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [Spotify Web API](https://developer.spotify.com/documentation/web-api) - Music data

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/song-guesser.git
cd song-guesser
```

2. Install dependencies:
```bash
npm install
```

3. Create a Spotify application:
   - Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
   - Create a new application
   - Copy the Client ID and Client Secret

4. Set up environment variables:
   - Copy `.env` to `.env.local`
   - Update the values in `.env.local` with your Spotify credentials:
```env
SPOTIFY_CLIENT_ID=your_client_id_here
SPOTIFY_CLIENT_SECRET=your_client_secret_here
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## How It Works

The app uses Spotify's Web API with client credentials flow (server-to-server) to:
1. Search for tracks using common words
2. Select a random track from the results
3. Display the track details and embedded player

No user authentication is required as it only accesses public data.

## License

MIT