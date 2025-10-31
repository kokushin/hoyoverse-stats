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

// 認証情報を取得
export function getAuthCookies(): { ltuid: string; ltoken: string } | null {
  if (typeof window === 'undefined') return null;

  const ltuid = localStorage.getItem('hoyolab_ltuid');
  const ltoken = localStorage.getItem('hoyolab_ltoken');

  if (!ltuid || !ltoken) return null;

  return { ltuid, ltoken };
}

// 認証情報を保存
export function setAuthCookies(ltuid: string, ltoken: string): void {
  if (typeof window === 'undefined') return;

  localStorage.setItem('hoyolab_ltuid', ltuid);
  localStorage.setItem('hoyolab_ltoken', ltoken);
}

// 認証情報をクリア
export function clearAuthCookies(): void {
  if (typeof window === 'undefined') return;

  localStorage.removeItem('hoyolab_ltuid');
  localStorage.removeItem('hoyolab_ltoken');
}

// サーバー地域を判定（UIDの最初の数字から）
function getServerRegion(uid: string): string {
  const firstDigit = uid.charAt(0);
  switch (firstDigit) {
    case '6': return 'os_usa';
    case '7': return 'os_euro';
    case '8': return 'os_asia';
    case '9': return 'os_cht';
    default: return 'os_asia';
  }
}

/**
 * 原神のプロフィール情報を取得
 */
export async function fetchGenshinProfile(uid: string): Promise<GenshinProfile | null> {
  try {
    const auth = getAuthCookies();
    if (!auth) {
      console.warn('認証情報が設定されていません');
      return null;
    }

    const server = getServerRegion(uid);

    // プロフィール基本情報を取得
    const response = await axios.get(
      `${HOYOLAB_API_BASE}/game_record/genshin/api/index`,
      {
        params: {
          role_id: uid,
          server: server,
        },
        headers: {
          'Cookie': `ltuid=${auth.ltuid}; ltoken=${auth.ltoken}`,
          'x-rpc-app_version': '1.5.0',
          'x-rpc-client_type': '5',
          'x-rpc-language': 'ja-jp',
        },
      }
    );

    if (response.data.retcode !== 0) {
      console.error('Genshin API error:', response.data.message);
      return null;
    }

    const data = response.data.data;
    const stats = data.stats;

    // キャラクター情報を取得
    const charactersResponse = await axios.post(
      `${HOYOLAB_API_BASE}/game_record/genshin/api/character`,
      {
        role_id: uid,
        server: server,
      },
      {
        headers: {
          'Cookie': `ltuid=${auth.ltuid}; ltoken=${auth.ltoken}`,
          'x-rpc-app_version': '1.5.0',
          'x-rpc-client_type': '5',
          'x-rpc-language': 'ja-jp',
          'Content-Type': 'application/json',
        },
      }
    );

    const characters = charactersResponse.data.retcode === 0
      ? charactersResponse.data.data.avatars.slice(0, 8).map((char: any) => ({
          id: char.id,
          name: char.name,
          element: char.element,
          rarity: char.rarity,
          level: char.level,
          constellation: char.actived_constellation_num,
          icon: char.icon,
        }))
      : [];

    return {
      uid,
      nickname: data.role.nickname,
      level: data.role.level,
      server: server,
      signature: data.role.game_head_icon || '',
      achievements: stats.achievement_number || 0,
      characters,
      activeDays: stats.active_day_number || 0,
      spiralAbyss: stats.spiral_abyss || '-',
      worldLevel: data.world_level || 0,
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
    const auth = getAuthCookies();
    if (!auth) {
      console.warn('認証情報が設定されていません');
      return null;
    }

    const server = getServerRegion(uid);

    const response = await axios.get(
      `${HOYOLAB_API_BASE}/game_record/hkrpg/api/index`,
      {
        params: {
          role_id: uid,
          server: server,
        },
        headers: {
          'Cookie': `ltuid=${auth.ltuid}; ltoken=${auth.ltoken}`,
          'x-rpc-app_version': '1.5.0',
          'x-rpc-client_type': '5',
          'x-rpc-language': 'ja-jp',
        },
      }
    );

    if (response.data.retcode !== 0) {
      console.error('Star Rail API error:', response.data.message);
      return null;
    }

    const data = response.data.data;
    const stats = data.stats;

    // キャラクター情報を取得
    const charactersResponse = await axios.get(
      `${HOYOLAB_API_BASE}/game_record/hkrpg/api/avatar/info`,
      {
        params: {
          role_id: uid,
          server: server,
        },
        headers: {
          'Cookie': `ltuid=${auth.ltuid}; ltoken=${auth.ltoken}`,
          'x-rpc-app_version': '1.5.0',
          'x-rpc-client_type': '5',
          'x-rpc-language': 'ja-jp',
        },
      }
    );

    const characters = charactersResponse.data.retcode === 0
      ? charactersResponse.data.data.avatar_list.slice(0, 8).map((char: any) => ({
          id: char.id,
          name: char.name,
          element: char.element,
          rarity: char.rarity,
          level: char.level,
          eidolon: char.rank,
          icon: char.icon,
        }))
      : [];

    return {
      uid,
      nickname: data.role?.nickname || 'Trailblazer',
      level: data.role?.level || 0,
      server: server,
      signature: data.role?.game_head_icon || '',
      achievements: stats?.achievement_num || 0,
      characters,
      activeDays: stats?.active_days || 0,
      memoryOfChaos: stats?.abyss_process || '-',
      equilibriumLevel: data.role?.world_level || 0,
    };
  } catch (error) {
    console.error('Error fetching Star Rail profile:', error);
    return null;
  }
}

/**
 * 崩壊3rdのプロフィール情報を取得
 * 注意: Honkai Impact 3rdのAPIは地域によって異なる場合があります
 */
export async function fetchHonkaiProfile(uid: string): Promise<HonkaiProfile | null> {
  try {
    const auth = getAuthCookies();
    if (!auth) {
      console.warn('認証情報が設定されていません');
      return null;
    }

    const server = getServerRegion(uid);

    const response = await axios.get(
      `${HOYOLAB_API_BASE}/game_record/honkai3rd/api/index`,
      {
        params: {
          role_id: uid,
          server: server,
        },
        headers: {
          'Cookie': `ltuid=${auth.ltuid}; ltoken=${auth.ltoken}`,
          'x-rpc-app_version': '1.5.0',
          'x-rpc-client_type': '5',
          'x-rpc-language': 'ja-jp',
        },
      }
    );

    if (response.data.retcode !== 0) {
      console.error('Honkai 3rd API error:', response.data.message);
      return null;
    }

    const data = response.data.data;
    const stats = data.stats;

    return {
      uid,
      nickname: data.role?.nickname || 'Captain',
      level: data.role?.level || 0,
      server: server,
      signature: data.role?.game_head_icon || '',
      achievements: stats?.achievement_num || 0,
      valkyries: [], // バルキリー情報は別のエンドポイントが必要
      activeDays: stats?.active_days || 0,
      memorial: stats?.memorial_arena || '-',
      captainLevel: data.role?.level || 0,
    };
  } catch (error) {
    console.error('Error fetching Honkai profile:', error);
    return null;
  }
}

/**
 * ゼンレスゾーンゼロのプロフィール情報を取得
 * 注意: ZZZのAPIは比較的新しく、エンドポイントが変更される可能性があります
 */
export async function fetchZZZProfile(uid: string): Promise<ZZZProfile | null> {
  try {
    const auth = getAuthCookies();
    if (!auth) {
      console.warn('認証情報が設定されていません');
      return null;
    }

    const server = getServerRegion(uid);

    const response = await axios.get(
      `${HOYOLAB_API_BASE}/game_record/zzz/api/index`,
      {
        params: {
          role_id: uid,
          server: server,
        },
        headers: {
          'Cookie': `ltuid=${auth.ltuid}; ltoken=${auth.ltoken}`,
          'x-rpc-app_version': '1.5.0',
          'x-rpc-client_type': '5',
          'x-rpc-language': 'ja-jp',
        },
      }
    );

    if (response.data.retcode !== 0) {
      console.error('ZZZ API error:', response.data.message);
      return null;
    }

    const data = response.data.data;
    const stats = data.stats;

    return {
      uid,
      nickname: data.role?.nickname || 'Proxy',
      level: data.role?.level || 0,
      server: server,
      signature: data.role?.game_head_icon || '',
      achievements: stats?.achievement_count || 0,
      agents: [], // エージェント情報は別のエンドポイントが必要
      activeDays: stats?.active_days || 0,
      shiyu: stats?.shiyu_defense || '-',
      interKnotLevel: data.role?.level || 0,
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
