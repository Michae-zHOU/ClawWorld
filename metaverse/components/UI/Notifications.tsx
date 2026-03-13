'use client';

import { useEffect } from 'react';
import { useGameStore } from '@/stores/gameStore';

export default function Notifications() {
  const notifications = useGameStore((s) => s.notifications);
  const removeNotification = useGameStore((s) => s.removeNotification);

  useEffect(() => {
    if (notifications.length === 0) return;
    const latest = notifications[notifications.length - 1];
    const timer = setTimeout(() => removeNotification(latest.id), 4000);
    return () => clearTimeout(timer);
  }, [notifications, removeNotification]);

  return (
    <div className="absolute top-20 right-3 z-20 space-y-2 pointer-events-none max-w-xs">
      {notifications.map((n) => (
        <div
          key={n.id}
          className={`px-4 py-2.5 rounded-lg border backdrop-blur-md text-sm font-medium animate-in slide-in-from-right ${
            n.type === 'success'
              ? 'bg-green-500/10 border-green-500/20 text-green-400'
              : n.type === 'warning'
                ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400'
                : 'bg-purple-500/10 border-purple-500/20 text-purple-300'
          }`}
        >
          {n.text}
        </div>
      ))}
    </div>
  );
}
