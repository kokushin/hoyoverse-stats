// 各ゲームの基本情報
export interface GameProfile {
  uid: string;
  nickname: string;
  level: number;
  server: string;
  signature?: string;
  avatar?: string;
}

// 原神のキャラクター情報
export interface GenshinCharacter {
  id: number;
  name: string;
  element: string;
  rarity: number;
  level: number;
  constellation: number;
  icon: string;
}

// 原神のプロフィール
export interface GenshinProfile extends GameProfile {
  achievements: number;
  characters: GenshinCharacter[];
  activeDays: number;
  spiralAbyss?: string;
  worldLevel: number;
}

// 崩壊スターレイルのキャラクター情報
export interface StarRailCharacter {
  id: number;
  name: string;
  element: string;
  rarity: number;
  level: number;
  eidolon: number;
  icon: string;
}

// 崩壊スターレイルのプロフィール
export interface StarRailProfile extends GameProfile {
  achievements: number;
  characters: StarRailCharacter[];
  activeDays: number;
  memoryOfChaos?: string;
  equilibriumLevel: number;
}

// 崩壊3rdのバルキリー情報
export interface HonkaiValkyrie {
  id: number;
  name: string;
  type: string;
  rarity: number;
  level: number;
  rank: string;
  icon: string;
}

// 崩壊3rdのプロフィール
export interface HonkaiProfile extends GameProfile {
  achievements: number;
  valkyries: HonkaiValkyrie[];
  activeDays: number;
  memorial?: string;
  captainLevel: number;
}

// ゼンレスゾーンゼロのエージェント情報
export interface ZZZAgent {
  id: number;
  name: string;
  attribute: string;
  rarity: number;
  level: number;
  mindscapeLevel: number;
  icon: string;
}

// ゼンレスゾーンゼロのプロフィール
export interface ZZZProfile extends GameProfile {
  achievements: number;
  agents: ZZZAgent[];
  activeDays: number;
  shiyu?: string;
  interKnotLevel: number;
}

// 全ゲームのデータ統合
export interface HoyoverseData {
  genshin?: GenshinProfile;
  starrail?: StarRailProfile;
  honkai?: HonkaiProfile;
  zzz?: ZZZProfile;
}

// API レスポンス
export interface ApiResponse<T> {
  retcode: number;
  message: string;
  data: T | null;
}
