import { useState, useEffect, useCallback } from 'react';

const MIN_SCALE_LIMIT = 0.1; // Prevent heart from inverting/disappearing
const INITIAL_SCALE = 1.0;

// This hook now uses mouse wheel events to control the heart's scale.
export function useHandGesture() {
  const [scale, setScale] = useState<number>(INITIAL_SCALE);

  const handleWheel = useCallback((event: WheelEvent) => {
    // Prevent the page from scrolling
    event.preventDefault();
    const direction = Math.sign(event.deltaY);
    // scrolling down (positive deltaY) should zoom out (decrease scale)
    // scrolling up (negative deltaY) should zoom in (increase scale)
    const zoomAmount = 0.1;
    setScale(prevScale => {
        const newScale = prevScale - direction * zoomAmount;
        // Remove the max scale limit, but keep a minimum to prevent issues.
        return Math.max(MIN_SCALE_LIMIT, newScale);
    });
  }, []);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === ' ') { // spacebar to reset
        event.preventDefault();
        setScale(INITIAL_SCALE);
    }
  }, []);

  useEffect(() => {
    // We attach the wheel listener to the window
    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleWheel, handleKeyDown]);

  return { scale };
}