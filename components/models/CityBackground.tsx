"use client"

import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { Group } from 'three';
import { NEON_BLUE, NEON_PINK, NEON_PURPLE } from '../../constants/materials';

/**
 * CityBackground component
 * 
 * Renders a cyberpunk-style city grid with animated buildings in the background.
 * Uses wireframe materials and neon colors to create a retro-futuristic aesthetic.
 * 
 * @returns JSX.Element - The rendered component
 */
export const CityBackground = () => {
  // References for animation
  const cityRef = useRef<Group>(null);
  const gridRef = useRef<Group>(null);
  
  // Animate the city and grid
  useFrame((state) => {
    if (cityRef.current) {
      // Slowly rotate the entire city for dynamic effect
      cityRef.current.rotation.y = state.clock.getElapsedTime() * 0.04;
    }
    if (gridRef.current) {
      // Wave-like animation for the grid planes
      gridRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 0.5) * 2;
      gridRef.current.rotation.z = Math.sin(state.clock.getElapsedTime() * 0.2) * 0.04;
    }
  });

  // Number of random buildings to generate
  const BUILDING_COUNT = 150;

  return (
    <group ref={cityRef} position={[0, -5, -50]}>
      {/* Grid planes representing the city foundation */}
      <group ref={gridRef}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -10, 0]}>
          <planeGeometry args={[1000, 1000, 70, 70]} />
          <meshStandardMaterial 
            color={NEON_PURPLE} 
            wireframe 
            emissive={NEON_PURPLE}
            emissiveIntensity={0.6}
            wireframeLinewidth={1.5}
            toneMapped={false}
          />
        </mesh>
        
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -15, 0]}>
          <planeGeometry args={[800, 800, 50, 50]} />
          <meshStandardMaterial 
            color={NEON_BLUE} 
            wireframe 
            emissive={NEON_BLUE}
            emissiveIntensity={0.4}
            wireframeLinewidth={1}
            toneMapped={false}
          />
        </mesh>
      </group>
      
      {/* Randomly generated buildings */}
      {Array.from({ length: BUILDING_COUNT }).map((_, i) => {
        // Random positioning and height
        const x = (Math.random() - 0.5) * 300;
        const z = (Math.random() - 0.5) * 300 - 10;
        const height = Math.random() * 30 + 15;
        
        // Determine if this is a "landmark" building with brighter colors
        const isLandmarkBuilding = Math.random() > 0.8;
        
        // Select color based on building type
        const buildingColor = isLandmarkBuilding ? 
          NEON_PINK : (Math.random() > 0.5 ? NEON_BLUE : NEON_PURPLE);
        
        return (
          <group key={i} position={[x, height/2 - 10, z]}>
            {/* Outer wireframe structure */}
            <mesh>
              <boxGeometry args={[5, height, 5]} />
              <meshStandardMaterial 
                color={buildingColor}
                emissive={buildingColor}
                emissiveIntensity={isLandmarkBuilding ? 0.6 : 0.3}
                wireframe={true}
                transparent
                opacity={0.6}
                toneMapped={false}
              />
            </mesh>
            
            {/* Inner solid structure */}
            <mesh scale={[0.4, 0.9, 0.4]}>
              <boxGeometry args={[5, height, 5]} />
              <meshStandardMaterial 
                color={buildingColor}
                emissive={buildingColor}
                emissiveIntensity={isLandmarkBuilding ? 1 : 0.4}
                transparent
                opacity={0.4}
                toneMapped={false}
              />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}; 