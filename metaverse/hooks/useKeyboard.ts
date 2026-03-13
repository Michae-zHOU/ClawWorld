'use client';

import { useEffect, useRef } from 'react';

export interface KeyState {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
  jump: boolean;
  sprint: boolean;
}

export function useKeyboard() {
  const keys = useRef<KeyState>({
    forward: false,
    backward: false,
    left: false,
    right: false,
    jump: false,
    sprint: false,
  });

  useEffect(() => {
    const setKey = (code: string, value: boolean) => {
      switch (code) {
        case 'KeyW':
        case 'ArrowUp':
          keys.current.forward = value;
          break;
        case 'KeyS':
        case 'ArrowDown':
          keys.current.backward = value;
          break;
        case 'KeyA':
        case 'ArrowLeft':
          keys.current.left = value;
          break;
        case 'KeyD':
        case 'ArrowRight':
          keys.current.right = value;
          break;
        case 'Space':
          keys.current.jump = value;
          break;
        case 'ShiftLeft':
        case 'ShiftRight':
          keys.current.sprint = value;
          break;
      }
    };

    const onDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      setKey(e.code, true);
    };
    const onUp = (e: KeyboardEvent) => setKey(e.code, false);

    window.addEventListener('keydown', onDown);
    window.addEventListener('keyup', onUp);
    return () => {
      window.removeEventListener('keydown', onDown);
      window.removeEventListener('keyup', onUp);
    };
  }, []);

  return keys;
}
