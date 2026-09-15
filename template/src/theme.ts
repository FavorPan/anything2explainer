import {VIDEO} from './config';

/**
 * 配色主题（唯一取色处；ui.tsx / fx.tsx / overlay / common 全部从这里取语义角色值）。
 * `config.ts` 的 `style` 选择：'mint' 小清新浅色（默认）｜'dark' 暗色科技（样片《RAG 与知识库》风格）。
 * 新增主题 = 在 THEMES 里加一个对象（角色字段见 Theme），镜头代码不用改。
 * 颜色语义（主题无关）：accent=当前重点/激活、灰=未激活/背景、warn=指标/警示/对方、line/text=结构线条与文字、ok=正确。
 * dark 的每个值都是主题化改造前的原值（含硬投影/柔光/雾底），保证暗色片零回归。
 */
export type StyleName = 'mint' | 'dark';

export type Theme = {
  base: string; // 画布底色（Main 的 AbsoluteFill background；镜头不要再画不透明底）
  // 结构：描边/箭头、正文文字、图形默认填充、次级填充（芯片未点亮格 / 机架层）、流程轨已过态
  line: string;
  text: string;
  textRGB: string; // text 的 'r,g,b'（拼 rgba 半透明用）
  fill: string;
  fillDim: string;
  railDone: string;
  // 重点色族（accent=当前重点/激活/品牌；light=高光端/active 卡边；tech=Exo 2 英文技术词；deep=曲线/硬投影；pale=淡底）
  accent: string;
  accentLight: string;
  accentTech: string;
  accentDeep: string;
  accentPale: string;
  accentOnFill: string; // 重点色作为浅色卡上的小字/描边（active 卡标题等；dark=亮紫 / mint=深薄荷，保可读）
  // 辅助语义色
  warn: string; // 指标数字 / 另一方 / 强调
  coral: string; // 叉
  redDeep: string; // 深红警示块
  ok: string; // 勾（正确）
  grey: string; // 非重点文字
  greyMid: string; // 灰块
  greyLine: string; // 网格线
  greyLight: string; // 卡内文本线条
  // 光效
  glowRGB: string; // 'r,g,b'：柔光基色（拼 rgba 用）
  glowA: [number, number]; // glowAccent(k) 双层 alpha（k=1）
  glowSA: number; // glowAccentS(k) alpha
  glow: string; // 主角双层柔光（GLOW_ACCENT）
  glowS: string; // 单层重点光（GLOW_ACCENT_S）
  glowOrange: string; // GLOW_ORANGE
  glowRed: string; // GLOW_RED
  bloom: string; // 结构线白/墨 bloom
  bloomSoft: string;
  textGlow: string; // 文字光（'none' = 无）
  pillShadow: string; // HUD/胶囊 filter
  techGlow: string; // TechText shadow
  bigShadow: string; // 大数字/片名硬投影
  ghostGlow: string; // GhostText 紫雾
  haloStops: [string, string, string]; // 光环渐变（深端/重点/高光端）
  trapStops: Array<[number, number, number[]]>; // Trap 灰↔重点渐变 stops（[offset, 灰端灰度, 重点端 rgb]）
  ballGrad: string; // GradBall 球体渐变
  tiltFill: string; // TiltPlane 填充
  vignetteRGB: string; // 暗角/亮角基色
  vignetteAlpha: number;
  // 幕底
  fog: {from: string; to: string} | null; // 雾底渐变（null = 无；mint 用光斑替代）
  bokeh: {count: number; rMin: number; rMax: number; alpha: number} | null; // 光斑层（mint 专属）
  dustOpacity: number; // 浮尘/星点整体透明度
  star: string; // 粒子色（dark 白星 / mint 墨色浮尘）
  dotBase: string; // 点阵波底色
  dotColor: string; // 点阵波点色
  dotAlphaScale: number; // 点阵波 alpha 缩放（浅底点要更淡）
  dotOuter: string; // 点阵波外层 div 背景
  // 字幕
  subColor: string;
  subStroke: number;
  subStrokeColor: string;
  // 进度条
  played: string; // 已播
  track: string; // 未播
  divider: string; // 分隔线
  // 片尾与分隔线
  ending: string; // 片尾压底色（dark 压黑 / mint 压底色）
  hr: string; // 片头/署名卡下的短横线
  bigStroke: string; // 大字 WebkitTextStroke（dark 1px 黑边 / mint 无）
};

export const THEMES: Record<StyleName, Theme> = {
  // ---------- 暗色科技（默认前的原体系；值 = 改造前原值，勿动） ----------
  dark: {
    base: '#000000',
    line: '#FFFFFF',
    text: '#FFFFFF',
    textRGB: '255,255,255',
    fill: '#000000',
    fillDim: '#141414',
    railDone: '#2A2A2A',
    accent: '#6630F8',
    accentLight: '#A175F1',
    accentTech: '#6530F4',
    accentDeep: '#5A3AD5',
    accentPale: '#E6DCFF',
    accentOnFill: '#A175F1',
    warn: '#F05F41',
    coral: '#F16043',
    redDeep: '#EC081F',
    ok: '#8FF740',
    grey: '#A0A0A1',
    greyMid: '#747474',
    greyLine: '#4A4A4A',
    greyLight: '#D4D4D4',
    glowRGB: '102,45,248',
    glowA: [0.35, 0.45],
    glowSA: 0.6,
    glow: '0 0 12px 3px rgba(102,45,248,.35), 0 0 42px 14px rgba(102,45,248,.45)',
    glowS: '0 0 24px 8px rgba(102,45,248,.6)',
    glowOrange: '0 0 40px rgba(243,95,69,.75), 0 0 100px 10px rgba(243,95,69,.25)',
    glowRed: '0 0 60px 20px rgba(236,8,31,.42), 0 0 20px 6px rgba(236,8,31,.45)',
    bloom: 'drop-shadow(0 0 3px rgba(255,255,255,0.5))',
    bloomSoft: 'drop-shadow(0 0 2px rgba(255,255,255,0.35))',
    textGlow: '0 0 12px rgba(255,255,255,.55), 0 0 4px rgba(255,255,255,.35)',
    pillShadow: 'drop-shadow(0 0 2px rgba(200,180,255,.6))',
    techGlow: '0 0 6px rgba(80,30,200,.7)',
    bigShadow: '6px 6px 0 #6630F8, 0 0 28px rgba(102,45,248,.45)',
    ghostGlow: '0 0 22px rgba(161,117,241,.95)',
    haloStops: ['#3A1E8C', '#6630F8', '#8F62F5'],
    trapStops: [[0, 224, [230, 220, 255]], [0.18, 190, [170, 140, 250]], [0.45, 160, [110, 60, 248]], [0.6, 160, [102, 45, 248]], [0.8, 178, [125, 85, 248]], [1, 224, [230, 220, 255]]],
    ballGrad: 'linear-gradient(180deg, #F0F0F0 0%, #E8E8E8 3%, #919191 11.7%, #787878 20%, #5B5B5B 28%, #313131 40%, #0F0F0F 50%, #000 58%, #000 100%)',
    tiltFill: 'rgba(0,0,0,.85)',
    vignetteRGB: '0,0,0',
    vignetteAlpha: 0.4,
    fog: {from: '#000000', to: '#212121'},
    bokeh: null,
    dustOpacity: 1,
    star: '#ffffff',
    dotBase: '#0b0c11',
    dotColor: '#cfe0ff',
    dotAlphaScale: 1,
    dotOuter: '#0b0b0f',
    subColor: '#FFFFFF',
    subStroke: 4,
    subStrokeColor: '#000000',
    played: 'rgba(190,170,250,0.52)',
    track: 'rgba(243,243,243,0.32)',
    divider: 'rgba(255,255,255,0.9)',
    ending: '#000000',
    hr: 'rgba(255,255,255,0.35)',
    bigStroke: '1px #000',
  },
  // ---------- 薄荷苏打（小清新浅色，默认）：墨线白卡 + 薄荷重点 + 光斑雾底 ----------
  mint: {
    base: '#F4FAF6',
    line: '#223A32',
    text: '#223A32',
    textRGB: '34,58,50',
    fill: '#FFFFFF',
    fillDim: '#E7EFEA',
    railDone: '#DCE7E0',
    accent: '#35B581',
    accentLight: '#7AD9B4',
    accentTech: '#1F7A56',
    accentDeep: '#1F7A56',
    accentPale: '#D9F3E8',
    accentOnFill: '#1F7A56',
    warn: '#F08A5D',
    coral: '#E2725B',
    redDeep: '#EC081F',
    ok: '#4A9DE0', // 绿勾撞重点色 → 青蓝勾
    grey: '#7C8781',
    greyMid: '#97A19B',
    greyLine: '#C7D2CB',
    greyLight: '#D5E0D9',
    glowRGB: '53,181,129',
    glowA: [0.2, 0.28],
    glowSA: 0.4,
    glow: '0 0 12px 3px rgba(53,181,129,.2), 0 0 42px 14px rgba(53,181,129,.28)',
    glowS: '0 0 24px 8px rgba(53,181,129,.4)',
    glowOrange: '0 0 40px rgba(240,138,93,.55), 0 0 100px 10px rgba(240,138,93,.18)',
    glowRed: '0 0 60px 20px rgba(236,8,31,.28), 0 0 20px 6px rgba(236,8,31,.32)',
    bloom: 'drop-shadow(0 0 3px rgba(34,58,50,.22))',
    bloomSoft: 'drop-shadow(0 0 2px rgba(34,58,50,.16))',
    textGlow: 'none',
    pillShadow: 'drop-shadow(0 0 2px rgba(53,181,129,.35))',
    techGlow: '0 0 6px rgba(31,122,86,.45)',
    bigShadow: '6px 6px 0 rgba(53,181,129,.8), 0 0 28px rgba(53,181,129,.3)',
    ghostGlow: '0 0 22px rgba(122,217,180,.8)',
    haloStops: ['#1F7A56', '#35B581', '#7AD9B4'],
    trapStops: [[0, 236, [206, 232, 219]], [0.18, 214, [148, 208, 180]], [0.45, 196, [86, 178, 133]], [0.6, 196, [53, 181, 129]], [0.8, 205, [110, 199, 156]], [1, 236, [206, 232, 219]]],
    ballGrad: 'linear-gradient(180deg, #223A32 0%, #2E4A3E 3%, #557164 12%, #6B8578 20%, #8FA69A 28%, #B9CDC3 40%, #DDE8E2 50%, #F2F7F4 58%, #FFFFFF 100%)',
    tiltFill: 'rgba(255,255,255,.92)',
    vignetteRGB: '34,58,50',
    vignetteAlpha: 0.1,
    fog: null,
    bokeh: {count: 15, rMin: 26, rMax: 96, alpha: 0.05},
    dustOpacity: 0.5,
    star: '#223A32',
    dotBase: '#F4FAF6',
    dotColor: '#223A32',
    dotAlphaScale: 0.45,
    dotOuter: '#F4FAF6',
    subColor: '#223A32',
    subStroke: 0,
    subStrokeColor: 'rgba(0,0,0,0)',
    played: 'rgba(53,181,129,0.4)',
    track: 'rgba(34,58,50,0.13)',
    divider: 'rgba(255,255,255,0.9)',
    ending: '#F4FAF6',
    hr: 'rgba(34,58,50,0.35)',
    bigStroke: '0px rgba(0,0,0,0)',
  },
};

export const STYLE: StyleName = VIDEO.style;
export const THEME = THEMES[STYLE];
