"use client"

import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { Color, MathUtils } from 'three';

/**
 * Particles component
 * 
 * Creates a synthwave/cyberpunk particle system with colorful neon particles.
 * Particles fall with a gentle swaying motion and reset when they reach the bottom.
 * Uses additive blending for a glowing effect.
 * 
 * @param {Object} props - Component props
 * @param {number} props.count - Number of particles to render (default: 1000)
 * @returns {JSX.Element} - The rendered particle system
 */
export const Particles = ({ count = 1000 }) => {
  const mesh = useRef<THREE.Points>(null);
  
  // Define neon colors for particles
  const NEON_COLORS = useMemo(() => [
    new Color(0xff40ff), // Bright neon pink
    new Color(0x40ffff), // Bright neon cyan
    new Color(0xff4040), // Bright neon red
    new Color(0xffff40), // Bright neon yellow
    new Color(0x40ff40), // Bright neon green
  ], []);
  
  // Create particles with random positions and properties
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const time = Math.random() * 100;
      const factor = 20 + Math.random() * 100;
      const speed = 0.01 + Math.random() / 100; // Particle fall speed
      const x = MathUtils.randFloatSpread(400); // Wide distribution range
      const y = MathUtils.randFloatSpread(400);
      const z = MathUtils.randFloatSpread(400);
      
      temp.push({ time, factor, speed, x, y, z });
    }
    return temp;
  }, [count]);
  
  // Create particle geometry with positions, colors and sizes
  const particlesGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    
    particles.forEach((particle, i) => {
      const i3 = i * 3;
      
      // Set initial positions
      positions[i3] = particle.x;
      positions[i3 + 1] = particle.y;
      positions[i3 + 2] = particle.z;
      
      // Assign random colors from the neon palette
      const colorIndex = Math.floor(Math.random() * NEON_COLORS.length);
      const color = NEON_COLORS[colorIndex];
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;
      
      // Varied particle sizes for visual interest
      sizes[i] = Math.random() * 4 + 1;
    });
    
    // Set attributes on the geometry
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    
    return geometry;
  }, [count, particles, NEON_COLORS]);
  
  // Animate particles on each frame
  useFrame((state) => {
    if (!mesh.current) return;
    
    const positions = mesh.current.geometry.attributes.position.array as Float32Array;
    
    // Update each particle position
    particles.forEach((particle, i) => {
      const i3 = i * 3;
      
      // Time-based animation
      const t = particle.time + state.clock.elapsedTime * particle.speed;
      
      // Update y position to create falling effect
      positions[i3 + 1] -= particle.speed * 15;
      
      // Add gentle horizontal swaying
      positions[i3] += Math.sin(t) * 0.1;
      
      // Reset particle position when it falls out of view
      if (positions[i3 + 1] < -200) {
        positions[i3 + 1] = 200; // Reset to top
        positions[i3] = MathUtils.randFloatSpread(400); // Random X on reset
        positions[i3 + 2] = MathUtils.randFloatSpread(400); // Random Z on reset
      }
    });
    
    // Flag the position attribute for update
    mesh.current.geometry.attributes.position.needsUpdate = true;
  });
  
  return (
    <points ref={mesh} geometry={particlesGeometry}>
      <pointsMaterial 
        size={2.0}
        vertexColors 
        transparent 
        opacity={1.0}
        sizeAttenuation 
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}; 