#!/usr/bin/env bash
# build-ad.sh — assembles the ad in two simple steps (one large filter graph deadlocked):
#   1. each scene of the cut list is cut, scaled to 1080×1920, graded and timed on its own, then the scenes are joined;
#   2. the graphics layer (raw/gfx/fNNNN.png, rendered from comp.html at 24fps, transparent) goes on top and the
#      voice-over (raw/vo.wav, else raw/vo-src.mp3) comes in at VO_AT.
# Output: smartkav-ad-9x16.mp4 (or $1), 1080×1920, H.264 + AAC 48kHz. The cut list mirrors T in comp.html.
set -euo pipefail
cd "$(dirname "$0")"
BIN=$(ls -d /c/Users/Alon/AppData/Local/Microsoft/WinGet/Packages/Gyan.FFmpeg*/ffmpeg-*/bin 2>/dev/null | head -1)
FF="${BIN:+$BIN/}ffmpeg"
OUT=${1:-smartkav-ad-9x16.mp4}
TOTAL=21.4   # the ad's length, timed to the voice-over (which starts at VO_AT)
VO_AT=0.3
#      start  end   source (or "black")   in-point  [slow-down factor]
CUTS=( "0.0   5.3   raw/shot1.mp4  0.0  1.32"
       "5.3   8.4   raw/shot2.mp4  0.8"
       "8.4   10.4  black          0"
       "10.4  12.9  raw/shot3.mp4  0.6"
       "12.9  17.0  raw/shot4.mp4  0.3"
       "17.0  19.6  raw/shot5.mp4  1.4"
       "19.6  21.4  black          0" )
# The footage runs on under each full-screen graphic while it dissolves in or out, so no cut lands on black.
TMP=raw/tmp; mkdir -p "$TMP"; : > "$TMP/list.txt"
GRADE="scale=1080:1920:force_original_aspect_ratio=increase:flags=lanczos,crop=1080:1920,setsar=1,eq=brightness=-0.035:saturation=0.86:contrast=1.03,vignette=PI/5"
i=0
for c in "${CUTS[@]}"; do
  read -r a b src in slow <<<"$c"; len=$(awk "BEGIN{print $b-$a}"); slow=${slow:-1}
  seg="$TMP/seg$i.mp4"
  hd="${src%.mp4}-hd.mp4"; [ "$src" != black ] && [ -f "$hd" ] && src="$hd"   # the full-quality take, when there is one
  if [ "$src" = black ]; then
    "$FF" -v error -y -f lavfi -i "color=c=0x0B0D11:s=1080x1920:r=24:d=$len" -c:v libx264 -preset veryfast -crf 16 -pix_fmt yuv420p "$seg"
  else
    # a shot shorter than its scene plays a little slower (blended frames keep the motion smooth)
    sp=""; [ "$slow" != 1 ] && sp="setpts=$slow*PTS,minterpolate=fps=24:mi_mode=blend,"
    "$FF" -v error -y -ss "$in" -i "$src" -vf "${sp}fps=24,$GRADE" -t "$len" -an -c:v libx264 -preset veryfast -crf 16 -pix_fmt yuv420p "$seg"
  fi
  echo "file 'seg$i.mp4'" >> "$TMP/list.txt"; i=$((i+1))
done
"$FF" -v error -y -f concat -safe 0 -i "$TMP/list.txt" -c copy "$TMP/base.mp4"
VO=$(ls raw/vo.wav raw/vo-src.mp3 2>/dev/null | head -1 || true)
ms=$(awk "BEGIN{print int($VO_AT*1000)}"); fo=$(awk "BEGIN{print $TOTAL-0.35}")
if [ -n "$VO" ]; then AIN=(-i "$VO"); AF="[2:a]aresample=48000,adelay=${ms}|${ms},apad,atrim=0:$TOTAL,afade=t=out:st=$fo:d=0.35[a]"
else AIN=(-f lavfi -t "$TOTAL" -i "anullsrc=r=48000:cl=stereo"); AF="[2:a]anull[a]"; fi
"$FF" -v error -y -i "$TMP/base.mp4" -framerate 24 -i "raw/gfx/f%04d.png" "${AIN[@]}" \
  -filter_complex "[1:v]format=rgba[g];[0:v][g]overlay=0:0:format=auto:eof_action=pass,fade=t=in:st=0:d=0.25,format=yuv420p[v];$AF" \
  -map "[v]" -map "[a]" -t "$TOTAL" -c:v libx264 -preset slow -crf 16 -profile:v high -pix_fmt yuv420p -movflags +faststart \
  -c:a aac -b:a 192k -ar 48000 "$OUT"
echo "built $OUT ($(du -h "$OUT" | cut -f1))"
