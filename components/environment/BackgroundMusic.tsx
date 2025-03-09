"use client"

import { useEffect, useState } from 'react';

export const BackgroundMusic = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    // Create an audio element
    const audioElement = new Audio('/music/synthwave.mp3');
    audioElement.loop = true;
    audioElement.volume = 0.5;

    // Setup play/pause functionality
    const togglePlay = () => {
      if (isPlaying) {
        audioElement.play().catch(e => console.error("Audio play failed:", e));
      } else {
        audioElement.pause();
      }
    };

    togglePlay();

    // Cleanup
    return () => {
      audioElement.pause();
      audioElement.src = '';
    };
  }, [isPlaying]);

  return (
    <div className="fixed bottom-5 right-5 z-10">
      <button
        onClick={() => setIsPlaying(!isPlaying)}
        className="bg-black/50 text-white px-4 py-2 rounded-full border border-pink-500 hover:bg-pink-900/50 transition-colors"
      >
        {isPlaying ? 'Pause Music' : 'Play Music'}
      </button>
    </div>
  );
}; 