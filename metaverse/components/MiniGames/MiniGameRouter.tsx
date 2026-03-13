'use client';

import { useGameStore } from '@/stores/gameStore';
import ClawMachine from './ClawMachine';
import DopamineRush from './DopamineRush';
import SkillDuel from './SkillDuel';
import CookOff from './CookOff';
import FashionShow from './FashionShow';
import Colosseum from './Colosseum';

export default function MiniGameRouter() {
  const view = useGameStore((s) => s.view);
  const setView = useGameStore((s) => s.setView);

  const backToWorld = () => setView('world');

  switch (view) {
    case 'claw-machine':
      return <ClawMachine onBack={backToWorld} />;
    case 'dopamine-rush':
      return <DopamineRush onBack={backToWorld} />;
    case 'skill-duel':
      return <SkillDuel onBack={backToWorld} />;
    case 'cook-off':
      return <CookOff onBack={backToWorld} />;
    case 'fashion-show':
      return <FashionShow onBack={backToWorld} />;
    case 'colosseum':
      return <Colosseum onBack={backToWorld} />;
    default:
      return null;
  }
}
