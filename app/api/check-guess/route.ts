import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { guess, actualSong } = await request.json();
    
    const isCorrect = guess.toLowerCase() === actualSong.name.toLowerCase();
    
    return NextResponse.json({ 
      correct: isCorrect,
      actualSong: actualSong.name,
      artist: actualSong.artist
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to check guess' },
      { status: 500 }
    );
  }
}