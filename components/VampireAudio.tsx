'use client';

import { useState, useRef, useEffect } from 'react';

export default function VampireAudio() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleCanPlay = () => {
      setIsLoaded(true);
      // Auto-play when loaded
      audio.play().then(() => {
        setIsPlaying(true);
      }).catch(error => {
        console.log('Auto-play prevented:', error);
      });
    };
    
    const handleEnded = () => setIsPlaying(false);
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

    // Set volume to a reasonable level
    audio.volume = 0.4;
    audio.loop = true;

    return () => {
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
    };
  }, []);

  const toggleAudio = async () => {
    const audio = audioRef.current;
    if (!audio || !isLoaded) return;

    try {
      if (isPlaying) {
        audio.pause();
      } else {
        await audio.play();
      }
    } catch (error) {
      console.error('Audio playback failed:', error);
    }
  };

  return (
    <div className="vampire-audio">
      <audio
        ref={audioRef}
        preload="auto"
        src="/vampire.mp3"
      />
      
      <button
        onClick={toggleAudio}
        className={`audio-control ${isPlaying ? 'playing' : ''}`}
        disabled={!isLoaded}
        title={isPlaying ? 'Pause vampire ambience' : 'Play vampire ambience'}
      >
        {!isLoaded ? (
          <span className="text-white text-xs">⏳</span>
        ) : isPlaying ? (
          <span className="text-white text-lg">🔊</span>
        ) : (
          <span className="text-white text-lg">🔇</span>
        )}
      </button>

      {isPlaying && (
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 
                      text-xs text-parchment font-crimson opacity-80 whitespace-nowrap">
          𝔳𝔞𝔪𝔭𝔦𝔯𝔢 𝔞𝔪𝔟𝔦𝔢𝔫𝔠𝔢
        </div>
      )}
    </div>
  );
}
