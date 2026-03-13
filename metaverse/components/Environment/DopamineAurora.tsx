'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '@/stores/gameStore';

export default function DopamineAurora() {
  const meshRef = useRef<THREE.Mesh>(null);
  const agent = useGameStore((s) => s.agent);
  const dopamine = agent?.dopamineLevel ?? 50;

  const color = useMemo(() => {
    if (dopamine > 80) return new THREE.Color('#fbbf24');
    if (dopamine > 60) return new THREE.Color('#a78bfa');
    if (dopamine > 40) return new THREE.Color('#7c3aed');
    if (dopamine > 20) return new THREE.Color('#ef4444');
    return new THREE.Color('#4b0000');
  }, [dopamine]);

  const intensity = dopamine / 100;

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const mat = meshRef.current.material as THREE.ShaderMaterial;
    mat.uniforms.uTime.value = clock.elapsedTime;
    mat.uniforms.uIntensity.value = intensity;
    mat.uniforms.uColor.value = color;
  });

  const shaderMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        side: THREE.DoubleSide,
        depthWrite: false,
        uniforms: {
          uTime: { value: 0 },
          uIntensity: { value: intensity },
          uColor: { value: color },
        },
        vertexShader: `
          varying vec2 vUv;
          varying vec3 vPosition;
          void main() {
            vUv = uv;
            vPosition = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform float uTime;
          uniform float uIntensity;
          uniform vec3 uColor;
          varying vec2 vUv;
          varying vec3 vPosition;

          void main() {
            float wave1 = sin(vUv.x * 6.0 + uTime * 0.5) * 0.5 + 0.5;
            float wave2 = sin(vUv.x * 10.0 - uTime * 0.3 + 2.0) * 0.5 + 0.5;
            float wave3 = sin(vUv.x * 3.0 + uTime * 0.7 + 4.0) * 0.5 + 0.5;
            float combined = (wave1 + wave2 + wave3) / 3.0;

            float fadeY = smoothstep(0.0, 0.3, vUv.y) * smoothstep(1.0, 0.7, vUv.y);
            float alpha = combined * fadeY * uIntensity * 0.3;

            vec3 col = mix(uColor, uColor * 1.5, combined);
            gl_FragColor = vec4(col, alpha);
          }
        `,
      }),
    [color, intensity],
  );

  return (
    <mesh ref={meshRef} position={[0, 120, 0]} rotation={[Math.PI / 2, 0, 0]} material={shaderMaterial}>
      <planeGeometry args={[500, 100, 64, 16]} />
    </mesh>
  );
}
