"use client"

import { Center, Float, Text3D } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { Group } from 'three';
import { PRIMARY_GLOW_MATERIAL, SECONDARY_GLOW_MATERIAL } from '../../constants/materials';

/**
 * Title component
 * 
 * Renders the main title with animated floating 3D text.
 * Consists of a primary title (SNNB) and a secondary title (HACKATHON).
 * Both texts are animated with different floating animations for visual interest.
 * 
 * @returns JSX.Element - The rendered component
 */
export const Title = () => {
  // References for animation
  const primaryTextRef = useRef<Group>(null);
  const secondaryTextRef = useRef<Group>(null);
  
  // Animate both text elements with slightly different patterns
  useFrame((state) => {
    const elapsedTime = state.clock.getElapsedTime();
    
    // Animate primary title
    if (primaryTextRef.current) {
      // Vertical bobbing motion
      primaryTextRef.current.position.y = Math.sin(elapsedTime) * 0.3 + 2;
      // Subtle rotation
      primaryTextRef.current.rotation.z = Math.sin(elapsedTime * 0.5) * 0.05;
    }
    
    // Animate secondary title with offset phase
    if (secondaryTextRef.current) {
      secondaryTextRef.current.position.y = Math.sin(elapsedTime + 1) * 0.2 - 1;
      secondaryTextRef.current.rotation.z = Math.sin(elapsedTime * 0.3) * 0.03;
    }
  });

  return (
    <>
      {/* Primary title with more pronounced animation */}
      <Float speed={2} rotationIntensity={0.3} floatIntensity={0.8}>
        <Center top>
          <group ref={primaryTextRef}>
            <Text3D
              font="/fonts/PressStart2P.typeface.json"
              size={4}
              height={0.8}
              curveSegments={16}
              bevelEnabled
              bevelThickness={0.2}
              bevelSize={0.04}
              bevelOffset={0}
              bevelSegments={8}
              material={PRIMARY_GLOW_MATERIAL}
            >
              SNNB
            </Text3D>
          </group>
        </Center>
      </Float>

      {/* Secondary title with subtle animation */}
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
        <Center>
          <group ref={secondaryTextRef}>
            <Text3D
              font="/fonts/PressStart2P.typeface.json"
              size={2}
              height={0.3}
              curveSegments={12}
              bevelEnabled
              bevelThickness={0.1}
              bevelSize={0.02}
              bevelOffset={0}
              bevelSegments={5}
              material={SECONDARY_GLOW_MATERIAL}
            >
              HACKATHON
            </Text3D>
          </group>
        </Center>
      </Float>
    </>
  );
}; 