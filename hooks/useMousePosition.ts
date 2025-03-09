/**
 * Custom hook for tracking mouse position
 * Provides normalized coordinates that can be used for interactive effects
 */

import { useEffect, useState } from 'react';

type MousePosition = {
  x: number;
  y: number;
  normalizedX: number; // -1 to 1 (left to right)
  normalizedY: number; // -1 to 1 (top to bottom)
};

/**
 * Hook to track mouse position with normalized values
 * @returns Mouse position object with raw and normalized coordinates
 */
export const useMousePosition = (): MousePosition => {
  const [mousePosition, setMousePosition] = useState<MousePosition>({
    x: 0,
    y: 0,
    normalizedX: 0,
    normalizedY: 0,
  });

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const normalizedX = (clientX / window.innerWidth) * 2 - 1;
      const normalizedY = -(clientY / window.innerHeight) * 2 + 1;
      
      setMousePosition({
        x: clientX,
        y: clientY,
        normalizedX,
        normalizedY,
      });
    };

    window.addEventListener('mousemove', updateMousePosition);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
    };
  }, []);

  return mousePosition;
}; 