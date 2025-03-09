"use client"

import { Environment, OrbitControls, PerspectiveCamera, useProgress } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { Suspense, useEffect, useState } from 'react';
import { Particles } from '../effects/Particles';
import { PostProcessingEffects } from '../effects/PostProcessingEffects';
import { CityBackground } from '../models/CityBackground';
import { Title } from '../models/Title';
import { InfoPanel } from '../ui/InfoPanel';
import { LoadingScreen, Preloader } from '../ui/LoadingScreen';

/**
 * Main Scene component
 * 
 * Orchestrates all visual elements and manages the loading state.
 * Provides scene setup including camera, lighting, and event handlers.
 * Controls the rendering sequence based on loading state.
 * 
 * @returns JSX.Element - The complete 3D scene
 */
export const Scene = () => {
  const { active, progress } = useProgress();
  const [loading, setLoading] = useState(true);
  
  /**
   * Monitor loading progress and update scene state
   * Applies a small delay after loading completes for smooth transition
   */
  useEffect(() => {
    console.log(`Main scene loading status: progress=${progress}, active=${active}`);
    
    // Update loading state when progress reaches 100% and loading is no longer active
    if (!active && progress >= 100 && loading) {
      // Add delay for better visual transition
      const timer = setTimeout(() => {
        console.log('Loading complete, switching to main scene');
        setLoading(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [active, progress, loading]);

  /**
   * Handle click events on the scene
   * Opens the project link in a new browser tab
   */
  const handleClick = () => {
    window.open('https://x.com/FradSer/status/1897942027305951412', '_blank');
  };

  return (
    <div 
      className="h-screen w-full cursor-pointer" 
      onClick={handleClick}
      title="Click to view on X/Twitter"
      style={{ background: "#000" }} // Ensure black background
    >
      {/* Initial HTML loading indicator - displays before Canvas initializes */}
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
        {/* Set black background */}
        <color attach="background" args={['#000000']} />
        
        {/* Initialize loading early */}
        <Preloader />
        
        {/* Camera and controls setup */}
        <PerspectiveCamera makeDefault position={[0, 15, 20]} fov={50} />
        <OrbitControls 
          enableZoom={false} 
          enablePan={false} 
          maxPolarAngle={Math.PI / 2} 
          minPolarAngle={Math.PI / 2}
          target={[0, 0, 0]}
        />
        
        {/* Scene lighting */}
        <ambientLight intensity={0.2} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        
        {/* Content with suspense for asynchronous loading */}
        <Suspense fallback={<LoadingScreen />}>
          {/* Environment map for reflections */}
          <Environment 
            files="/environment/machine_shop.hdr"
            background={false}
            blur={0.8}
          />
          
          {/* Main scene content - only shown when loading completes */}
          {!loading && (
            <>
              <CityBackground />
              <Title />
              <InfoPanel />
              <Particles count={2000} />
              
              {/* Visual effects */}
              <PostProcessingEffects />
            </>
          )}
        </Suspense>
        
        {/* Always show loading screen during loading */}
        {loading && <LoadingScreen />}
      </Canvas>
    </div>
  );
};