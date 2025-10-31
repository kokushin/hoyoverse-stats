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

// 認証不要のAPI（推奨）
const ENKA_API_BASE = 'https://enka.network/api';
const MIHOMO_API_BASE = 'https://api.mihomo.me';

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
 * Enka Network APIを使用して原神のプロフィールを取得（認証不要）
 */
export async function fetchGenshinProfileFromEnka(uid: string): Promise<GenshinProfile | null> {
  try {
    const response = await axios.get(`${ENKA_API_BASE}/uid/${uid}/`, {
      headers: {
        'User-Agent': 'HoYoverseStatsViewer/1.0',
      },
    });

    if (!response.data || !response.data.playerInfo) {
      return null;
    }

    const playerInfo = response.data.playerInfo;
    const avatarInfoList = response.data.avatarInfoList || [];

    // キャラクター情報を変換
    const characters = avatarInfoList.slice(0, 8).map((avatar: any) => {
      const avatarId = avatar.avatarId;
      const constellations = avatar.talentIdList?.length || 0;

      return {
        id: avatarId,
        name: `Character ${avatarId}`, // 名前はマッピングが必要
        element: 'Unknown',
        rarity: 5,
        level: avatar.propMap?.['4001']?.val || 1,
        constellation: constellations,
        icon: `https://enka.network/ui/UI_AvatarIcon_${avatarId}.png`,
      };
    });

    return {
      uid,
      nickname: playerInfo.nickname || 'Traveler',
      level: playerInfo.level || 0,
      server: getServerRegion(uid),
      signature: playerInfo.signature || '',
      achievements: playerInfo.finishAchievementNum || 0,
      characters,
      activeDays: 0, // Enka APIには含まれない
      spiralAbyss: playerInfo.towerFloorIndex ? `${playerInfo.towerFloorIndex}-${playerInfo.towerLevelIndex || 0}` : '-',
      worldLevel: playerInfo.worldLevel || 0,
    };
  } catch (error: any) {
    if (error.response?.status === 424) {
      console.warn('Genshin profile is not public or showcase is empty');
    } else {
      console.error('Error fetching Genshin profile from Enka:', error);
    }
    return null;
  }
}

/**
 * mihomo.me APIを使用して崩壊スターレイルのプロフィールを取得（認証不要）
 */
export async function fetchStarRailProfileFromMihomo(uid: string): Promise<StarRailProfile | null> {
  try {
    const response = await axios.get(`${MIHOMO_API_BASE}/sr_info_parsed/${uid}`, {
      params: {
        lang: 'jp',
      },
      headers: {
        'User-Agent': 'HoYoverseStatsViewer/1.0',
      },
    });

    if (!response.data || !response.data.player) {
      return null;
    }

    const player = response.data.player;
    const characters = response.data.characters || [];

    // キャラクター情報を変換
    const characterList = characters.slice(0, 8).map((char: any) => ({
      id: parseInt(char.id),
      name: char.name,
      element: char.element?.name || 'Unknown',
      rarity: char.rarity,
      level: char.level,
      eidolon: char.rank || 0,
      icon: `https://raw.githubusercontent.com/Mar-7th/StarRailRes/master/${char.icon}`,
    }));

    return {
      uid,
      nickname: player.nickname || 'Trailblazer',
      level: player.level || 0,
      server: getServerRegion(uid),
      signature: player.signature || '',
      achievements: response.data.player_details?.achievements || 0,
      characters: characterList,
      activeDays: 0, // mihomo APIには含まれない
      memoryOfChaos: response.data.player_details?.memory_of_chaos || '-',
      equilibriumLevel: player.equilibrium_level || 0,
    };
  } catch (error: any) {
    if (error.response?.status === 404) {
      console.warn('Star Rail profile not found or not public');
    } else {
      console.error('Error fetching Star Rail profile from mihomo:', error);
    }
    return null;
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
 * 認証不要のAPIを優先的に使用し、失敗した場合は認証付きAPIにフォールバック
 */
export async function fetchAllProfiles(uid: string): Promise<HoyoverseData> {
  // 認証不要のAPIを優先的に使用
  const [genshin, starrail] = await Promise.all([
    fetchGenshinProfileFromEnka(uid),
    fetchStarRailProfileFromMihomo(uid),
  ]);

  // 崩壊3rdとZZZは認証が必要（認証不要のAPIが存在しない）
  const auth = getAuthCookies();
  let honkai = null;
  let zzz = null;

  if (auth) {
    [honkai, zzz] = await Promise.all([
      fetchHonkaiProfile(uid),
      fetchZZZProfile(uid),
    ]);
  }

  return {
    genshin: genshin || undefined,
    starrail: starrail || undefined,
    honkai: honkai || undefined,
    zzz: zzz || undefined,
  };
}
