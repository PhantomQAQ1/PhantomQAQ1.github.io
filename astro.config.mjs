import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import rehypeSlug from 'rehype-slug';

export default defineConfig({
  // GitHub Pages 用户站点：https://<user>.github.io/
  // 如果以后改成项目仓库（https://<user>.github.io/<repo>/），
  // 这里要同时补 base: '/<repo>'，并把站内绝对链接改成 base 前缀。
  site: 'https://phantomqaq1.github.io',
  trailingSlash: 'ignore',
  devToolbar: { enabled: false },
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/styleguide'),
    }),
  ],
  markdown: {
    rehypePlugins: [rehypeSlug],
    shikiConfig: { theme: 'rose-pine-dawn', wrap: true },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
