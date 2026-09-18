import React from 'react';
import {useCurrentFrame} from 'remotion';
import {FONT_HEAVY} from './lib';
import {kf} from './easing';
import {fitSize} from './textfit';
import {TOTAL_FRAMES, CHAPTER_STARTS, SENTENCES} from './timeline';

/**
 * 底部章节进度条（半透明条体 y687–720、填充右缘 x=1280·N/TOTAL、n−1 根分隔线、章节名粗黑斜体 24px），来源于一条 MG 科普原片的实测模型（半透明条体 y687–720、填充右缘 x=1280·N/TOTAL、3 根分隔线、4 个章节名粗黑斜体 24px），
 * 章节切换帧来自 timeline.ts（tts_build.py 自动生成），当前章高亮保持到片尾。章名 ≤6 字为宜。
 */
import {THEME} from '../theme';

export const PROGRESS_ALPHA = 0.52;
export const FILL_RGBA = THEME.played; // 已播（dark 紫调 / mint 薄荷调）
export const TRACK_RGBA = THEME.track; // 未播
export const BAR_TOP = 687;
export const BAR_H = 720 - BAR_TOP;
// 当前章高亮切在**章节卡起始帧**（上一章末句 to+3），不是本章首句帧——否则章节卡宣告新章的 45 帧里进度条还亮着上一章（QC v1 C2 #1；lessons「覆盖层」）
const cardStart = (c: {n: number; from: number}) => {
  const prev = [...SENTENCES].reverse().find((x) => x.chapter < c.n);
  return prev ? prev.to + 3 : c.from;
};
const FROMS = CHAPTER_STARTS.map((c, i) => (i === 0 ? c.from : cardStart(c)));
// 分隔线/章名中心按**实际章时长比例**落位：分隔线 x = 该章切换帧的填充比例位置（1280·f/TOTAL），高亮切换瞬间填充右缘恰好触及分隔线。
// 旧版按章数等宽分割（(i+1)·1280/NCH），章时长不均时每根线与真实章界错开几十 px、填充晚 10–17 s 才越过（第七片成片反馈）。
export const DIVIDERS = FROMS.slice(1).map((f) => Math.round((1280 * f) / TOTAL_FRAMES));
const EDGES = [0, ...DIVIDERS, 1280];
const CENTERS = FROMS.map((_, i) => Math.round((EDGES[i] + EDGES[i + 1]) / 2));
const SLOTS = EDGES.slice(0, -1).map((e, i) => EDGES[i + 1] - e - 30); // 章名不得压到分隔线上（英文章名长，自动缩到 17px 兜底）
export const DIVIDER_W = 4;
export const CHAPTERS: Array<{text: string; cx: number; from: number}> = CHAPTER_STARTS.map((c, i) => ({text: c.title, cx: CENTERS[i] ?? 640, from: FROMS[i]}));
export const CHAPTER_HIGHLIGHT_END = TOTAL_FRAMES + 1;
export const LABEL_SIZE = 24;
export const LABEL_SLOT_W = Math.min(...SLOTS);
export const LABEL_SCALE_Y = 0.9;
export const LABEL_TOP = 690.5;
export const LABEL_SKEW = -10;
export const LABEL_DIM_ALPHA = 0.55;

export const currentChapter = (N: number) => {
  if (N >= CHAPTER_HIGHLIGHT_END) return -1;
  let idx = -1;
  for (let i = 0; i < CHAPTERS.length; i++) if (N >= CHAPTERS[i].from) idx = i;
  return idx; // 片头（第一章开始前）无高亮
};

export const ProgressBar: React.FC<{dimKf?: Array<[number, number]>; frame?: number}> = ({dimKf = [], frame}) => {
  const cur = useCurrentFrame();
  const N = frame ?? cur + 1;
  const fillW = (1280 * N) / TOTAL_FRAMES;
  const dim = dimKf.length ? kf(N, dimKf) : 1;
  const ch = currentChapter(N);
  return (
    <div style={{position: 'absolute', left: 0, top: BAR_TOP, width: 1280, height: BAR_H, pointerEvents: 'none'}}>
      <div style={{position: 'absolute', left: 0, top: 0, width: 1280, height: BAR_H, transform: 'translateY(0.25px)'}}>
        <div style={{position: 'absolute', left: fillW, top: 0, width: 1280 - fillW, height: BAR_H, background: TRACK_RGBA}} />
        <div style={{position: 'absolute', left: 0, top: 0, width: fillW, height: BAR_H, background: FILL_RGBA}} />
        {dim < 0.999 ? <div style={{position: 'absolute', left: 0, top: 0, width: 1280, height: BAR_H, background: '#000', opacity: 1 - dim}} /> : null}
      </div>
      {DIVIDERS.map((x) => (
        <div key={x} style={{position: 'absolute', left: x - DIVIDER_W / 2, top: 693 - BAR_TOP, width: DIVIDER_W, height: 22, background: THEME.divider}} />
      ))}
      {CHAPTERS.map((c, i) => (
        <div
          key={c.text}
          style={{
            position: 'absolute', left: c.cx, top: LABEL_TOP - BAR_TOP,
            transform: `translateX(-50%) skewX(${LABEL_SKEW}deg) scaleY(${LABEL_SCALE_Y})`, transformOrigin: '50% 50%',
            whiteSpace: 'nowrap', fontFamily: FONT_HEAVY, fontWeight: 900, fontSize: fitSize(c.text, SLOTS[i] ?? LABEL_SLOT_W, LABEL_SIZE, 17), lineHeight: 1,
            color: i === ch ? THEME.text : `rgba(${THEME.textRGB},${LABEL_DIM_ALPHA})`,
          }}
        >
          {c.text}
        </div>
      ))}
    </div>
  );
};
