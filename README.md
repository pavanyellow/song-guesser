# Song Guesser

A fun music guessing game for teams! Play songs from Spotify and let teams compete to guess them correctly.

## Features

- Team-based gameplay with customizable team names
- Spotify integration for playing songs
- Score tracking with configurable winning points
- Quick song lookup for judges
- Preloaded songs for smooth gameplay
- Celebration animations for winners

## Tech Stack

- Next.js 14 with App Router
- TypeScript
- Tailwind CSS
- Spotify API
- Vercel Deployment

## Getting Started

### Prerequisites

1. Node.js 18 or later
2. A Spotify Developer account
3. A Vercel account (for deployment)

### Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/song-guesser.git
   cd song-guesser
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy the environment variables file:
   ```bash
   cp .env.example .env.local
   ```

4. Fill in your Spotify API credentials in `.env.local`

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Deployment on Vercel

1. Push your code to GitHub

2. Connect your repository to Vercel:
   - Go to [Vercel](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Select the repository

3. Configure environment variables:
   - In your Vercel project settings, go to "Environment Variables"
   - Add the following variables:
     - `SPOTIFY_CLIENT_ID`
     - `SPOTIFY_CLIENT_SECRET`
     - `SPOTIFY_REFRESH_TOKEN`

4. Deploy:
   - Vercel will automatically deploy your app
   - Any push to the main branch will trigger a new deployment

### Obtaining Spotify Credentials

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Create a new application
3. Get your Client ID and Client Secret
4. Set up your redirect URI in the app settings
5. Follow the OAuth flow to get your refresh token

## License

MIT License - feel free to use this project for your own purposes!

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.