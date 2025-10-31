import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HoYoverse Stats Viewer",
  description: "原神、崩壊スターレイル、崩壊3rd、ゼンレスゾーンゼロの統合プロフィールビューワー",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="antialiased">{children}</body>
    </html>
  );
}
