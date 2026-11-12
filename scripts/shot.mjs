// 截图 + 布局诊断脚本（CDP，无第三方依赖）
// 用法: node scripts/shot.mjs <url> <out.png> [width] [dpr] [theme] [diag]
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

// PowerShell 会丢弃空字符串参数，用 '--' 占位表示空
const argv = process.argv.slice(2).map((v) => (v === '--' ? '' : v));
const [url, out, w = '1440', dpr = '1', theme = 'light', diagSel = '', jsExpr = ''] = argv;
const width = Number(w);
const chrome = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'dsh-shot-'));

const child = spawn(
  chrome,
  [
    '--headless=new',
    '--disable-gpu',
    '--hide-scrollbars',
    '--no-first-run',
    '--no-default-browser-check',
    '--remote-debugging-port=0',
    `--user-data-dir=${profile}`,
    'about:blank',
  ],
  { stdio: 'ignore' }
);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function waitPort() {
  const f = path.join(profile, 'DevToolsActivePort');
  for (let i = 0; i < 150; i++) {
    if (fs.existsSync(f)) {
      const txt = fs.readFileSync(f, 'utf8').split('\n');
      if (txt[0]) return Number(txt[0].trim());
    }
    await sleep(100);
  }
  throw new Error('no devtools port');
}

const port = await waitPort();
const list = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
const page = list.find((t) => t.type === 'page');
const ws = new WebSocket(page.webSocketDebuggerUrl);
await new Promise((res, rej) => {
  ws.onopen = res;
  ws.onerror = rej;
});

let seq = 0;
const pending = new Map();
const events = [];
ws.onmessage = (ev) => {
  const msg = JSON.parse(ev.data);
  if (msg.id && pending.has(msg.id)) {
    const { res, rej } = pending.get(msg.id);
    pending.delete(msg.id);
    msg.error ? rej(new Error(JSON.stringify(msg.error))) : res(msg.result);
  } else if (msg.method) events.push(msg.method);
};

function send(method, params = {}) {
  const id = ++seq;
  return new Promise((res, rej) => {
    pending.set(id, { res, rej });
    ws.send(JSON.stringify({ id, method, params }));
  });
}

await send('Page.enable');
await send('Runtime.enable');
await send('Emulation.setDeviceMetricsOverride', {
  width,
  height: 1000,
  deviceScaleFactor: Number(dpr),
  mobile: width < 600,
});
await send('Page.navigate', { url });
for (let i = 0; i < 100 && !events.includes('Page.loadEventFired'); i++) await sleep(100);
await sleep(500);

// 主题：通过 ?theme 参数或直接加 class
await send('Runtime.evaluate', {
  expression: `document.fonts.ready.then(()=>true); (()=>{ const d=document.documentElement; d.classList.remove('dark','light'); d.classList.add('${theme}'); return 1 })()`,
  awaitPromise: false,
});
await sleep(400);

const metrics = await send('Page.getLayoutMetrics');
const h = Math.ceil(metrics.cssContentSize.height);

const diag = await send('Runtime.evaluate', {
  expression: `(() => {
    const r = [];
    const de = document.documentElement;
    const out = { scrollWidth: de.scrollWidth, clientWidth: de.clientWidth, scrollHeight: de.scrollHeight };
    for (const el of document.querySelectorAll('body *')) {
      const b = el.getBoundingClientRect();
      if (b.width === 0 || b.height === 0) continue;
      if (b.right > de.clientWidth + 1 || b.left < -1) {
        r.push({ tag: el.tagName.toLowerCase(), cls: (el.getAttribute('class')||'').slice(0,80), left: Math.round(b.left), right: Math.round(b.right), w: Math.round(b.width) });
      }
    }
    out.overflowing = r.slice(0, 24);
    ${diagSel ? `out.sel = "${diagSel}"; out.rects = [...document.querySelectorAll("${diagSel}")].map(e=>{const b=e.getBoundingClientRect();return {cls:(e.getAttribute("class")||"").slice(0,50),x:Math.round(b.x),y:Math.round(b.y),w:Math.round(b.width),h:Math.round(b.height)}});` : ''}
    return JSON.stringify(out);
  })()`,
  returnByValue: true,
});
console.log(diag.result.value);

if (jsExpr) {
  const r = await send('Runtime.evaluate', { expression: jsExpr, returnByValue: true, awaitPromise: true });
  console.log(JSON.stringify(r.result.value ?? r.result, null, 2));
  if (process.env.SHOT_AFTER !== '1') {
    ws.close();
    child.kill();
    process.exit(0);
  }
  await sleep(400);
}

const finalMetrics = await send('Page.getLayoutMetrics');
const h2 = Math.ceil(finalMetrics.cssContentSize.height);

const shot = await send('Page.captureScreenshot', {
  format: 'png',
  captureBeyondViewport: true,
  clip: { x: 0, y: 0, width, height: h2, scale: 1 },
});
fs.writeFileSync(out, Buffer.from(shot.data, 'base64'));
console.log(`wrote ${out} ${width}x${h2}`);

ws.close();
child.kill();
