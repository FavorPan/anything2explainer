import React from 'react';
import {useCurrentFrame} from 'remotion';
import {rnd} from './easing';
import {STAR_DEFAULT, StarField} from './StarField';
import type {BgSpec} from './types';
import type {StarFieldProps} from './StarField';
import {THEME} from '../theme';

/**
 * 幕底方案一·浅色版（`config.style = 'mint'` 且 `bg = 'stars'` 时由 Main 挂载）：光斑雾底 + 墨色浮尘。
 * - 光斑：大颗柔边圆（radial-gradient），墨色低透明（α ≈ .03–.05），静态不漂移——彩光留给主角柔光，幕底保持中性，
 *   这样 frame_metrics.py 的柔光判据（重点色低饱和浅色带）不会被幕底触发。
 * - 浮尘：复用 StarField（color=墨色、低透明、慢速 drift），确定性同星点层。
 * - BgSpec 沿用：区间内 `stars:'none'` → 光斑与浮尘整层不画（片头前 10 帧 / 片尾与 dark 方案一致）；`fog` 字段在本主题下无效。
 */
export const LightBg: React.FC<{specs: BgSpec[]; defaultStars?: Partial<StarFieldProps>}> = ({specs, defaultStars}) => {
  const N = useCurrentFrame() + 1;
  let stars: Partial<StarFieldProps> = {...(defaultStars ?? {})};
  let show = true;
  for (const s of specs) {
    if (N < s.from || N > s.to) continue;
    if (s.stars !== undefined) stars = typeof s.stars === 'string' ? {variant: s.stars} : {...s.stars};
  }
  if (!show || stars.variant === 'none') return null;
  const b = THEME.bokeh!;
  const circles = Array.from({length: b.count}, (_, i) => {
    const x = rnd(11, i, 1) * 1280;
    const y = rnd(11, i, 2) * 720;
    const r = b.rMin + (b.rMax - b.rMin) * rnd(11, i, 3);
    const a = b.alpha * (0.6 + 0.8 * rnd(11, i, 4));
    return {x, y, r, a};
  });
  return (
    <div style={{position: 'absolute', inset: 0, pointerEvents: 'none'}}>
      {circles.map((c, i) => (
        <div
          key={i}
          style={{
            position: 'absolute', left: c.x - c.r, top: c.y - c.r, width: c.r * 2, height: c.r * 2, borderRadius: '50%',
            background: `radial-gradient(circle, rgba(${THEME.textRGB},${c.a.toFixed(3)}) 0%, rgba(${THEME.textRGB},${(c.a * 0.55).toFixed(3)}) 55%, rgba(${THEME.textRGB},0) 78%)`,
          }}
        />
      ))}
      {(() => {
        const dust: Partial<StarFieldProps> = {...STAR_DEFAULT, ...stars, count: 36, size: [1.5, 3], speed: 0.6, brightness: [60, 170], color: THEME.star, opacity: (stars.opacity ?? 1) * THEME.dustOpacity};
        return <StarField {...dust} />;
      })()}
    </div>
  );
};
