"use client"

import { Float, Text3D, useProgress } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';
import { Color, Group } from 'three';
import { NEON_PINK, NEON_PURPLE, PRIMARY_GLOW_MATERIAL, SECONDARY_GLOW_MATERIAL } from '../../constants/materials';

/**
 * Preloader component
 * 
 * Initializes the loading process as early as possible.
 * This component doesn't render anything visible but ensures
 * resources start loading immediately.
 * 
 * @returns null
 */
export const Preloader = () => {
  // Initialize loading tracker
  useProgress();
  
  return null;
};

/**
 * LoadingScreen component
 * 
 * Displays a visually appealing loading screen with progress information.
 * Shows a progress bar, percentage, and currently loading item name.
 * Includes animations to maintain visual interest during loading.
 * 
 * @returns JSX.Element - The rendered component
 */
export const LoadingScreen = () => {
  const { progress, item, errors, active } = useProgress();
  const progressBarRef = useRef<Group>(null);
  const [initialRender, setInitialRender] = useState(true);
  
  // Log loading status for debugging
  useEffect(() => {
    console.log(`Loading status: progress=${progress}, active=${active}, item=${item || 'none'}, allErrors=${JSON.stringify(errors)}`);
  }, [progress, active, item, errors]);
  
  // Add a short delay before showing the full loading UI
  useEffect(() => {
    const timer = setTimeout(() => {
      setInitialRender(false);
    }, 300);
    return () => clearTimeout(timer);
  }, []);
  
  // Animate the progress bar
  useFrame((state) => {
    if (progressBarRef.current) {
      // Add subtle floating animation
      progressBarRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 2) * 0.1;
      
      // Scale the progress bar based on loading progress
      // Ensure minimum width for visibility
      const normalizedProgress = progress < 5 ? 5 : progress;
      progressBarRef.current.scale.x = Math.max(0.05, normalizedProgress / 100);
    }
  });
  
  // Show minimal loading indicator during initial render
  if (initialRender) {
    return (
      <group position={[0, 0, 0]}>
        <Text3D
          font="/fonts/helvetiker_bold.typeface.json"
          position={[-4, 0, 0]}
          size={1.5}
          height={0.2}
          material={PRIMARY_GLOW_MATERIAL}
        >
          LOADING...
        </Text3D>
      </group>
    );
  }
  
  return (
    <group position={[0, 0, 0]}>
      {/* Main loading text */}
      <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
        <Text3D
          font="/fonts/helvetiker_bold.typeface.json"
          position={[-4, 2, 0]}
          size={1.5}
          height={0.2}
          curveSegments={12}
          bevelEnabled
          bevelThickness={0.05}
          bevelSize={0.01}
          material={PRIMARY_GLOW_MATERIAL}
        >
          LOADING
        </Text3D>
      </Float>

      {/* Display currently loading item name */}
      {item && (
        <Text3D
          font="/fonts/helvetiker_bold.typeface.json"
          position={[-7, -3, 0]}
          size={0.4}
          height={0.05}
          material={SECONDARY_GLOW_MATERIAL}
        >
          {`${item}`}
        </Text3D>
      )}

      {/* Progress bar background */}
      <mesh position={[0, 0, -0.1]}>
        <boxGeometry args={[8.2, 0.6, 0.1]} />
        <meshStandardMaterial 
          color={new Color(0x000000)}
          emissive={NEON_PURPLE}
          emissiveIntensity={0.3}
          transparent
          opacity={0.7}
        />
      </mesh>

      {/* Progress bar track */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[8, 0.4, 0.1]} />
        <meshStandardMaterial 
          color={new Color(0x111111)}
          emissive={NEON_PURPLE}
          emissiveIntensity={0.2}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Dynamic progress bar fill */}
      <group ref={progressBarRef} position={[-4, 0, 0.1]}>
        <mesh scale={[1, 1, 1]}>
          <boxGeometry args={[8, 0.4, 0.2]} />
          <meshStandardMaterial 
            color={NEON_PINK}
            emissive={NEON_PINK}
            emissiveIntensity={1.5}
            toneMapped={false}
          />
        </mesh>
        
        {/* Highlight effect on the progress bar edge */}
        <mesh position={[4, 0, 0.1]} scale={[0.1, 0.8, 1]}>
          <boxGeometry args={[1, 0.4, 0.1]} />
          <meshStandardMaterial 
            color={new Color(0xffffff)}
            emissive={new Color(0xffffff)}
            emissiveIntensity={2}
            transparent
            opacity={0.8}
            toneMapped={false}
          />
        </mesh>
      </group>

      {/* Progress percentage display */}
      <Float speed={3} rotationIntensity={0.1} floatIntensity={0.3}>
        <Text3D
          font="/fonts/helvetiker_bold.typeface.json"
          position={[-1, -2, 0]}
          size={0.8}
          height={0.1}
          material={SECONDARY_GLOW_MATERIAL}
        >
          {`${Math.round(progress)}%`}
        </Text3D>
      </Float>
    </group>
  );
}; 