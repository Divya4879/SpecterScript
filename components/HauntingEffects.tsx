'use client';

import { useEffect, useState } from 'react';
import AudioManager from './AudioManager';

export default function HauntingEffects() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [bloodTrails, setBloodTrails] = useState<Array<{id: number, x: number, y: number}>>([]);
  const [showCrack, setShowCrack] = useState(false);
  const [showLightning, setShowLightning] = useState(false);
  const [showError, setShowError] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [triggerCrackAudio, setTriggerCrackAudio] = useState(false);
  const [triggerLightningAudio, setTriggerLightningAudio] = useState(false);
  const [triggerErrorAudio, setTriggerErrorAudio] = useState(false);
  const [triggerNotificationAudio, setTriggerNotificationAudio] = useState(false);
  const [triggerJumpScare, setTriggerJumpScare] = useState(false);

  // Blood cursor trail
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      
      // Add blood trail
      const newTrail = { id: Date.now(), x: e.clientX, y: e.clientY };
      setBloodTrails(prev => [...prev.slice(-10), newTrail]);
      
      // Remove old trails
      setTimeout(() => {
        setBloodTrails(prev => prev.filter(trail => trail.id !== newTrail.id));
      }, 2000);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Screen crack on click
  useEffect(() => {
    const handleClick = () => {
      setShowCrack(true);
      setTriggerCrackAudio(true);
      setTimeout(() => {
        setShowCrack(false);
        setTriggerCrackAudio(false);
      }, 300);
    };

    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  // Random lightning flashes
  useEffect(() => {
    const lightningInterval = setInterval(() => {
      if (Math.random() < 0.1) {
        setShowLightning(true);
        setTriggerLightningAudio(true);
        setTimeout(() => {
          setShowLightning(false);
          setTriggerLightningAudio(false);
        }, 400);
      }
    }, 3000);

    return () => clearInterval(lightningInterval);
  }, []);

  // Random jump scares
  useEffect(() => {
    const jumpScareInterval = setInterval(() => {
      if (Math.random() < 0.05) {
        document.body.classList.add('jump-scare');
        setTriggerJumpScare(true);
        setTimeout(() => {
          document.body.classList.remove('jump-scare');
          setTriggerJumpScare(false);
        }, 500);
      }
    }, 10000);

    return () => clearInterval(jumpScareInterval);
  }, []);

  // Random system errors
  useEffect(() => {
    const errorInterval = setInterval(() => {
      if (Math.random() < 0.03) {
        setShowError(true);
        setTriggerErrorAudio(true);
        setTimeout(() => {
          setShowError(false);
          setTriggerErrorAudio(false);
        }, 3000);
      }
    }, 15000);

    return () => clearInterval(errorInterval);
  }, []);

  // Random phantom notifications
  useEffect(() => {
    const notificationInterval = setInterval(() => {
      if (Math.random() < 0.04) {
        setShowNotification(true);
        setTriggerNotificationAudio(true);
        setTimeout(() => {
          setShowNotification(false);
          setTriggerNotificationAudio(false);
        }, 4000);
      }
    }, 20000);

    return () => clearInterval(notificationInterval);
  }, []);

  return (
    <>
      {/* Audio Manager */}
      <AudioManager 
        onCrack={triggerCrackAudio}
        onLightning={triggerLightningAudio}
        onError={triggerErrorAudio}
        onNotification={triggerNotificationAudio}
        onJumpScare={triggerJumpScare}
      />

      {/* Blood Trails */}
      {bloodTrails.map(trail => (
        <div
          key={trail.id}
          className="blood-trail"
          style={{ left: trail.x - 4, top: trail.y - 4 }}
        />
      ))}

      {/* Screen Crack */}
      {showCrack && <div className="screen-crack" />}

      {/* Rolling Fog */}
      <div className="rolling-fog" />

      {/* Lightning Flash */}
      <div className={`lightning-flash ${showLightning ? 'lightning-active' : ''}`} />

      {/* Moving Shadows */}
      <div className="moving-shadows">
        <div className="shadow shadow-1" />
        <div className="shadow shadow-2" />
        <div className="shadow shadow-3" />
      </div>

      {/* Flickering Light that follows mouse */}
      <div 
        className="flickering-light"
        style={{ 
          left: mousePos.x - 100, 
          top: mousePos.y - 100,
          opacity: Math.random() > 0.7 ? 0.8 : 0.3
        }}
      />

      {/* System Error */}
      {showError && (
        <div className="system-error">
          <div>SYSTEM ERROR 0x666</div>
          <div>DARK FORCES DETECTED...</div>
          <div>ATTEMPTING TO PURGE...</div>
        </div>
      )}

      {/* Phantom Notification */}
      {showNotification && (
        <div className="phantom-notification">
          👻 Someone is watching you...
        </div>
      )}
    </>
  );
}
