# 🎵 Song Guesser

A fun and interactive music guessing game built with Next.js and the Spotify API. Test your music knowledge by guessing songs from short previews!

## ✨ Features

- 🎮 Single and Two-Player modes
- ⏱️ Configurable preview length (5s or 10s)
- 🏆 Score tracking with local storage
- 🎯 Instant feedback on guesses
- 🎨 Beautiful, responsive UI with dark mode support
- 🔊 High-quality song previews from Spotify

## 🚀 Getting Started

### Prerequisites

- Node.js 16.x or later
- A Spotify Developer account
- A Spotify playlist ID containing the songs you want to use

### Environment Setup

1. Create a `.env` file in the root directory:
```env
SPOTIFY_CLIENT_ID=your_client_id_here
SPOTIFY_CLIENT_SECRET=your_client_secret_here
SPOTIFY_PLAYLIST_ID=your_playlist_id_here
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

## 🎮 How to Play

1. Choose between Single Player or Two Player mode using the toggle
2. Select your preferred preview length (5s or 10s)
3. Click "Play Random Song" to start
4. Listen to the preview and type your guess
5. Submit your guess to see if you're correct
6. Scores are automatically saved between sessions

## 🛠️ Technical Stack

- **Frontend**: Next.js 13 with App Router
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Music API**: Spotify Web API
- **State Management**: React Hooks
- **Storage**: Local Storage for game state
- **Notifications**: Sonner for toasts

## 📦 Project Structure

```
song-guesser/
├── app/
│   ├── api/
│   │   ├── check-guess/
│   │   └── random-song/
│   ├── page.tsx
│   └── layout.tsx
├── components/
│   └── ui/
├── lib/
│   └── spotify.ts
└── public/
```

## 🔒 Security

- Environment variables for sensitive data
- Server-side API calls to protect Spotify credentials
- Client-side preview URLs only

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📝 License

This project is MIT licensed.

## 🙏 Acknowledgments

- [Spotify Web API](https://developer.spotify.com/documentation/web-api/) for music data
- [shadcn/ui](https://ui.shadcn.com/) for beautiful UI components
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Next.js](https://nextjs.org/) for the framework