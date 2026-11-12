# Phanatomcat · 海螺手帐

一个用 Astro + Tailwind 写的静态个人博客：文章、标签、游戏库、关于页。
轻二次元 / 日系清新风格，支持深色模式、站内搜索（Pagefind）、RSS 与 sitemap。

## 本地开发

```bash
npm install
npm run dev          # http://localhost:4321
```

## 构建

```bash
npm run build        # astro build 后自动跑 pagefind 生成搜索索引
npm run preview      # 本地预览 dist
```

只构建 HTML（跳过搜索索引）：`npm run build:only`。

## 内容

| 内容 | 位置 |
| --- | --- |
| 文章 | `src/content/posts/*.md` |
| 游戏数据 | `src/data/games.ts` |
| 游戏账号截图 | `src/assets/game-accounts/<slug>/`（文件名即图说） |
| 头像 / 静态资源 | `public/` |

## 部署

推送到 `main` 分支后，GitHub Actions 自动构建并发布到 GitHub Pages
（见 `.github/workflows/deploy.yml`）。首次部署前需要在仓库
**Settings → Pages → Build and deployment → Source** 里选择 **GitHub Actions**。
