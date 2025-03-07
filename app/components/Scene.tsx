"use client"

import { Center, Environment, Float, OrbitControls, PerspectiveCamera, Text3D } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { Bloom, ChromaticAberration, EffectComposer, Glitch, Noise, Scanline, Vignette } from '@react-three/postprocessing';
import { BlendFunction, GlitchMode } from 'postprocessing';
import { Suspense, useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Color, Group, MeshStandardMaterial, Vector2 } from 'three';
import { Particles } from './Particles';

const neonPink = new Color(0xff00ff);
const neonBlue = new Color(0x00ffff);
const neonPurple = new Color(0x9900ff);

// Glowing material for text
const glowMaterial = new MeshStandardMaterial({
  color: neonPink,
  emissive: neonPink,
  emissiveIntensity: 2.5,
  metalness: 0.9,
  roughness: 0.05,
  toneMapped: false,
});

const secondaryGlowMaterial = new MeshStandardMaterial({
  color: neonBlue,
  emissive: neonBlue,
  emissiveIntensity: 1.0,
  metalness: 0.9,
  roughness: 0.05,
  toneMapped: false,
});

// City background component
const CityBackground = () => {
  const cityRef = useRef<Group>(null);
  const gridRef = useRef<Group>(null);
  
  useFrame((state) => {
    if (cityRef.current) {
      cityRef.current.rotation.y = state.clock.getElapsedTime() * 0.04;
    }
    if (gridRef.current) {
      gridRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 0.5) * 2;
      gridRef.current.rotation.z = Math.sin(state.clock.getElapsedTime() * 0.2) * 0.04;
    }
  });

  return (
    <group ref={cityRef} position={[0, -5, -50]}>
      {/* Generate a simple grid to represent a city */}
      <group ref={gridRef}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -10, 0]}>
          <planeGeometry args={[1000, 1000, 70, 70]} />
          <meshStandardMaterial 
            color={neonPurple} 
            wireframe 
            emissive={neonPurple}
            emissiveIntensity={0.6}
            wireframeLinewidth={1.5}
            toneMapped={false}
          />
        </mesh>
        
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -15, 0]}>
          <planeGeometry args={[800, 800, 50, 50]} />
          <meshStandardMaterial 
            color={neonBlue} 
            wireframe 
            emissive={neonBlue}
            emissiveIntensity={0.4}
            wireframeLinewidth={1}
            toneMapped={false}
          />
        </mesh>
      </group>
      
      {/* Generate more random "buildings" with animation */}
      {Array.from({ length: 150 }).map((_, i) => {
        const x = (Math.random() - 0.5) * 300;
        const z = (Math.random() - 0.5) * 300 - 10;
        const height = Math.random() * 30 + 15;
        const isMainBuilding = Math.random() > 0.8;
        const buildingColor = isMainBuilding ? neonPink : (Math.random() > 0.5 ? neonBlue : neonPurple);
        
        return (
          <group key={i} position={[x, height/2 - 10, z]}>
            <mesh>
              <boxGeometry args={[5, height, 5]} />
              <meshStandardMaterial 
                color={buildingColor}
                emissive={buildingColor}
                emissiveIntensity={isMainBuilding ? 0.6 : 0.3}
                wireframe={true}
                transparent
                opacity={0.6}
                toneMapped={false}
              />
            </mesh>
            
            <mesh scale={[0.4, 0.9, 0.4]}>
              <boxGeometry args={[5, height, 5]} />
              <meshStandardMaterial 
                color={buildingColor}
                emissive={buildingColor}
                emissiveIntensity={isMainBuilding ? 1 : 0.4}
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

// Main title component
const Title = () => {
  const textRef = useRef<Group>(null);
  const textRef2 = useRef<Group>(null);
  
  useFrame((state) => {
    if (textRef.current) {
      textRef.current.position.y = Math.sin(state.clock.getElapsedTime()) * 0.3 + 2;
      textRef.current.rotation.z = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.05;
    }
    if (textRef2.current) {
      textRef2.current.position.y = Math.sin(state.clock.getElapsedTime() + 1) * 0.2 - 1;
      textRef2.current.rotation.z = Math.sin(state.clock.getElapsedTime() * 0.3) * 0.03;
    }
  });

  return (
    <>
      <Float speed={2} rotationIntensity={0.3} floatIntensity={0.8}>
        <Center top>
          <group ref={textRef}>
            <Text3D
              font="/fonts/helvetiker_bold.typeface.json"
              size={4}
              height={0.8}
              curveSegments={16}
              bevelEnabled
              bevelThickness={0.2}
              bevelSize={0.04}
              bevelOffset={0}
              bevelSegments={8}
              material={glowMaterial}
            >
              SNNB
            </Text3D>
          </group>
        </Center>
      </Float>

      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
        <Center>
          <group ref={textRef2}>
            <Text3D
              font="/fonts/helvetiker_bold.typeface.json"
              size={2}
              height={0.3}
              curveSegments={12}
              bevelEnabled
              bevelThickness={0.1}
              bevelSize={0.02}
              bevelOffset={0}
              bevelSegments={5}
              material={secondaryGlowMaterial}
            >
              HACKATHON
            </Text3D>
          </group>
        </Center>
      </Float>
    </>
  );
};

// Information panel component
const InfoPanel = () => {
  return (
    <group position={[0, -6, 0]}>
      <mesh position={[0, 0, -1]}>
        <planeGeometry args={[20, 10]} />
        <meshStandardMaterial 
          color={new Color(0x000000)}
          transparent
          opacity={0.7}
        />
      </mesh>
      
      {/* Location Info */}
      <Text3D
        font="/fonts/helvetiker_bold.typeface.json"
        position={[-8, 2, 0]}
        size={0.5}
        height={0.1}
        material={glowMaterial}
      >
        LOCATION: TBD, SHENZHEN?
      </Text3D>
      
      {/* Fee Info */}
      <Text3D
        font="/fonts/helvetiker_bold.typeface.json"
        position={[-8, 0, 0]}
        size={0.5}
        height={0.1}
        material={glowMaterial}
      >
        COST: FREE
      </Text3D>
      
      {/* Prize Info */}
      <Text3D
        font="/fonts/helvetiker_bold.typeface.json"
        position={[-8, -2, 0]}
        size={0.5}
        height={0.1}
        material={glowMaterial}
      >
        PRIZE: SNNB TROPHY
      </Text3D>
      
      {/* Sponsor Info */}
      <Text3D
        font="/fonts/helvetiker_bold.typeface.json"
        position={[-8, -4, 0]}
        size={0.5}
        height={0.1}
        material={secondaryGlowMaterial}
      >
        SPONSORS WELCOME!
      </Text3D>
    </group>
  );
};

// Loading component
const LoadingScreen = ({ progress }: { progress: number }) => {
  return (
    <group position={[0, 0, 0]}>
      {/* Loading text */}
      <Text3D
        font="/fonts/helvetiker_bold.typeface.json"
        position={[-4, 2, 0]}
        size={1.5}
        height={0.2}
        curveSegments={12}
        bevelEnabled
        bevelThickness={0.05}
        bevelSize={0.01}
        material={glowMaterial}
      >
        LOADING
      </Text3D>

      {/* Progress bar background */}
      <mesh position={[0, 0, 0]}>
        <planeGeometry args={[8, 0.4]} />
        <meshStandardMaterial 
          color={new Color(0x000000)}
          emissive={neonPurple}
          emissiveIntensity={0.2}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Progress bar fill */}
      <mesh position={[-4 + (progress / 100 * 4), 0, 0.1]} scale={[progress / 100, 1, 1]}>
        <planeGeometry args={[8, 0.4]} />
        <meshStandardMaterial 
          color={neonPink}
          emissive={neonPink}
          emissiveIntensity={1}
          toneMapped={false}
        />
      </mesh>

      {/* Progress percentage */}
      <Text3D
        font="/fonts/helvetiker_bold.typeface.json"
        position={[-1, -2, 0]}
        size={0.8}
        height={0.1}
        material={secondaryGlowMaterial}
      >
        {`${Math.round(progress)}%`}
      </Text3D>
    </group>
  );
};

// Main Scene component
export const Scene = () => {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [assetsLoaded, setAssetsLoaded] = useState(false);
  const loadingManager = useRef<THREE.LoadingManager>(new THREE.LoadingManager());

  const handleClick = () => {
    window.open('https://x.com/FradSer/status/1897942027305951412', '_blank');
  };

  useEffect(() => {
    // 创建加载管理器
    loadingManager.current = new THREE.LoadingManager(
      // 加载完成回调
      () => {
        setAssetsLoaded(true);
        setLoadingProgress(100);
      },
      // 加载进度回调
      (url: string, itemsLoaded: number, itemsTotal: number) => {
        const progress = (itemsLoaded / itemsTotal) * 100;
        setLoadingProgress(progress);
      },
      // 加载错误回调
      (url: string) => {
        console.error('Error loading:', url);
      }
    );
  }, []);

  return (
    <div 
      className="h-screen w-full cursor-pointer" 
      onClick={handleClick}
      title="Click to view on X/Twitter"
    >
      <Canvas shadows>
        <color attach="background" args={['#000000']} />
        
        <PerspectiveCamera makeDefault position={[0, 15, 20]} fov={50} />
        <OrbitControls 
          enableZoom={false} 
          enablePan={false} 
          maxPolarAngle={Math.PI / 2} 
          minPolarAngle={Math.PI / 2}
          target={[0, 0, 0]}
        />
        
        <ambientLight intensity={0.2} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        
        <Suspense fallback={
          <group>
            <Environment preset="night" />
            <LoadingScreen progress={loadingProgress} />
            <EffectComposer>
              <Bloom 
                luminanceThreshold={0.01}
                luminanceSmoothing={0.9}
                intensity={2.0}
                levels={9}
                mipmapBlur
              />
              <ChromaticAberration 
                offset={[0.002, 0.005]}
                blendFunction={BlendFunction.NORMAL}
              />
              <Glitch
                delay={new Vector2(5, 10)}
                duration={new Vector2(0.2, 0.4)}
                strength={new Vector2(0.02, 0.04)}
                mode={GlitchMode.CONSTANT_MILD}
                active
                ratio={0.2}
              />
            </EffectComposer>
          </group>
        }>
          <Environment 
            files="/environment/machine_shop.hdr"
            background={false}
            blur={0.8}
          />
          {assetsLoaded && (
            <>
              <CityBackground />
              <Title />
              <InfoPanel />
              <Particles count={2000} />
            </>
          )}
          
          {/* Post-processing effects */}
          <EffectComposer>
            {/* Bloom effect for the neon glow */}
            <Bloom 
              luminanceThreshold={0.01}
              luminanceSmoothing={0.9}
              intensity={2.0}
              levels={9}
              mipmapBlur
            />
            
            {/* Color fringing effect */}
            <ChromaticAberration 
              offset={[0.002, 0.005]} 
              blendFunction={BlendFunction.NORMAL}
              radialModulation={true}
              modulationOffset={0.3}
            />
            
            {/* Subtle noise for film grain */}
            <Noise 
              opacity={0.15} 
              blendFunction={BlendFunction.OVERLAY}
            />
            
            {/* Vignette darkens the corners */}
            <Vignette
              offset={0.3}
              darkness={0.7}
              blendFunction={BlendFunction.NORMAL}
            />
            
            {/* Scanlines for CRT effect */}
            <Scanline
              density={2.5}
              opacity={0.05}
              blendFunction={BlendFunction.OVERLAY}
            />
            
            {/* Occasional glitch effect */}
            <Glitch
              delay={new Vector2(2, 5)}
              duration={new Vector2(0.2, 0.4)}
              strength={new Vector2(0.1, 0.4)}
              mode={GlitchMode.SPORADIC}
              active
              ratio={0.6}
            />
          </EffectComposer>
        </Suspense>
      </Canvas>
    </div>
  );
};