'use client';

import { useEffect, useRef, useState } from 'react';

interface AudioManagerProps {
  isProcessing?: boolean;
  onPageChange?: boolean;
  onError?: boolean;
  onNotification?: boolean;
  onCrack?: boolean;
  onLightning?: boolean;
  onJumpScare?: boolean;
}

export default function AudioManager({ 
  isProcessing, 
  onPageChange, 
  onError, 
  onNotification, 
  onCrack, 
  onLightning,
  onJumpScare 
}: AudioManagerProps) {
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement }>({});
  const [isEnabled, setIsEnabled] = useState(false);

  // Initialize all audio files
  useEffect(() => {
    const audioFiles = {
      vampire: '/vampire.mp3',
      heartbeat: '/heartbeat.mp3',
      doorCreak: '/door-creak.mp3',
      thunder: '/thunder.mp3',
      whisper: '/whisper.mp3',
      typewriter: '/typewriter.mp3',
      glassBreak: '/glass-break.mp3',
      wind: '/wind.mp3',
      footsteps: '/footsteps.mp3',
      bellToll: '/bell-toll.mp3',
      ghostScare: '/ghost scare.mp3',
      pageTurn: '/page-turn.mp3',
      static: '/static.mp3',
      drip: '/drip.mp3'
    };

    Object.entries(audioFiles).forEach(([key, src]) => {
      const audio = new Audio(src);
      audio.preload = 'auto';
      audio.volume = 0.3;
      audioRefs.current[key] = audio;
    });

    // Set specific volumes
    if (audioRefs.current.vampire) audioRefs.current.vampire.volume = 0.2;
    if (audioRefs.current.heartbeat) audioRefs.current.heartbeat.volume = 0.4;
    if (audioRefs.current.wind) audioRefs.current.wind.volume = 0.15;
    if (audioRefs.current.whisper) audioRefs.current.whisper.volume = 0.25;

    return () => {
      Object.values(audioRefs.current).forEach(audio => {
        audio.pause();
        audio.currentTime = 0;
      });
    };
  }, []);

  // Play sound function
  const playSound = (soundKey: string, loop = false) => {
    if (!isEnabled || !audioRefs.current[soundKey]) return;
    
    const audio = audioRefs.current[soundKey];
    audio.currentTime = 0;
    audio.loop = loop;
    audio.play().catch(console.error);
  };

  // Stop sound function
  const stopSound = (soundKey: string) => {
    if (!audioRefs.current[soundKey]) return;
    
    const audio = audioRefs.current[soundKey];
    audio.pause();
    audio.currentTime = 0;
  };

  // Handle processing state
  useEffect(() => {
    if (isProcessing) {
      playSound('heartbeat', true);
      playSound('typewriter');
    } else {
      stopSound('heartbeat');
    }
  }, [isProcessing, isEnabled]);

  // Handle page changes
  useEffect(() => {
    if (onPageChange) {
      playSound('doorCreak');
      playSound('pageTurn');
    }
  }, [onPageChange, isEnabled]);

  // Handle errors
  useEffect(() => {
    if (onError) {
      playSound('bellToll');
      playSound('static');
    }
  }, [onError, isEnabled]);

  // Handle notifications
  useEffect(() => {
    if (onNotification) {
      playSound('whisper');
    }
  }, [onNotification, isEnabled]);

  // Handle screen cracks
  useEffect(() => {
    if (onCrack) {
      playSound('glassBreak');
    }
  }, [onCrack, isEnabled]);

  // Handle lightning
  useEffect(() => {
    if (onLightning) {
      playSound('thunder');
    }
  }, [onLightning, isEnabled]);

  // Handle jump scares
  useEffect(() => {
    if (onJumpScare) {
      playSound('ghostScare');
    }
  }, [onJumpScare, isEnabled]);

  // Start ambient sounds when enabled
  useEffect(() => {
    if (isEnabled) {
      playSound('vampire', true);
      playSound('wind', true);
      
      // Random ambient sounds
      const ambientInterval = setInterval(() => {
        const rand = Math.random();
        if (rand < 0.1) playSound('footsteps');
        if (rand < 0.05) playSound('drip');
        if (rand < 0.03) playSound('whisper');
      }, 5000);

      return () => clearInterval(ambientInterval);
    } else {
      stopSound('vampire');
      stopSound('wind');
    }
  }, [isEnabled]);

  // Enable audio on first user interaction
  useEffect(() => {
    const enableAudio = () => {
      setIsEnabled(true);
      document.removeEventListener('click', enableAudio);
      document.removeEventListener('keydown', enableAudio);
    };

    document.addEventListener('click', enableAudio);
    document.addEventListener('keydown', enableAudio);

    return () => {
      document.removeEventListener('click', enableAudio);
      document.removeEventListener('keydown', enableAudio);
    };
  }, []);

  return (
    <div className="fixed top-4 left-4 z-50">
      <button
        onClick={() => setIsEnabled(!isEnabled)}
        className="p-2 bg-charred-grey border-2 border-blood-red rounded-lg
                   hover:bg-blood-red hover:text-deep-black
                   transition-all duration-300 text-sm"
        title={isEnabled ? 'Mute Audio' : 'Enable Audio'}
      >
        {isEnabled ? '🔊' : '🔇'}
      </button>
    </div>
  );
}
