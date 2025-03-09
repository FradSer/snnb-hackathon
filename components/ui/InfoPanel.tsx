"use client"

import { Text3D } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { Color, Group } from 'three';
import { PRIMARY_GLOW_MATERIAL, SECONDARY_GLOW_MATERIAL } from '../../constants/materials';
import { useMousePosition } from '../../hooks/useMousePosition';
import { lerp } from '../../lib/utils';

/**
 * Event detail entry type for information items
 */
interface EventDetailItem {
  label: string;
  value: string;
  useSecondaryStyle?: boolean;
}

/**
 * InfoPanel component
 * 
 * Displays key information about the hackathon event in a panel format.
 * Shows details like location, cost, prizes, and sponsorship information.
 * The panel interacts with mouse movement, creating a dynamic 3D effect.
 * 
 * @returns JSX.Element - The rendered component
 */
export const InfoPanel = () => {
  // Reference to the group for animation
  const groupRef = useRef<Group>(null);
  
  // Get mouse position using custom hook
  const mousePosition = useMousePosition();
  
  // Event details configuration
  const eventDetails: EventDetailItem[] = [
    { label: "LOCATION", value: "TBD, SHENZHEN?" },
    { label: "COST", value: "FREE" },
    { label: "PRIZE", value: "SNNB TROPHY" },
    { label: "SPONSORS", value: "WELCOME!", useSecondaryStyle: true }
  ];

  // Animate the panel based on mouse position
  useFrame(() => {
    if (groupRef.current) {
      // Create subtle tilt effect based on mouse position
      // Apply smooth interpolation for natural movement
      groupRef.current.rotation.y = lerp(
        groupRef.current.rotation.y,
        mousePosition.normalizedX * 0.2,
        0.05
      );
      
      groupRef.current.rotation.x = lerp(
        groupRef.current.rotation.x,
        -mousePosition.normalizedY * 0.1,
        0.05
      );
      
      // Subtle position shift based on mouse
      groupRef.current.position.x = lerp(
        groupRef.current.position.x,
        mousePosition.normalizedX * 0.5,
        0.02
      );
    }
  });

  return (
    <group position={[0, -6, 0]} ref={groupRef}>
      {/* Semi-transparent background panel with subtle glow */}
      <mesh position={[0, 0, -1]}>
        <planeGeometry args={[20, 10]} />
        <meshStandardMaterial 
          color={new Color(0x000000)}
          transparent
          opacity={0.7}
          emissive={new Color(0x222222)}
          emissiveIntensity={0.2}
        />
      </mesh>
      
      {/* Render each event detail item */}
      {eventDetails.map((detail, index) => (
        <Text3D
          key={detail.label}
          font="/fonts/PressStart2P.typeface.json"
          position={[-8, 2 - index * 2, 0]}
          size={0.5}
          height={0.1}
          material={detail.useSecondaryStyle ? SECONDARY_GLOW_MATERIAL : PRIMARY_GLOW_MATERIAL}
        >
          {`${detail.label}: ${detail.value}`}
        </Text3D>
      ))}
    </group>
  );
}; 