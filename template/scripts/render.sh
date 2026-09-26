#!/bin/zsh
# 整片渲染：VER=v1 scripts/render.sh  → renders/<slug>_v1.mp4 + fin_frames/ + renders/sheet_v1.html
# 环境变量：VER=版本号｜CONC=并发（默认 6）｜GL=渲染后端（默认 angle，可 swangle）｜RTIMEOUT=单帧超时
# 若整片渲出「固定帧号可复现」的平铺撕裂坏帧（长渲染页面池退化，GPU/并发档位/抽帧均排不掉）：CONC=1 串行重渲即愈（muse-ban 第十二片实锤，时长 +~3 分钟）。
set -e
ROOT=$(cd "$(dirname "$0")/.." && pwd); cd "$ROOT"
V=${VER:-v1}
SLUG=$(python3 -c "import re;print(re.search(r\"slug:\\s*'([^']+)'\", open('src/config.ts').read()).group(1))")
mkdir -p renders
[ "${SKIP_BUNDLE:-0}" = 1 ] && [ -d build_full ] || { rm -rf build_full && npx remotion bundle src/index.ts --out-dir build_full --log=error; }
npx remotion render build_full Video "renders/${SLUG}_${V}.mp4" --codec=h264 --crf=16 --concurrency=${CONC:-6} --gl=${GL:-angle} --timeout=${RTIMEOUT:-300000} --log=error
[ -s "renders/${SLUG}_${V}.mp4" ] || { echo "RENDER FAILED"; exit 1; }
rm -rf fin_frames && mkdir -p fin_frames
ffmpeg -v error -y -i "renders/${SLUG}_${V}.mp4" -q:v 4 fin_frames/f_%04d.jpg
ls fin_frames | wc -l > fin_count.txt
python3 scripts/sheet.py fin_frames "renders/sheet_${V}.html" 60 || true
[ "${KEEP_BUNDLE:-0}" = 1 ] || rm -rf build_full
echo done > render.done
