'use client';

import { useState, useRef, useEffect } from 'react';
import { Cog6ToothIcon } from '@heroicons/react/24/outline';
import UIDForm from '@/components/UIDForm';
import GenshinCard from '@/components/GenshinCard';
import StarRailCard from '@/components/StarRailCard';
import HonkaiCard from '@/components/HonkaiCard';
import ZZZCard from '@/components/ZZZCard';
import ExportButton from '@/components/ExportButton';
import AuthModal from '@/components/AuthModal';
import Footer from '@/components/Footer';
import { fetchAllProfiles, getAuthCookies, setAuthCookies } from '@/lib/api';
import type { HoyoverseData } from '@/types';

export default function Home() {
  const [data, setData] = useState<HoyoverseData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  // 認証状態を確認
  useEffect(() => {
    const auth = getAuthCookies();
    setIsAuthenticated(!!auth);
  }, []);

  const handleSubmit = async (uid: string) => {
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const result = await fetchAllProfiles(uid);

      // データが1つも取得できなかった場合
      if (!result.genshin && !result.starrail && !result.honkai && !result.zzz) {
        setError('プロフィールデータを取得できませんでした。UIDを確認するか、ゲーム内でプロフィールを公開設定にしてください。');
      } else {
        setData(result);

        // 崩壊3rdとZZZが取得できない場合は認証を促す
        if (!result.honkai && !result.zzz && isAuthenticated === false) {
          setError(null); // エラーをクリア（原神・スターレイルは取得できているため）
        }
      }
    } catch (err) {
      setError('データの取得中にエラーが発生しました。しばらく待ってから再試行してください。');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAuthSave = (ltuid: string, ltoken: string) => {
    setAuthCookies(ltuid, ltoken);
    setIsAuthenticated(true);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* 設定ボタン */}
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              isAuthenticated
                ? 'bg-green-900/30 border border-green-500 text-green-300 hover:bg-green-900/50'
                : 'bg-gray-800 border border-gray-700 text-gray-300 hover:bg-gray-700'
            }`}
          >
            <Cog6ToothIcon className="w-5 h-5" />
            {isAuthenticated ? '認証済み' : '認証設定'}
          </button>
        </div>

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
            <div className="mt-6 max-w-2xl mx-auto text-sm space-y-2">
              <p className="text-green-400">
                ✓ 原神・崩壊スターレイルは認証不要でデータ取得可能
              </p>
              {!isAuthenticated && (
                <p className="text-yellow-400">
                  ※ 崩壊3rd・ゼンレスゾーンゼロのデータを表示するには、右上の「認証設定」から認証情報を入力してください
                </p>
              )}
              <p className="text-gray-500 text-xs mt-4">
                プロフィールがゲーム内で公開設定になっている必要があります
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 認証モーダル */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSave={handleAuthSave}
      />

      <Footer />
    </div>
  );
}
