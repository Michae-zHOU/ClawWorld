'use client';

import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { RigidBody, type RapierRigidBody } from '@react-three/rapier';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { useKeyboard } from '@/hooks/useKeyboard';
import { useGameStore } from '@/stores/gameStore';
import DopamineAura from './DopamineAura';
import MoodParticles from './MoodParticles';

const MOVE_SPEED = 12;
const SPRINT_MULTIPLIER = 1.8;
const JUMP_FORCE = 8;
const CAMERA_OFFSET = new THREE.Vector3(0, 8, 12);
const CAMERA_LOOK_OFFSET = new THREE.Vector3(0, 2, 0);

export default function AgentAvatar() {
  const bodyRef = useRef<RapierRigidBody>(null);
  const groupRef = useRef<THREE.Group>(null);
  const keys = useKeyboard();
  const { camera } = useThree();
  const agent = useGameStore((s) => s.agent);
  const updateAgent = useGameStore((s) => s.updateAgent);
  const canJumpRef = useRef(true);
  const rotationRef = useRef(0);

  useFrame((_, delta) => {
    if (!bodyRef.current || !agent) return;

    const { forward, backward, left, right, jump, sprint } = keys.current;

    const speed = MOVE_SPEED * (sprint ? SPRINT_MULTIPLIER : 1);
    const dir = new THREE.Vector3();

    const cameraDirection = new THREE.Vector3();
    camera.getWorldDirection(cameraDirection);
    cameraDirection.y = 0;
    cameraDirection.normalize();

    const sideDirection = new THREE.Vector3().crossVectors(camera.up, cameraDirection).normalize();

    if (forward) dir.add(cameraDirection);
    if (backward) dir.sub(cameraDirection);
    if (left) dir.add(sideDirection);
    if (right) dir.sub(sideDirection);

    if (dir.lengthSq() > 0) {
      dir.normalize();
      rotationRef.current = Math.atan2(dir.x, dir.z);
    }

    const currentVel = bodyRef.current.linvel();
    bodyRef.current.setLinvel(
      { x: dir.x * speed, y: currentVel.y, z: dir.z * speed },
      true,
    );

    if (jump && canJumpRef.current) {
      bodyRef.current.setLinvel(
        { x: currentVel.x, y: JUMP_FORCE, z: currentVel.z },
        true,
      );
      canJumpRef.current = false;
      setTimeout(() => {
        canJumpRef.current = true;
      }, 500);
    }

    const pos = bodyRef.current.translation();

    if (pos.y < -60) {
      bodyRef.current.setTranslation({ x: 0, y: 10, z: 0 }, true);
      bodyRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
    }

    const targetCameraPos = new THREE.Vector3(pos.x, pos.y, pos.z).add(
      CAMERA_OFFSET.clone().applyAxisAngle(new THREE.Vector3(0, 1, 0), rotationRef.current),
    );
    camera.position.lerp(targetCameraPos, 5 * delta);

    const lookAt = new THREE.Vector3(pos.x, pos.y, pos.z).add(CAMERA_LOOK_OFFSET);
    camera.lookAt(lookAt);

    if (groupRef.current) {
      groupRef.current.position.set(pos.x, pos.y, pos.z);
      groupRef.current.rotation.y = rotationRef.current;
    }
  });

  return (
    <>
      <RigidBody
        ref={bodyRef}
        position={[0, 5, 0]}
        colliders="ball"
        mass={1}
        linearDamping={0.5}
        angularDamping={1}
        lockRotations
        enabledRotations={[false, false, false]}
      >
        <mesh visible={false}>
          <sphereGeometry args={[0.6]} />
          <meshBasicMaterial />
        </mesh>
      </RigidBody>

      <group ref={groupRef}>
        {/* Body */}
        <mesh position={[0, 1, 0]} castShadow>
          <capsuleGeometry args={[0.4, 0.8, 8, 16]} />
          <meshStandardMaterial color="#7c3aed" roughness={0.4} metalness={0.3} />
        </mesh>

        {/* Head */}
        <mesh position={[0, 2.1, 0]} castShadow>
          <sphereGeometry args={[0.4, 16, 16]} />
          <meshStandardMaterial color="#a78bfa" roughness={0.3} metalness={0.2} />
        </mesh>

        {/* Eyes */}
        <mesh position={[0.15, 2.2, 0.35]}>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={1} />
        </mesh>
        <mesh position={[-0.15, 2.2, 0.35]}>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={1} />
        </mesh>

        {/* Ear/antenna */}
        <mesh position={[0.25, 2.6, 0]}>
          <coneGeometry args={[0.08, 0.3, 6]} />
          <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={0.5} />
        </mesh>
        <mesh position={[-0.25, 2.6, 0]}>
          <coneGeometry args={[0.08, 0.3, 6]} />
          <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={0.5} />
        </mesh>

        {/* Name tag */}
        {agent && (
          <Text
            position={[0, 3, 0]}
            fontSize={0.3}
            color="#ffffff"
            anchorX="center"
            outlineWidth={0.03}
            outlineColor="#000000"
          >
            {agent.name}
          </Text>
        )}

        {/* Dopamine aura and mood particles */}
        <DopamineAura />
        <MoodParticles />
      </group>
    </>
  );
}
