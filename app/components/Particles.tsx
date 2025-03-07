"use client"

import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { Color, MathUtils } from 'three';

// Particle system component that creates a "synthwave" or "digital rain" effect
export const Particles = ({ count = 1000 }) => {
  const mesh = useRef<THREE.Points>(null);
  
  // Create particles with random positions
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const time = Math.random() * 100;
      const factor = 20 + Math.random() * 100;
      const speed = 0.01 + Math.random() / 100; // 加快粒子速度
      const x = MathUtils.randFloatSpread(400); // 增加粒子分布范围
      const y = MathUtils.randFloatSpread(400);
      const z = MathUtils.randFloatSpread(400);
      
      temp.push({ time, factor, speed, x, y, z });
    }
    return temp;
  }, [count]);
  
  // Create particle geometry
  const particlesGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    
    // Define neon colors for particles - 更鲜艳更亮的赛博朋克颜色
    const color1 = new Color(0xff40ff); // 增亮的霓虹粉
    const color2 = new Color(0x40ffff); // 增亮的霓虹青
    const color3 = new Color(0xff4040); // 增亮的霓虹红
    const color4 = new Color(0xffff40); // 增亮的霓虹黄
    const color5 = new Color(0x40ff40); // 增亮的霓虹绿
    
    const colorChoices = [color1, color2, color3, color4, color5];
    
    particles.forEach((particle, i) => {
      const i3 = i * 3;
      positions[i3] = particle.x;
      positions[i3 + 1] = particle.y;
      positions[i3 + 2] = particle.z;
      
      // Assign random colors to particles
      const colorIndex = Math.floor(Math.random() * colorChoices.length);
      const color = colorChoices[colorIndex];
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;
      
      // 增大粒子尺寸范围
      sizes[i] = Math.random() * 4 + 1;
    });
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    
    return geometry;
  }, [count, particles]);
  
  // Animation for particles
  useFrame((state) => {
    if (!mesh.current) return;
    
    const positions = mesh.current.geometry.attributes.position.array as Float32Array;
    
    particles.forEach((particle, i) => {
      const i3 = i * 3;
      
      // Time-based animation
      const t = particle.time + state.clock.elapsedTime * particle.speed;
      
      // Update y position to create falling effect
      positions[i3 + 1] -= particle.speed * 15; // 加快下落速度
      
      // 添加轻微的水平摆动
      positions[i3] += Math.sin(t) * 0.1;
      
      // Reset particle position when it goes too far down
      if (positions[i3 + 1] < -200) {
        positions[i3 + 1] = 200;
        positions[i3] = MathUtils.randFloatSpread(400); // 重置时随机X位置
        positions[i3 + 2] = MathUtils.randFloatSpread(400); // 重置时随机Z位置
      }
    });
    
    mesh.current.geometry.attributes.position.needsUpdate = true;
  });
  
  return (
    <points ref={mesh} geometry={particlesGeometry}>
      <pointsMaterial 
        size={2.0}  // 增大基础粒子尺寸
        vertexColors 
        transparent 
        opacity={1.0}  // 提高不透明度到最大
        sizeAttenuation 
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}; 