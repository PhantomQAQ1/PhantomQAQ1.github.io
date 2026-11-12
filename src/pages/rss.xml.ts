import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getPosts, readingTime } from '../lib/posts';

export async function GET(context: APIContext) {
  const posts = await getPosts();

  return rss({
    title: 'Phanatomcat · 海螺手帐',
    description: '一只住在海螺里的猫的私人手帐：轻小说、插画，和一些没头没尾的日常。',
    site: context.site ?? 'https://phanatomcat.example.com',
    trailingSlash: false,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: `/posts/${post.id}`,
      categories: post.data.tags,
      customData: `<language>zh-CN</language><readingTime>${readingTime(post)}</readingTime>`,
    })),
    customData: '<language>zh-CN</language>',
  });
}
