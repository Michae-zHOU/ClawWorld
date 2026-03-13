import * as THREE from 'three';

export interface IslandConfig {
  id: string;
  name: string;
  position: [number, number, number];
  radius: number;
  color: string;
  emissive: string;
  description: string;
}

export const ISLANDS: IslandConfig[] = [
  {
    id: 'central-plaza',
    name: 'Central Plaza',
    position: [0, 0, 0],
    radius: 30,
    color: '#7c3aed',
    emissive: '#4c1d95',
    description: 'The hub of Claw World. Spawn point and grand claw machine.',
  },
  {
    id: 'pharmacy',
    name: 'Pharmacy Island',
    position: [80, 5, 0],
    radius: 22,
    color: '#06b6d4',
    emissive: '#0e7490',
    description: 'Neon-lit cyberpunk pharmacy. Buy dopamine boosts.',
  },
  {
    id: 'food-court',
    name: 'Food Court Island',
    position: [-80, 3, 0],
    radius: 22,
    color: '#f59e0b',
    emissive: '#b45309',
    description: 'Warm marketplace with floating lanterns.',
  },
  {
    id: 'skill-arena',
    name: 'Skill Arena Island',
    position: [0, 8, 80],
    radius: 24,
    color: '#ef4444',
    emissive: '#991b1b',
    description: 'Industrial training grounds. Buy and test skills.',
  },
  {
    id: 'fashion-boulevard',
    name: 'Fashion Boulevard',
    position: [0, 2, -80],
    radius: 22,
    color: '#ec4899',
    emissive: '#9d174d',
    description: 'Glamorous runway. Skin boutique and fashion shows.',
  },
  {
    id: 'arcade',
    name: 'Arcade Island',
    position: [60, 10, 60],
    radius: 25,
    color: '#22d3ee',
    emissive: '#155e75',
    description: 'Retro-futuristic fun zone with mini-games.',
  },
  {
    id: 'wilderness',
    name: 'Wilderness Island',
    position: [-60, -2, 60],
    radius: 28,
    color: '#34d399',
    emissive: '#065f46',
    description: 'Mysterious forest with hidden treasures.',
  },
];

export const SPAWN_POINT = new THREE.Vector3(0, 5, 0);

export const SKYWALKS: { from: string; to: string }[] = [
  { from: 'central-plaza', to: 'pharmacy' },
  { from: 'central-plaza', to: 'food-court' },
  { from: 'central-plaza', to: 'skill-arena' },
  { from: 'central-plaza', to: 'fashion-boulevard' },
  { from: 'central-plaza', to: 'arcade' },
  { from: 'central-plaza', to: 'wilderness' },
];

export function getIsland(id: string): IslandConfig | undefined {
  return ISLANDS.find((i) => i.id === id);
}
