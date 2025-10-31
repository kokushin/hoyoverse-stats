'use client';

import { ReactNode } from 'react';

interface GameCardProps {
  title: string;
  color: string;
  children: ReactNode;
}

export default function GameCard({ title, color, children }: GameCardProps) {
  return (
    <div className={`bg-gray-800 rounded-xl overflow-hidden border-2 border-${color}`}>
      <div className={`bg-gradient-to-r ${color} px-6 py-4`}>
        <h2 className="text-2xl font-bold text-white">{title}</h2>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}
