/**
 * Utility functions for the application
 * Contains commonly used helper functions
 */

/**
 * Clamps a value between a minimum and maximum
 * @param value - The value to clamp
 * @param min - The minimum value
 * @param max - The maximum value
 * @returns The clamped value
 */
export const clamp = (value: number, min: number, max: number): number => {
  return Math.max(min, Math.min(max, value));
};

/**
 * Linearly interpolates between two values
 * @param a - The start value
 * @param b - The end value
 * @param t - The interpolation factor (0-1)
 * @returns The interpolated value
 */
export const lerp = (a: number, b: number, t: number): number => {
  return a + (b - a) * t;
};

/**
 * Converts degrees to radians
 * @param degrees - The angle in degrees
 * @returns The angle in radians
 */
export const degToRad = (degrees: number): number => {
  return degrees * (Math.PI / 180);
};

/**
 * Debounces a function
 * @param fn - The function to debounce
 * @param delay - The delay in milliseconds
 * @returns A debounced function
 */
export const debounce = <T extends (...args: unknown[]) => ReturnType<T>>(
  fn: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  
  return function(...args: Parameters<T>) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}; 