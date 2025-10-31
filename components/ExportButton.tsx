'use client';

import { useRef } from 'react';
import { toPng } from 'html-to-image';
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';

interface ExportButtonProps {
  targetRef: React.RefObject<HTMLElement>;
  filename?: string;
}

export default function ExportButton({ targetRef, filename = 'hoyoverse-profile.png' }: ExportButtonProps) {
  const handleExport = async () => {
    if (!targetRef.current) return;

    try {
      const dataUrl = await toPng(targetRef.current, {
        quality: 0.95,
        pixelRatio: 2,
        backgroundColor: '#0a0a0a',
      });

      const link = document.createElement('a');
      link.download = filename;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('画像の生成に失敗しました:', error);
      alert('画像の生成に失敗しました。もう一度お試しください。');
    }
  };

  return (
    <button
      onClick={handleExport}
      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-semibold hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all"
    >
      <ArrowDownTrayIcon className="w-5 h-5" />
      PNG画像として保存
    </button>
  );
}
