'use client';

import React, { useState, useEffect, useCallback, useRef, useContext } from 'react';
import confetti from 'canvas-confetti';
import { RadialMenuPresentational } from './radial-menu-presentational';
import { MenuItem, Position } from './types';
import { SocketContext } from '@/contexts/socketio';
import { Heart, Laugh, CircleAlert, Frown, Ban, Flame } from 'lucide-react';

// Define our menu items with SVG icons
const MENU_ITEMS: MenuItem[] = [
  { id: 'love', icon: <Heart size={22} />, svgPath: 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z', label: 'Love', color: '#ef4444' },
  { id: 'laugh', icon: <Laugh size={22} />, svgPath: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5-6c.78 2.34 2.94 4 5.5 4s4.72-1.66 5.5-4H7z', label: 'Haha', color: '#fbbf24' },
  { id: 'wow', icon: <CircleAlert size={22} />, svgPath: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z', label: 'Wow', color: '#3b82f6' },
  { id: 'sad', icon: <Frown size={22} />, svgPath: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5-4.5c.78-2.34 2.94-4 5.5-4s4.72 1.66 5.5 4H7z', label: 'Sad', color: '#60a5fa' },
  { id: 'angry', icon: <Ban size={22} />, svgPath: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM4 12c0-4.42 3.58-8 8-8 1.85 0 3.55.63 4.9 1.69L5.69 16.9A7.902 7.902 0 0 1 4 12zm8 8c-1.85 0-3.55-.63-4.9-1.69L18.31 7.1A7.902 7.902 0 0 1 20 12c0 4.42-3.58 8-8 8z', label: 'Angry', color: '#f97316' },
  { id: 'fire', icon: <Flame size={22} />, svgPath: 'M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67z', label: 'Lit', color: '#f59e0b' },
];

const DEAD_ZONE = 20; // Radius where nothing is selected
const HOLD_DELAY = 0; // ms to hold right click before opening menu

export default function RadialMenu() {
  const { socket } = useContext(SocketContext);
  const [isOpen, setIsOpen] = useState(false);
  const [menuPos, setMenuPos] = useState<Position>({ x: 0, y: 0 });
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // Refs
  const isOpenRef = useRef(false);
  const menuPosRef = useRef<Position>({ x: 0, y: 0 });
  const activeIndexRef = useRef<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const suppressMenuRef = useRef(false);

  // Track our own triggers to ignore echos
  const myTriggersRef = useRef<Set<string>>(new Set());

  // Sync refs
  useEffect(() => {
    isOpenRef.current = isOpen;
    menuPosRef.current = menuPos;
    activeIndexRef.current = activeIndex;
  }, [isOpen, menuPos, activeIndex]);

  // Handle Confetti
  const fireConfetti = useCallback((pageX: number, pageY: number, svgPath: string, color: string) => {
    // Normalize coordinates relative to the viewport
    const normalizedX = (pageX - window.scrollX) / window.innerWidth;
    const normalizedY = (pageY - window.scrollY) / window.innerHeight;

    // Fire multiple bursts with different scalar values for random sizes
    const count = 5;

    for (let i = 0; i < count; i++) {
      const scalar = 1.5 + Math.random() * 5;
      const shape = confetti.shapeFromPath({ path: svgPath });

      confetti({
        particleCount: 15,
        spread: 60 + Math.random() * 20,
        origin: { x: normalizedX, y: normalizedY },
        shapes: [shape],
        colors: [color],
        scalar,
        disableForReducedMotion: true,
        zIndex: 9999,
        startVelocity: 25 + Math.random() * 10,
        gravity: 0.6 + Math.random() * 0.4,
        drift: (Math.random() - 0.5) * 0.5,
      });
    }
  }, []);

  const triggerConfetti = (x: number, y: number, item: MenuItem) => {
    // 1. Trigger Locally using Page Coordinates
    fireConfetti(x, y, item.svgPath, item.color);
  };

  // Listen for remote confetti
  useEffect(() => {
    if (!socket) return;

    const handleConfettiReceive = (data: { id: string; svgPath: string; color: string; x: number; y: number }) => {
      // Ignore if it's our own
      if (myTriggersRef.current.has(data.id)) {
        // clean up old IDs
        myTriggersRef.current.delete(data.id);
        return;
      }

      // Received data is in Page Coordinates, fire directly
      fireConfetti(data.x, data.y, data.svgPath, data.color);
    };

    socket.on("confetti-receive", handleConfettiReceive);

    return () => {
      socket.off("confetti-receive", handleConfettiReceive);
    };
  }, [socket, fireConfetti]);

  const handleMouseDown = useCallback((e: MouseEvent) => {
    // Check for Right Click (button 2)
    if (e.button === 2) {
      const pos = { x: e.clientX, y: e.clientY };

      // Start timer
      timerRef.current = setTimeout(() => {
        setMenuPos(pos);
        setIsOpen(true);
        setActiveIndex(null);
        suppressMenuRef.current = true; // Mark as suppressing the context menu
      }, HOLD_DELAY);
    }
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isOpenRef.current) return;

    const currentPos = { x: e.clientX, y: e.clientY };
    const origin = menuPosRef.current;

    const dist = getDistance(origin, currentPos);

    if (dist < DEAD_ZONE) {
      if (activeIndexRef.current !== null) setActiveIndex(null);
      return;
    }

    // Calculate Angle
    const angle = getAngle(origin, currentPos);

    // Use original menu items
    const count = MENU_ITEMS.length;
    const slice = 360 / count / 2; // Half slice for each side of the center line

    // Shift angle so that 0 is at -90deg (North)
    const normalizedAngle = (angle + 90) % 360;

    // Ensure positive modulus
    const positiveAngle = normalizedAngle < 0 ? normalizedAngle + 360 : normalizedAngle;

    // Calculate index based on angle
    const index = Math.floor(positiveAngle / (360 / count));

    if (activeIndexRef.current !== index) {
      setActiveIndex(index);
    }
  }, []);

  const handleMouseUp = useCallback((e: MouseEvent) => {
    // Always clear timer on mouse up
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    // Only care if we are open
    if (isOpenRef.current) {
      // If we have an active selection
      if (activeIndexRef.current !== null) {
        const item = MENU_ITEMS[activeIndexRef.current];
        // Trigger action
        triggerConfetti(e.pageX, e.pageY, item);

        // Broadcast to others
        if (socket) {
          const burstId = `${socket.id}-${Date.now()}-${Math.random()}`;
          myTriggersRef.current.add(burstId);

          // clean up old IDs
          if (myTriggersRef.current.size > 100) {
            myTriggersRef.current.clear();
          }

          socket.emit("confetti-send", {
            id: burstId,
            svgPath: item.svgPath,
            color: item.color,
            x: e.pageX,
            y: e.pageY,
          });
        }
      }

      setIsOpen(false);
      setActiveIndex(null);
    } else {
    }
  }, [triggerConfetti]);

  const handleContextMenu = useCallback((e: MouseEvent) => {
    if (suppressMenuRef.current) {
      e.preventDefault();
      suppressMenuRef.current = false;
    }
  }, []);

  useEffect(() => {
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('contextmenu', handleContextMenu);

    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, [handleMouseDown, handleMouseMove, handleMouseUp, handleContextMenu]);

  return (
    <RadialMenuPresentational
      isOpen={isOpen}
      position={menuPos}
      items={MENU_ITEMS}
      activeIndex={activeIndex}
    />
  );
}

const getDistance = (p1: { x: number; y: number }, p2: { x: number; y: number }) => {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
};

const getAngle = (origin: { x: number; y: number }, target: { x: number; y: number }) => {
  const dx = target.x - origin.x;
  const dy = target.y - origin.y;
  let theta = Math.atan2(dy, dx);
  theta *= 180 / Math.PI; // rads to degs
  return theta;
};
