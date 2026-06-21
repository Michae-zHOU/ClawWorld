'use client';

import { useRef } from 'react';
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

const _dir = new THREE.Vector3();
const _camDir = new THREE.Vector3();
const _sideDir = new THREE.Vector3();
const _targetCamPos = new THREE.Vector3();
const _lookAt = new THREE.Vector3();
const _axis = new THREE.Vector3(0, 1, 0);

export default function AgentAvatar() {
  const bodyRef = useRef<RapierRigidBody>(null);
  const groupRef = useRef<THREE.Group>(null);
  const { camera } = useThree();
  const keys = useKeyboard();
  const agent = useGameStore((s) => s.agent);
  const canJumpRef = useRef(true);
  const rotationRef = useRef(0);

  useFrame((_, delta) => {
    if (!bodyRef.current || !agent) return;

    const { forward, backward, left, right, jump, sprint } = keys.current;
    const speed = MOVE_SPEED * (sprint ? SPRINT_MULTIPLIER : 1);

    camera.getWorldDirection(_camDir);
    _camDir.y = 0;
    _camDir.normalize();
    _sideDir.crossVectors(camera.up, _camDir).normalize();

    _dir.set(0, 0, 0);
    if (forward) _dir.add(_camDir);
    if (backward) _dir.sub(_camDir);
    if (left) _dir.add(_sideDir);
    if (right) _dir.sub(_sideDir);

    if (_dir.lengthSq() > 0) {
      _dir.normalize();
      rotationRef.current = Math.atan2(_dir.x, _dir.z);
    }

    const currentVel = bodyRef.current.linvel();
    bodyRef.current.setLinvel(
      { x: _dir.x * speed, y: currentVel.y, z: _dir.z * speed },
      true,
    );

    if (jump && canJumpRef.current) {
      bodyRef.current.setLinvel(
        { x: currentVel.x, y: JUMP_FORCE, z: currentVel.z },
        true,
      );
      canJumpRef.current = false;
      setTimeout(() => { canJumpRef.current = true; }, 500);
    }

    const pos = bodyRef.current.translation();

    if (pos.y < -60) {
      bodyRef.current.setTranslation({ x: 0, y: 10, z: 0 }, true);
      bodyRef.current.setLinvel({ x: 0, y: 0, z: 0 }, true);
    }

    _targetCamPos.copy(CAMERA_OFFSET).applyAxisAngle(_axis, rotationRef.current);
    _targetCamPos.x += pos.x;
    _targetCamPos.y += pos.y;
    _targetCamPos.z += pos.z;
    camera.position.lerp(_targetCamPos, 4 * delta);

    _lookAt.set(pos.x, pos.y + 2, pos.z);
    camera.lookAt(_lookAt);

    if (groupRef.current) {
      groupRef.current.position.set(pos.x, pos.y, pos.z);
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        rotationRef.current,
        10 * delta,
      );
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
        <mesh position={[0, 1, 0]} castShadow>
          <capsuleGeometry args={[0.4, 0.8, 8, 16]} />
          <meshStandardMaterial color="#7c3aed" roughness={0.3} metalness={0.4} envMapIntensity={1.2} />
        </mesh>

        <mesh position={[0, 2.1, 0]} castShadow>
          <sphereGeometry args={[0.4, 12, 12]} />
          <meshStandardMaterial color="#a78bfa" roughness={0.2} metalness={0.3} envMapIntensity={1.2} />
        </mesh>

        <mesh position={[0.15, 2.2, 0.35]}>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={3} />
        </mesh>
        <mesh position={[-0.15, 2.2, 0.35]}>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={3} />
        </mesh>

        <mesh position={[0.25, 2.6, 0]}>
          <coneGeometry args={[0.08, 0.3, 6]} />
          <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={1.5} />
        </mesh>
        <mesh position={[-0.25, 2.6, 0]}>
          <coneGeometry args={[0.08, 0.3, 6]} />
          <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={1.5} />
        </mesh>

        {agent && (
          <Text
            position={[0, 3.2, 0]}
            fontSize={0.3}
            color="#ffffff"
            anchorX="center"
            outlineWidth={0.03}
            outlineColor="#000000"
          >
            {agent.name}
          </Text>
        )}

        <DopamineAura />
        <MoodParticles />
      </group>
    </>
  );
}
