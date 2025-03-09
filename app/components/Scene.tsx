"use client"

import { Center, Environment, Float, OrbitControls, PerspectiveCamera, Text3D, useProgress } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { Bloom, ChromaticAberration, EffectComposer, Glitch, Noise, Scanline, Vignette } from '@react-three/postprocessing';
import { BlendFunction, GlitchMode } from 'postprocessing';
import { Suspense, useEffect, useRef, useState } from 'react';
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

// Enhanced loading component with realistic progress
const LoadingScreen = () => {
  const { progress, item, errors, active } = useProgress();
  const progressRef = useRef<Group>(null);
  const [initialRender, setInitialRender] = useState(true);
  
  // 打印加载状态信息，用于调试，添加更多详细信息
  useEffect(() => {
    console.log(`Loading status: progress=${progress}, active=${active}, item=${item || 'none'}, allErrors=${JSON.stringify(errors)}`);
  }, [progress, active, item, errors]);
  
  // 在第一次渲染后添加延迟切换，确保组件有足够时间初始化
  useEffect(() => {
    const timer = setTimeout(() => {
      setInitialRender(false);
    }, 300);
    return () => clearTimeout(timer);
  }, []);
  
  // Animate the progress bar
  useFrame((state) => {
    if (progressRef.current) {
      // Add subtle floating animation
      progressRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 2) * 0.1;
      
      // Scale effect based on loading progress - 确保进度条有初始宽度
      const normalizedProgress = progress < 5 ? 5 : progress; // 提供最小显示宽度
      progressRef.current.scale.x = Math.max(0.05, normalizedProgress / 100);
    }
  });
  
  // 简化初始渲染
  if (initialRender) {
    return (
      <group position={[0, 0, 0]}>
        <Text3D
          font="/fonts/helvetiker_bold.typeface.json"
          position={[-4, 0, 0]}
          size={1.5}
          height={0.2}
          material={glowMaterial}
        >
          LOADING...
        </Text3D>
      </group>
    );
  }
  
  return (
    <group position={[0, 0, 0]}>
      {/* Loading text */}
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
          material={glowMaterial}
        >
          LOADING
        </Text3D>
      </Float>

      {/* Currently loading item name */}
      {item && (
        <Text3D
          font="/fonts/helvetiker_bold.typeface.json"
          position={[-7, -3, 0]}
          size={0.4}
          height={0.05}
          material={secondaryGlowMaterial}
        >
          {`${item}`}
        </Text3D>
      )}

      {/* Progress bar background */}
      <mesh position={[0, 0, -0.1]}>
        <boxGeometry args={[8.2, 0.6, 0.1]} />
        <meshStandardMaterial 
          color={new Color(0x000000)}
          emissive={neonPurple}
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
          emissive={neonPurple}
          emissiveIntensity={0.2}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Dynamic progress bar fill */}
      <group ref={progressRef} position={[-4, 0, 0.1]}>
        <mesh scale={[1, 1, 1]}>
          <boxGeometry args={[8, 0.4, 0.2]} />
          <meshStandardMaterial 
            color={neonPink}
            emissive={neonPink}
            emissiveIntensity={1.5}
            toneMapped={false}
          />
        </mesh>
        
        {/* Highlight on the progress bar */}
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

      {/* Progress percentage */}
      <Float speed={3} rotationIntensity={0.1} floatIntensity={0.3}>
        <Text3D
          font="/fonts/helvetiker_bold.typeface.json"
          position={[-1, -2, 0]}
          size={0.8}
          height={0.1}
          material={secondaryGlowMaterial}
        >
          {`${Math.round(progress)}%`}
        </Text3D>
      </Float>
    </group>
  );
};

// 预加载组件，用于确保资源在显示加载进度条前就开始加载
const Preloader = () => {
  // 初始化加载状态
  useProgress();
  
  return null;
};

// Main Scene component
export const Scene = () => {
  const { active, progress } = useProgress();
  const [loading, setLoading] = useState(true);
  
  // 更新加载状态
  useEffect(() => {
    console.log(`Main scene loading status: progress=${progress}, active=${active}`);
    
    // 只有在加载完成且进度到达100%时才更新状态
    if (!active && progress >= 100 && loading) {
      // 添加延迟，确保加载内容有时间完全显示
      const timer = setTimeout(() => {
        console.log('Loading complete, switching to main scene');
        setLoading(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [active, progress, loading]);

  const handleClick = () => {
    window.open('https://x.com/FradSer/status/1897942027305951412', '_blank');
  };

  return (
    <div 
      className="h-screen w-full cursor-pointer" 
      onClick={handleClick}
      title="Click to view on X/Twitter"
      style={{ background: "#000" }} // 确保背景是黑色，避免白屏
    >
      {/* 立即显示初始加载指示器 - 只在加载中显示 */}
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black">
          <div className="text-pink-500 text-2xl font-bold animate-pulse">
            LOADING...
          </div>
        </div>
      )}
      
      <Canvas 
        shadows
        gl={{ 
          powerPreference: 'high-performance',
          alpha: false
        }}
        style={{ 
          opacity: loading ? 0.3 : 1,
          transition: 'opacity 0.5s ease-in' 
        }}
      >
        <color attach="background" args={['#000000']} />
        
        {/* 预加载组件，确保资源在显示加载进度条前开始加载 */}
        <Preloader />
        
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
        
        {/* 加载界面始终显示，以便显示正确的加载进度 */}
        <Suspense fallback={<LoadingScreen />}>
          {/* 先加载重要资源，触发加载进度 */}
          <Environment 
            files="/environment/machine_shop.hdr"
            background={false}
            blur={0.8}
          />
          
          {/* 核心场景内容，只在加载完成后显示 */}
          {!loading && (
            <>
              <CityBackground />
              <Title />
              <InfoPanel />
              <Particles count={2000} />
              
              {/* Post-processing effects - 保留所有原始效果 */}
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
            </>
          )}
        </Suspense>
        
        {/* 始终显示加载进度条，确保用户可以看到进度 */}
        {loading && <LoadingScreen />}
      </Canvas>
    </div>
  );
};