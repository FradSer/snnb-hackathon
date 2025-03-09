/**
 * Color constants for the cyberpunk theme
 * These colors are used throughout the application for consistent styling
 */
import { Color, MeshStandardMaterial } from 'three';

// Base neon colors
export const NEON_PINK = new Color(0xff00ff);
export const NEON_BLUE = new Color(0x00ffff);
export const NEON_PURPLE = new Color(0x9900ff);

/**
 * Primary glow material for main text elements
 * High emissive intensity for strong visual impact
 */
export const PRIMARY_GLOW_MATERIAL = new MeshStandardMaterial({
  color: NEON_PINK,
  emissive: NEON_PINK,
  emissiveIntensity: 2.5,
  metalness: 0.9,
  roughness: 0.05,
  toneMapped: false,
});

/**
 * Secondary glow material for supporting text elements
 * Slightly lower intensity than primary for visual hierarchy
 */
export const SECONDARY_GLOW_MATERIAL = new MeshStandardMaterial({
  color: NEON_BLUE,
  emissive: NEON_BLUE,
  emissiveIntensity: 1.0,
  metalness: 0.9,
  roughness: 0.05,
  toneMapped: false,
}); 