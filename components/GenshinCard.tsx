'use client';

import { GenshinProfile } from '@/types';
import GameCard from './GameCard';

interface GenshinCardProps {
  profile: GenshinProfile;
}

export default function GenshinCard({ profile }: GenshinCardProps) {
  return (
    <GameCard title="原神 (Genshin Impact)" color="from-blue-400 to-blue-600">
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-2xl font-bold text-white">{profile.nickname}</p>
            <p className="text-gray-400">UID: {profile.uid}</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-blue-400">Lv. {profile.level}</p>
            <p className="text-sm text-gray-400">世界ランク {profile.worldLevel}</p>
          </div>
        </div>

        {profile.signature && (
          <p className="text-gray-300 italic border-l-4 border-blue-400 pl-4">
            {profile.signature}
          </p>
        )}

        <div className="grid grid-cols-2 gap-4 pt-4">
          <div className="bg-gray-700 rounded-lg p-4">
            <p className="text-gray-400 text-sm">アクティブ日数</p>
            <p className="text-2xl font-bold text-white">{profile.activeDays}</p>
          </div>
          <div className="bg-gray-700 rounded-lg p-4">
            <p className="text-gray-400 text-sm">実績</p>
            <p className="text-2xl font-bold text-white">{profile.achievements}</p>
          </div>
        </div>

        {profile.spiralAbyss && (
          <div className="bg-gray-700 rounded-lg p-4">
            <p className="text-gray-400 text-sm">深境螺旋</p>
            <p className="text-xl font-bold text-white">{profile.spiralAbyss}</p>
          </div>
        )}

        <div className="pt-4">
          <p className="text-gray-400 text-sm mb-3">所持キャラクター ({profile.characters.length})</p>
          <div className="grid grid-cols-2 gap-2">
            {profile.characters.slice(0, 6).map((char) => (
              <div key={char.id} className="bg-gray-700 rounded-lg p-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-white font-semibold">{char.name}</p>
                    <p className="text-gray-400 text-xs">{char.element}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-blue-300 font-semibold">Lv.{char.level}</p>
                    <p className="text-yellow-400 text-xs">凸{char.constellation}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </GameCard>
  );
}
