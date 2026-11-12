import { getCollection, type CollectionEntry } from 'astro:content';
import GithubSlugger from 'github-slugger';

export type Post = CollectionEntry<'posts'>;

/** 全部已发布文章，按时间倒序 */
export async function getPosts(): Promise<Post[]> {
  const posts = await getCollection('posts', ({ data }) => !data.draft);
  return posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

/** 中文阅读时长：约 350 字/分钟，最少 1 分钟 */
export function readingTime(post: Post): number {
  const text = (post.body ?? '').replace(/\s+/g, '');
  return Math.max(1, Math.round(text.length / 350));
}

const MONTHS = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];

export function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = MONTHS[date.getMonth()];
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}.${m}.${d}`;
}

export function isoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export interface Heading {
  depth: number;
  text: string;
  slug: string;
}

/** 从 Markdown 正文里抽取 h2 / h3，供目录使用（slug 与 rehype-slug 一致） */
export function getHeadings(post: Post): Heading[] {
  const slugger = new GithubSlugger();
  const headings: Heading[] = [];
  let inFence = false;

  for (const line of (post.body ?? '').split('\n')) {
    if (/^\s*```/.test(line)) inFence = !inFence;
    if (inFence) continue;

    const match = /^(#{2,3})\s+(.+?)\s*$/.exec(line);
    if (!match) continue;

    const text = match[2].replace(/[`*_]/g, '');
    headings.push({ depth: match[1].length, text, slug: slugger.slug(text) });
  }

  return headings;
}

export interface TagInfo {
  name: string;
  count: number;
  /** 最近一次使用的时间，用于排序 */
  latest: number;
}

export async function getTags(posts: Post[]): Promise<TagInfo[]> {
  const map = new Map<string, TagInfo>();
  for (const post of posts) {
    for (const name of post.data.tags) {
      const item = map.get(name) ?? { name, count: 0, latest: 0 };
      item.count += 1;
      item.latest = Math.max(item.latest, post.data.pubDate.valueOf());
      map.set(name, item);
    }
  }
  return [...map.values()].sort((a, b) => b.count - a.count || b.latest - a.latest);
}

/** 分类 → 封面 tone */
export function toneOf(post: Post): 'sakura' | 'mint' | 'night' {
  if (post.data.tone) return post.data.tone;
  const map = { 随笔: 'sakura', 小说: 'night', 日志: 'mint' } as const;
  return map[post.data.category] ?? 'sakura';
}

/** 转成 PostCard 需要的形状 */
export function toCard(post: Post) {
  return {
    slug: post.id,
    title: post.data.title,
    excerpt: post.data.description,
    date: formatDate(post.data.pubDate),
    readingTime: readingTime(post),
    label: post.data.category,
    tone: toneOf(post),
    tags: post.data.tags.map((name) => ({ name })),
  };
}

export function tagHref(name: string): string {
  return `/tags/${encodeURIComponent(name)}`;
}
