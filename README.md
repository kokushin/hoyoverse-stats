# HoYoverse Stats Viewer

HoYoverseの各ゲーム(原神、崩壊スターレイル、崩壊3rd、ゼンレスゾーンゼロ)のアカウント情報を統合して表示するプロフィールビューワーです。

## 機能

- **統合プロフィール表示**: 4つのゲームのアカウント情報を1画面で一覧表示
- **認証不要 (原神・スターレイル)**: UIDだけでプロフィール情報を取得可能
- **キャラクター画像表示**: キャラクターアイコン画像を含む詳細な情報表示
- **プロフィールカード**: 各ゲームごとに見やすいカード型UIで情報を表示
- **PNG出力**: 表示されたプロフィール情報をPNG画像として保存可能
- **レスポンシブデザイン**: デスクトップ・モバイル両対応

## 技術スタック

- **Next.js 14**: Reactフレームワーク
- **TypeScript**: 型安全な開発
- **Tailwind CSS**: スタイリング
- **Headless UI**: アクセシブルなUIコンポーネント
- **html-to-image**: PNG画像生成

## セットアップ

### 依存関係のインストール

```bash
npm install
```

### 開発サーバーの起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてアプリケーションを確認できます。

### ビルド

```bash
npm run build
npm start
```

## 使い方

### 基本的な使い方（認証不要）

1. トップページでHoYoverseアカウントのUIDを入力
2. 「プロフィールを表示」ボタンをクリック
3. 原神・崩壊スターレイルのプロフィール情報が表示されます
4. 「PNG画像として保存」ボタンで画像をダウンロード

**対応ゲーム (認証不要)**:
- ✅ **原神 (Genshin Impact)** - Enka Network APIを使用
- ✅ **崩壊:スターレイル (Honkai: Star Rail)** - mihomo.me APIを使用

### 崩壊3rd・ZZZのデータ表示（認証必要）

崩壊3rdとゼンレスゾーンゼロのデータを表示するには、HoYoLAB認証が必要です：

1. [HoYoLAB](https://www.hoyolab.com) にログイン
2. ブラウザの開発者ツールを開く (F12キー)
3. `Application` タブ → `Cookies` → `https://www.hoyolab.com` を選択
4. `ltuid` と `ltoken` の値をコピー
5. アプリの右上にある「認証設定」ボタンをクリック
6. コピーした値を入力して保存

**重要**:
- クッキー情報は第三者と共有しないでください
- クッキーはブラウザのローカルストレージに保存されます
- 認証情報は自己責任で管理してください

### UID について

各ゲームのUIDは以下の場所で確認できます：
- **原神**: ゲーム内メニュー → 設定
- **崩壊スターレイル**: 携帯電話メニュー → プロフィール
- **崩壊3rd**: ゲーム内プロフィール画面
- **ゼンレスゾーンゼロ**: インターノットメニュー

UIDの最初の数字でサーバーが自動判定されます：
- `6`: アメリカ
- `7`: ヨーロッパ
- `8`: アジア
- `9`: 台湾・香港・マカオ

## 注意事項

- **このツールは非公式のファンメイドツールです**
- HoYoverse公式のツールではありません
- **原神・崩壊スターレイルは認証不要** - UIDだけでデータ取得可能
- **崩壊3rd・ZZZは認証が必要** - HoYoLAB認証クッキーが必要
- プロフィールがゲーム内で公開設定になっている必要があります
- ショーケース（編成）にキャラクターが設定されている必要があります

## API連携について

このプロジェクトは複数のAPIと連携しています：

### 認証不要のAPI（推奨）

- **原神 (Genshin Impact)**
  - API: [Enka Network](https://enka.network/)
  - エンドポイント: `https://enka.network/api/uid/{UID}/`
  - 特徴: 認証不要、キャラクター詳細情報・画像付き

- **崩壊:スターレイル (Honkai: Star Rail)**
  - API: [mihomo.me](https://api.mihomo.me/)
  - エンドポイント: `https://api.mihomo.me/sr_info_parsed/{UID}?lang=jp`
  - 特徴: 認証不要、キャラクター詳細情報・画像付き

### 認証付きAPI

- **崩壊3rd (Honkai Impact 3rd)**
  - API: HoYoLAB API
  - エンドポイント: `game_record/honkai3rd/api/index`
  - 認証: HoYoLABクッキー (ltuid, ltoken)

- **ゼンレスゾーンゼロ (Zenless Zone Zero)**
  - API: HoYoLAB API
  - エンドポイント: `game_record/zzz/api/index`
  - 認証: HoYoLABクッキー (ltuid, ltoken)

## ライセンス

このプロジェクトはMITライセンスの下で公開されています。

すべてのゲームコンテンツおよびアセットは、それぞれの権利所有者に帰属します。
- 原神 © COGNOSPHERE PTE. LTD.
- 崩壊:スターレイル © COGNOSPHERE PTE. LTD.
- 崩壊3rd © miHoYo
- ゼンレスゾーンゼロ © COGNOSPHERE PTE. LTD.
