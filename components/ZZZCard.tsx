'use client';

import { ZZZProfile } from '@/types';
import GameCard from './GameCard';

interface ZZZCardProps {
  profile: ZZZProfile;
}

export default function ZZZCard({ profile }: ZZZCardProps) {
  return (
    <GameCard title="ゼンレスゾーンゼロ (Zenless Zone Zero)" color="from-red-400 to-red-600">
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-2xl font-bold text-white">{profile.nickname}</p>
            <p className="text-gray-400">UID: {profile.uid}</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-red-400">Lv. {profile.interKnotLevel}</p>
            <p className="text-sm text-gray-400">インターノットLv</p>
          </div>
        </div>

        {profile.signature && (
          <p className="text-gray-300 italic border-l-4 border-red-400 pl-4">
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

        {profile.shiyu && (
          <div className="bg-gray-700 rounded-lg p-4">
            <p className="text-gray-400 text-sm">式輿防衛戦</p>
            <p className="text-xl font-bold text-white">{profile.shiyu}</p>
          </div>
        )}

        <div className="pt-4">
          <p className="text-gray-400 text-sm mb-3">所持エージェント ({profile.agents.length})</p>
          <div className="grid grid-cols-2 gap-2">
            {profile.agents.slice(0, 6).map((agent) => (
              <div key={agent.id} className="bg-gray-700 rounded-lg p-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-white font-semibold">{agent.name}</p>
                    <p className="text-gray-400 text-xs">{agent.attribute}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-red-300 font-semibold">Lv.{agent.level}</p>
                    <p className="text-yellow-400 text-xs">M{agent.mindscapeLevel}</p>
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
