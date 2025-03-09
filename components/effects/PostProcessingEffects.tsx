"use client"

import { Bloom, ChromaticAberration, EffectComposer, Glitch, Noise, Scanline, Vignette } from '@react-three/postprocessing';
import { BlendFunction, GlitchMode } from 'postprocessing';
import { Vector2 } from 'three';

/**
 * PostProcessingEffects component
 * 
 * Encapsulates all post-processing visual effects for the scene.
 * Includes bloom for neon glow, chromatic aberration, film grain, vignette,
 * scanlines, and occasional glitch effects for a cyberpunk aesthetic.
 * 
 * @returns JSX.Element - The rendered component with all effects
 */
export const PostProcessingEffects = () => {
  return (
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
  );
}; 