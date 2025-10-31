'use client';

import { useState } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface UIDFormProps {
  onSubmit: (uid: string) => void;
  loading?: boolean;
}

export default function UIDForm({ onSubmit, loading = false }: UIDFormProps) {
  const [uid, setUid] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (uid.trim()) {
      onSubmit(uid.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="flex flex-col gap-4">
        <div className="relative">
          <input
            type="text"
            value={uid}
            onChange={(e) => setUid(e.target.value)}
            placeholder="HoYoverseアカウントUIDを入力"
            className="w-full px-6 py-4 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
            disabled={loading}
          />
        </div>
        <button
          type="submit"
          disabled={loading || !uid.trim()}
          className="flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          <MagnifyingGlassIcon className="w-5 h-5" />
          {loading ? 'データ取得中...' : 'プロフィールを表示'}
        </button>
      </div>
    </form>
  );
}
