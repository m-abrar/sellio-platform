// src/utils/animations.ts
import confetti from 'canvas-confetti';

/**
 * Orbital Center Burst
 * Triggers a high-end, zero-gravity explosion from the center of the screen.
 */
export const triggerCelebration = async () => {
  const scalar = 3;
  
  // Generate shapes from emojis
  const rocket = await confetti.shapeFromText({ text: '🚀', scalar });
  const star = await confetti.shapeFromText({ text: '✨', scalar: 1.5 });
  const colors = ['#6610f2', '#ffffff', '#a855f7'];

  // 1. Primary Blast
  confetti({
    particleCount: 80,
    spread: 360,
    ticks: 200,
    gravity: 0,
    decay: 0.94,
    startVelocity: 30,
    origin: { x: 0.5, y: 0.5 },
    colors,
    shapes: [rocket, star, 'circle'],
    zIndex: 9999,
  });

  // 2. Pulse Shockwave
  setTimeout(() => {
    confetti({
      particleCount: 40,
      spread: 360,
      ticks: 150,
      gravity: 0.1, // Slight drift
      decay: 0.92,
      startVelocity: 20,
      origin: { x: 0.5, y: 0.5 },
      colors: ['#ffffff', '#6610f2'],
      shapes: ['circle', star],
      zIndex: 9998,
    });
  }, 150);
};







/**
 * Decommission Purge (For Delete Success)
 * Particles fall downwards like a system clearing out data.
 */
export const triggerDeletion = async () => {
  const scalar = 2.5;
  const trash = await confetti.shapeFromText({ text: '🗑️', scalar });
  const smoke = await confetti.shapeFromText({ text: '💨', scalar: 1.5 });
  const colors = ['#ef4444', '#f8fafc', '#475569']; // Red, Slate-50, Slate-600

  // 1. The "Drop" Effect
  // Fires from slightly above center and falls down heavy
  confetti({
    particleCount: 60,
    angle: 270,           // Pointing STRAIGHT DOWN
    spread: 90,
    ticks: 150,
    gravity: .5,         // Heavy gravity for a "falling" feel
    startVelocity: 25,    // Low initial push
    origin: { x: 0.5, y: 0.4 }, 
    colors,
    shapes: [trash, smoke, 'circle'],
    zIndex: 9999,
  });

  // 2. The "Dust" Cloud
  // A secondary wider spread to simulate a purge
  setTimeout(() => {
    confetti({
      particleCount: 30,
      angle: 270,
      spread: 180,
      ticks: 100,
      gravity: 0.8,
      origin: { x: 0.5, y: 0.45 },
      colors: ['#cbd5e1', '#f1f5f9'],
      shapes: ['circle'],
      zIndex: 9998,
    });
  }, 100);
};