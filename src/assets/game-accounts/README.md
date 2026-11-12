# 账号内容截图（游戏详情页用）

把游戏里的个人主页、角色一览、战绩面板等截图丢进对应文件夹即可，**不用改代码**。

```
src/assets/game-accounts/
├── honkai-star-rail/          崩坏：星穹铁道
├── genshin-impact/            原神
├── zenless-zone-zero/         绝区零
├── girls-frontline-2-exilium/ 少女前线2：追放
├── arknights-endfield/        明日方舟：终末地
└── nikke-goddess-of-victory/  胜利女神：妮姬
```

## 规则

- 支持 `png / jpg / jpeg / webp / avif`。
- 一个文件夹里放几张都行，**按文件名排序**显示（建议 `01-主页.png`、`02-角色.png`）。
- 文件名会变成截图说明：`01-角色一览.png` → 「01 角色一览」。所以文件名尽量起得像一句人话。
- 图片会被 Vite 处理（带 hash、按原比例显示），不需要手动缩放；但建议宽度 ≤ 2400px，避免页面太重。
- 加完图重新构建即可：
  ```bash
  npm run build
  ```
  对应游戏详情页的「ACCOUNT · 账号内容」区域就会自动出现这些截图；没放图时该区域显示三个虚线空位。

## 关于版权

只放**自己账号**的截图，不要放官方宣传图、角色立绘、Logo。截图里尽量裁掉或遮住 UID、好友码等账号信息。
