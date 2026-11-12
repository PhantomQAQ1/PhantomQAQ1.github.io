import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    /** 分类：决定封面渐变与首字 */
    category: z.enum(['随笔', '小说', '日志']),
    tags: z.array(z.string()).default([]),
    /** 手动指定封面色系，缺省按 slug 哈希 */
    tone: z.enum(['sakura', 'mint', 'night']).optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { posts };
