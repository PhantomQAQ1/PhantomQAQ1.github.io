/**
 * 账号截图的自动收集。
 *
 * 约定：图片放在 `src/assets/game-accounts/<slug>/` 下，文件名即说明。
 * 构建时靠 import.meta.glob 自动收集，不需要在 games.ts 里登记。
 */
export interface GameShot {
  src: string;
  width: number;
  height: number;
  /** 由文件名生成的说明，例如 01-角色一览.png → 01 角色一览 */
  caption: string;
  alt: string;
}

const files = import.meta.glob('/src/assets/game-accounts/**/*.{png,jpg,jpeg,webp,avif}', {
  eager: true,
  import: 'default',
}) as Record<string, { src: string; width: number; height: number }>;

export function getGameShots(slug: string, name: string): GameShot[] {
  const prefix = `/src/assets/game-accounts/${slug}/`;

  return Object.entries(files)
    .filter(([path]) => path.startsWith(prefix))
    .sort(([a], [b]) => a.localeCompare(b, 'zh-Hans-CN', { numeric: true }))
    .map(([path, image]) => {
      const file = path.split('/').pop() ?? '';
      const label = file.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' ');
      return {
        src: image.src,
        width: image.width,
        height: image.height,
        caption: label,
        alt: `${name} 账号截图：${label}`,
      };
    });
}

export function gameShotsFolder(slug: string): string {
  return `src/assets/game-accounts/${slug}/`;
}
