/**
 * 游戏库数据（纯静态，无需后端）
 * ------------------------------------------------------------
 * 新增一条：复制一个对象，改 slug / name / cover / status 即可。
 * 封面一律用「渐变 + 字形」占位，不使用任何官方封面、角色图或 Logo。
 */

export type GameStatus = 'playing' | 'mainstay' | 'cleared' | 'casual' | 'shelved' | 'wishlist';

export type GameGenre =
  | 'ARPG'
  | '回合制RPG'
  | '开放世界RPG'
  | '3D策略RPG'
  | '3D即时策略RPG'
  | '第三人称射击放置';

export type CoverTone = 'sakura' | 'mint' | 'night' | 'cream' | 'lavender' | 'ash';

export interface Game {
  /** 同时用作 id 与封面配色种子 */
  slug: string;
  name: string;
  /** 封面占位：字形（emoji 或单字）+ 色调 */
  cover: {
    glyph: string;
    tone: CoverTone;
    /** 可选：手写小注，默认用 genre */
    label?: string;
  };
  genre: GameGenre;
  platforms: string[];
  status: GameStatus;
  /** 游玩时长（小时），可为空 */
  playtime?: number;
  /** 0–5 星，支持 .5，可为空 */
  rating?: number;
  startDate?: string;
  finishDate?: string;
  tags: string[];
  shortReview: string;
  /** 长感想：详情页正文；没有则回落到 shortReview */
  review?: string;
  /** 官网链接，可选 */
  link?: string;
  /** 可选：用一条 CSS 渐变换掉色调方案（仍叠加点阵/字形/螺旋，不使用官方封面） */
  coverGradient?: string;
  /** 是否显示「账号内容」截图区，默认 true */
  account?: boolean;
  /** 游戏内档案：等级、大区、活跃天数，以及在玩到什么程度 */
  profile?: {
    level?: number;
    server?: string;
    activeDays?: number;
    /** 想展示的战绩/进度，2–6 条 */
    highlights?: { label: string; value: string }[];
  };
}

/** 状态文案（顺序即筛选栏顺序；颜色在组件里映射，避免动态 class 被裁掉） */
export const STATUS_LABEL: Record<GameStatus, string> = {
  playing: '正在玩',
  mainstay: '常驻',
  cleared: '已通关',
  casual: '偶尔玩',
  shelved: '搁置',
  wishlist: '愿望单',
};

export const STATUS_ORDER: GameStatus[] = [
  'playing',
  'mainstay',
  'cleared',
  'casual',
  'shelved',
  'wishlist',
];

export const GENRES: GameGenre[] = [
  '回合制RPG',
  '开放世界RPG',
  '3D策略RPG',
  '3D即时策略RPG',
  'ARPG',
  '第三人称射击放置',
];

export const games: Game[] = [
  {
    slug: 'zenless-zone-zero',
    name: '绝区零',
    cover: { glyph: '✦', tone: 'night' },
    genre: 'ARPG',
    platforms: ['PC / PS5 / 手机'],
    status: 'playing',
    rating: 4.5,
    tags: ['都市幻想', '动作', '二次元'],
    shortReview: '独特的美术风格和爽快的战斗，是我最近的主力游戏。',
    profile: {
      level: 60,
      server: '新艾利都',
      activeDays: 846,
      highlights: [
        { label: '危局强袭战', value: '2684' },
        { label: '式舆防卫战', value: '119937' },
        { label: '成就称号', value: '女仆写真摄影师' },
      ],
    },
  },
  {
    slug: 'honkai-star-rail',
    name: '崩坏：星穹铁道',
    cover: { glyph: '🚄', tone: 'night', label: '回合制' },
    coverGradient: 'linear-gradient(135deg, #6C5CE7, #A8E6CF)',
    genre: '回合制RPG',
    platforms: ['PC', 'PS5', '手机'],
    status: 'playing',
    rating: 4.5,
    tags: ['银河冒险', '回合制', '剧情向'],
    shortReview:
      '坐着星穹列车在宇宙里慢慢逛，回合制战斗的节奏刚好适合我这种不想太紧绷的玩家。',
    review:
      '最吸引我的是每个星球独立成篇的叙事结构，像在看一部可以互动的科幻单元剧。战斗系统在回合制底子上做了弱点击破和行动条，比传统回合制多了一层节奏感。日常清体力不算坐牢，剧情和角色塑造是目前继续玩下去的主要动力。',
    link: 'https://sr.mihoyo.com/',
    profile: {
      level: 70,
      server: '星穹列车',
      activeDays: 1281,
      highlights: [
        { label: '已解锁角色', value: '68' },
        { label: '战利品开启', value: '1996' },
        { label: '达成成就', value: '1530' },
        { label: '差分宇宙', value: '智械帝皇' },
        { label: '货币战争', value: '财富造物主 48' },
      ],
    },
  },
  {
    slug: 'genshin-impact',
    name: '原神',
    cover: { glyph: '🌬', tone: 'mint', label: '开放世界' },
    coverGradient: 'linear-gradient(135deg, #A8E6CF, #FFF9F2)',
    genre: '开放世界RPG',
    platforms: ['PC', 'PS5', '手机'],
    status: 'mainstay',
    rating: 4,
    tags: ['开放世界', '探索', '长线运营'],
    shortReview: '开服玩到现在，已经变成一种习惯。新地图出来的时候还是会忍不住回去跑一圈。',
    review:
      '开放世界设计在这个领域依然是标杆级别，元素反应系统给了战斗足够的深度，大世界的解谜和探索也一直保持着稳定的产出。不过长线运营带来的重复感确实存在，现在更像是一个「想回去看看」的地方，而不是每天都必须登录的游戏。适合按自己的节奏玩，不必追进度。',
    link: 'https://ys.mihoyo.com/',
    profile: {
      level: 60,
      server: '世界树',
      activeDays: 1639,
      highlights: [
        { label: '深境螺旋', value: '12-3' },
        { label: '幻想真境剧诗', value: '第 10 幕 · 圣牌 2' },
        { label: '幽境危战', value: 'III' },
        { label: '获得角色', value: '90' },
        { label: '满好感角色', value: '56' },
        { label: '达成成就', value: '1420' },
      ],
    },
  },
  {
    slug: 'girls-frontline-2-exilium',
    name: '少女前线2：追放',
    cover: { glyph: '🎯', tone: 'ash', label: '3D策略' },
    coverGradient: 'linear-gradient(135deg, #2D2A3E, #FFB7C5)',
    genre: '3D策略RPG',
    platforms: ['PC', '手机'],
    status: 'playing',
    rating: 4,
    tags: ['策略', '战棋', '3D', '后启示录'],
    shortReview: '掩体和地形让每一关都需要认真想，3D 化之后战术感比前作更直观了。',
    review:
      '追放把少前系列的策略基因用 3D 战棋的形式重新呈现了出来，掩体、机关、地形高低差这些元素让关卡有了真正的解题感。角色建模和休息室的互动演出是另一个加分项，二次元味很对。目前感觉养成线偏长，但战斗本身足够有趣，适合喜欢慢慢琢磨的玩家。',
    link: 'https://gf2.sunborngame.com/',
  },
  {
    slug: 'arknights-endfield',
    name: '明日方舟：终末地',
    cover: { glyph: '⚙', tone: 'night', label: '即时策略' },
    coverGradient: 'linear-gradient(135deg, #1E1B2E, #A8E6CF)',
    genre: '3D即时策略RPG',
    platforms: ['PC', 'PS5', '手机'],
    status: 'playing',
    rating: 4.5,
    tags: ['即时策略', '3D', '探索', '模拟经营'],
    shortReview: '把方舟的世界观放大到 3D 空间里，探索和战斗的衔接比预想中流畅很多。',
    review:
      '终末地在保留方舟策略底色的同时，把玩法重心往探索和即时战斗方向做了延伸。小队编成和技能释放的节奏感不错，大地图探索也给了足够的空间去感受世界观。模拟经营要素的加入让长线运营多了一个支点。目前整体完成度让人满意，美术和氛围营造依然在线。',
    link: 'https://endfield.hypergryph.com/',
  },
  {
    slug: 'nikke-goddess-of-victory',
    name: '胜利女神：妮姬',
    cover: { glyph: '🎀', tone: 'sakura', label: '放置射击' },
    coverGradient: 'linear-gradient(135deg, #FFB7C5, #6C5CE7)',
    genre: '第三人称射击放置',
    platforms: ['PC', '手机'],
    status: 'playing',
    rating: 3.5,
    tags: ['放置', '射击', '二次元'],
    shortReview: '美术加上背身射击的视角，辨识度极高。放置玩法很轻，适合碎片时间。',
    review:
      '定位很清晰：超动态的角色表现 + 轻量放置。背身射击的视角和角色设计在二次元手游里独树一帜，剧情和活动更新频率也保持得不错。战斗基本可以自动，日常负担很小，适合当作副游。不过深度内容相对有限，追求硬核射击体验的话可能会觉得不够。',
    link: 'https://nikke.hotcool.tw/',
  },
];

/** 数字格式化：214 → 214，1234 → 1,234 */
export function formatHours(value: number): string {
  return value.toLocaleString('zh-CN');
}

export interface GameStatsData {
  total: number;
  playing: number;
  mainstay: number;
  cleared: number;
  hours: number;
  /** 有游戏内档案的条目的活跃天数合计 */
  activeDays: number;
  profileCount: number;
}

export function computeStats(list: Game[]): GameStatsData {
  const withProfile = list.filter((g) => g.profile?.activeDays !== undefined);

  return {
    total: list.length,
    playing: list.filter((g) => g.status === 'playing').length,
    mainstay: list.filter((g) => g.status === 'mainstay').length,
    cleared: list.filter((g) => g.status === 'cleared').length,
    hours: list.reduce((sum, g) => sum + (g.playtime ?? 0), 0),
    activeDays: withProfile.reduce((sum, g) => sum + (g.profile?.activeDays ?? 0), 0),
    profileCount: withProfile.length,
  };
}

/** 「最近在玩」置顶区：正在玩 → 常驻 → 偶尔玩 */
export function pickSpotlight(list: Game[], limit = 3): Game[] {
  const rank: Record<GameStatus, number> = {
    playing: 0,
    mainstay: 1,
    casual: 2,
    cleared: 3,
    shelved: 4,
    wishlist: 5,
  };
  return [...list]
    .filter((g) => rank[g.status] <= 1)
    .sort(
      (a, b) =>
        rank[a.status] - rank[b.status] ||
        (b.rating ?? 0) - (a.rating ?? 0) ||
        (b.playtime ?? 0) - (a.playtime ?? 0),
    )
    .slice(0, limit);
}

/** 供筛选栏使用：只保留实际出现的类型 */
export function activeGenres(list: Game[]): GameGenre[] {
  return GENRES.filter((genre) => list.some((g) => g.genre === genre));
}
