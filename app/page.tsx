'use client';

import { useState, useRef } from 'react';
import UIDForm from '@/components/UIDForm';
import GenshinCard from '@/components/GenshinCard';
import StarRailCard from '@/components/StarRailCard';
import HonkaiCard from '@/components/HonkaiCard';
import ZZZCard from '@/components/ZZZCard';
import ExportButton from '@/components/ExportButton';
import Footer from '@/components/Footer';
import { fetchAllProfiles } from '@/lib/api';
import type { HoyoverseData } from '@/types';

export default function Home() {
  const [data, setData] = useState<HoyoverseData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (uid: string) => {
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const result = await fetchAllProfiles(uid);

      // データが1つも取得できなかった場合
      if (!result.genshin && !result.starrail && !result.honkai && !result.zzz) {
        setError('プロフィールデータを取得できませんでした。UIDを確認してください。');
      } else {
        setData(result);
      }
    } catch (err) {
      setError('データの取得中にエラーが発生しました。');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 text-transparent bg-clip-text mb-4">
            HoYoverse Stats Viewer
          </h1>
          <p className="text-gray-400 text-lg">
            原神、崩壊スターレイル、崩壊3rd、ゼンレスゾーンゼロの統合プロフィールビューワー
          </p>
        </header>

        <div className="mb-12">
          <UIDForm onSubmit={handleSubmit} loading={loading} />
        </div>

        {error && (
          <div className="bg-red-900/50 border border-red-500 rounded-lg p-4 mb-8 text-center">
            <p className="text-red-200">{error}</p>
          </div>
        )}

        {data && (
          <>
            <div className="flex justify-center mb-8">
              <ExportButton
                targetRef={profileRef}
                filename={`hoyoverse-profile-${new Date().getTime()}.png`}
              />
            </div>

            <div ref={profileRef} className="bg-gray-900 p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {data.genshin && <GenshinCard profile={data.genshin} />}
                {data.starrail && <StarRailCard profile={data.starrail} />}
                {data.honkai && <HonkaiCard profile={data.honkai} />}
                {data.zzz && <ZZZCard profile={data.zzz} />}
              </div>
            </div>
          </>
        )}

        {!data && !loading && !error && (
          <div className="text-center text-gray-400 py-20">
            <p className="text-xl">UIDを入力してプロフィールを表示</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
