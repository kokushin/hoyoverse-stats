'use client';

import { HonkaiProfile } from '@/types';
import GameCard from './GameCard';

interface HonkaiCardProps {
  profile: HonkaiProfile;
}

export default function HonkaiCard({ profile }: HonkaiCardProps) {
  return (
    <GameCard title="崩壊3rd (Honkai Impact 3rd)" color="from-purple-400 to-purple-600">
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-2xl font-bold text-white">{profile.nickname}</p>
            <p className="text-gray-400">UID: {profile.uid}</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-purple-400">Lv. {profile.captainLevel}</p>
            <p className="text-sm text-gray-400">艦長レベル</p>
          </div>
        </div>

        {profile.signature && (
          <p className="text-gray-300 italic border-l-4 border-purple-400 pl-4">
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

        {profile.memorial && (
          <div className="bg-gray-700 rounded-lg p-4">
            <p className="text-gray-400 text-sm">往世楽土</p>
            <p className="text-xl font-bold text-white">{profile.memorial}</p>
          </div>
        )}

        <div className="pt-4">
          <p className="text-gray-400 text-sm mb-3">所持バルキリー ({profile.valkyries.length})</p>
          <div className="grid grid-cols-2 gap-2">
            {profile.valkyries.slice(0, 6).map((valkyrie) => (
              <div key={valkyrie.id} className="bg-gray-700 rounded-lg p-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-white font-semibold">{valkyrie.name}</p>
                    <p className="text-gray-400 text-xs">{valkyrie.type}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-purple-300 font-semibold">Lv.{valkyrie.level}</p>
                    <p className="text-yellow-400 text-xs">{valkyrie.rank}</p>
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
