import axios from 'axios';
import type {
  HoyoverseData,
  GenshinProfile,
  StarRailProfile,
  HonkaiProfile,
  ZZZProfile,
  ApiResponse,
} from '@/types';

// HoYoLAB APIのベースURL
const HOYOLAB_API_BASE = 'https://bbs-api-os.hoyolab.com';

// 注意: 実際の実装では適切なAPIエンドポイントとトークンが必要です
// これはデモ用のモック実装を含みます

/**
 * 原神のプロフィール情報を取得
 */
export async function fetchGenshinProfile(uid: string): Promise<GenshinProfile | null> {
  try {
    // 実際のAPI呼び出し例（要認証トークン）
    // const response = await axios.get<ApiResponse<GenshinProfile>>(
    //   `${HOYOLAB_API_BASE}/game_record/genshin/api/index`,
    //   {
    //     params: { role_id: uid, server: 'os_asia' },
    //     headers: { 'x-rpc-app_version': '1.5.0' }
    //   }
    // );

    // デモ用のモックデータ
    return {
      uid,
      nickname: 'Traveler',
      level: 60,
      server: 'Asia',
      signature: '世界を旅する者',
      achievements: 850,
      characters: [
        {
          id: 1,
          name: '雷電将軍',
          element: 'Electro',
          rarity: 5,
          level: 90,
          constellation: 2,
          icon: '',
        },
        {
          id: 2,
          name: '胡桃',
          element: 'Pyro',
          rarity: 5,
          level: 90,
          constellation: 1,
          icon: '',
        },
      ],
      activeDays: 850,
      spiralAbyss: '12-3',
      worldLevel: 8,
    };
  } catch (error) {
    console.error('Error fetching Genshin profile:', error);
    return null;
  }
}

/**
 * 崩壊スターレイルのプロフィール情報を取得
 */
export async function fetchStarRailProfile(uid: string): Promise<StarRailProfile | null> {
  try {
    // デモ用のモックデータ
    return {
      uid,
      nickname: 'Trailblazer',
      level: 70,
      server: 'Asia',
      signature: '星の海を旅する者',
      achievements: 650,
      characters: [
        {
          id: 1,
          name: '景元',
          element: 'Lightning',
          rarity: 5,
          level: 80,
          eidolon: 1,
          icon: '',
        },
        {
          id: 2,
          name: '銀狼',
          element: 'Quantum',
          rarity: 5,
          level: 80,
          eidolon: 0,
          icon: '',
        },
      ],
      activeDays: 320,
      memoryOfChaos: 'Stage 10',
      equilibriumLevel: 6,
    };
  } catch (error) {
    console.error('Error fetching Star Rail profile:', error);
    return null;
  }
}

/**
 * 崩壊3rdのプロフィール情報を取得
 */
export async function fetchHonkaiProfile(uid: string): Promise<HonkaiProfile | null> {
  try {
    // デモ用のモックデータ
    return {
      uid,
      nickname: 'Captain',
      level: 88,
      server: 'Asia',
      signature: '崩壊と戦う戦士',
      achievements: 1200,
      valkyries: [
        {
          id: 1,
          name: '空の律者',
          type: 'Mech',
          rarity: 5,
          level: 80,
          rank: 'SSS',
          icon: '',
        },
        {
          id: 2,
          name: '黄金の旋風',
          type: 'Bio',
          rarity: 5,
          level: 80,
          rank: 'SS',
          icon: '',
        },
      ],
      activeDays: 1450,
      memorial: 'RL Agony III',
      captainLevel: 88,
    };
  } catch (error) {
    console.error('Error fetching Honkai profile:', error);
    return null;
  }
}

/**
 * ゼンレスゾーンゼロのプロフィール情報を取得
 */
export async function fetchZZZProfile(uid: string): Promise<ZZZProfile | null> {
  try {
    // デモ用のモックデータ
    return {
      uid,
      nickname: 'Proxy',
      level: 50,
      server: 'Asia',
      signature: 'ゼロ番街のエージェント',
      achievements: 420,
      agents: [
        {
          id: 1,
          name: 'エレン',
          attribute: 'Ice',
          rarity: 5,
          level: 60,
          mindscapeLevel: 0,
          icon: '',
        },
        {
          id: 2,
          name: 'ジュ・ユアン',
          attribute: 'Physical',
          rarity: 5,
          level: 60,
          mindscapeLevel: 1,
          icon: '',
        },
      ],
      activeDays: 120,
      shiyu: 'Floor 10',
      interKnotLevel: 50,
    };
  } catch (error) {
    console.error('Error fetching ZZZ profile:', error);
    return null;
  }
}

/**
 * すべてのゲームのプロフィール情報を一括取得
 */
export async function fetchAllProfiles(uid: string): Promise<HoyoverseData> {
  const [genshin, starrail, honkai, zzz] = await Promise.all([
    fetchGenshinProfile(uid),
    fetchStarRailProfile(uid),
    fetchHonkaiProfile(uid),
    fetchZZZProfile(uid),
  ]);

  return {
    genshin: genshin || undefined,
    starrail: starrail || undefined,
    honkai: honkai || undefined,
    zzz: zzz || undefined,
  };
}
