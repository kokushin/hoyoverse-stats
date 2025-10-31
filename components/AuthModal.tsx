'use client';

import { useState } from 'react';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { KeyIcon } from '@heroicons/react/24/outline';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (ltuid: string, ltoken: string) => void;
}

export default function AuthModal({ isOpen, onClose, onSave }: AuthModalProps) {
  const [ltuid, setLtuid] = useState('');
  const [ltoken, setLtoken] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (ltuid.trim() && ltoken.trim()) {
      onSave(ltuid.trim(), ltoken.trim());
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/75" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="max-w-lg w-full bg-gray-800 rounded-xl p-6 shadow-xl">
          <DialogTitle className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <KeyIcon className="w-6 h-6 text-blue-400" />
            HoYoLAB認証設定
          </DialogTitle>

          <div className="mb-6 text-sm text-gray-300 space-y-2">
            <p>HoYoLAB APIを使用するには、認証クッキーが必要です。</p>
            <div className="bg-gray-700 rounded-lg p-4 mt-4">
              <p className="font-semibold text-white mb-2">取得方法:</p>
              <ol className="list-decimal list-inside space-y-1 text-xs">
                <li>HoYoLAB (<a href="https://www.hoyolab.com" target="_blank" className="text-blue-400 hover:underline">hoyolab.com</a>) にログイン</li>
                <li>ブラウザの開発者ツールを開く (F12)</li>
                <li>Application → Cookies → hoyolab.com を選択</li>
                <li><code className="bg-gray-600 px-1 rounded">ltuid</code> と <code className="bg-gray-600 px-1 rounded">ltoken</code> の値をコピー</li>
              </ol>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                ltuid
              </label>
              <input
                type="text"
                value={ltuid}
                onChange={(e) => setLtuid(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="例: 123456789"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                ltoken
              </label>
              <input
                type="password"
                value={ltoken}
                onChange={(e) => setLtoken(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="トークンを入力"
                required
              />
            </div>

            <div className="bg-yellow-900/30 border border-yellow-600/50 rounded-lg p-3 text-xs text-yellow-200">
              ⚠️ クッキー情報はブラウザのローカルストレージに保存されます。第三者と共有しないでください。
            </div>

            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                キャンセル
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                保存
              </button>
            </div>
          </form>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
