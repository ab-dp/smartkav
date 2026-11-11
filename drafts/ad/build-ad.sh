#!/usr/bin/env bash
# build-ad.sh — assembles the 20-second ad: the AI shots cut to the timeline, the graphics layer on top
# (raw/gfx/fNNNN.png, rendered from comp.html at 24fps with a transparent background), and the voice-over
# when raw/vo.wav exists (otherwise a silent track). Output: smartkav-ad-9x16.mp4, 1080×1920, H.264 + AAC 48kHz.
# The cut list below mirrors T in comp.html: scene [start, end] on the timeline, the shot file, and the in-point in it.
set -euo pipefail
cd "$(dirname "$0")"
BIN=$(ls -d /c/Users/Alon/AppData/Local/Microsoft/WinGet/Packages/Gyan.FFmpeg*/ffmpeg-*/bin 2>/dev/null | head -1)
FF="${BIN:+$BIN/}ffmpeg"
OUT=${1:-smartkav-ad-9x16.mp4}
TOTAL=21.4   # the ad's length, timed to the voice-over (which starts at VO_AT)
VO_AT=0.3
#      start  end   source (or "black")   in-point  [slow-down factor]
CUTS=( "0.0   5.3   raw/shot1.mp4  0.0  1.32"
       "5.3   8.1   raw/shot2.mp4  0.8"
       "8.1   10.7  black          0"
       "10.7  12.9  raw/shot3.mp4  0.9"
       "12.9  17.0  raw/shot4.mp4  0.3"
       "17.0  19.1  raw/shot5.mp4  1.9"
       "19.1  21.4  black          0" )
inputs=(); chain=""; i=0; labels=""
for c in "${CUTS[@]}"; do
  read -r a b src in slow <<<"$c"; len=$(awk "BEGIN{print $b-$a}"); slow=${slow:-1}
  if [ "$src" = black ]; then inputs+=(-f lavfi -t "$len" -i "color=c=0x0B0D11:s=1080x1920:r=24")
  else inputs+=(-ss "$in" -i "$src"); fi
  # a shot shorter than its scene plays a little slower (blended frames keep the motion smooth)
  sp=""; [ "$slow" != 1 ] && sp="setpts=$slow*PTS,minterpolate=fps=24:mi_mode=blend,"
  # every shot: to 1080×1920, 24fps, the site's night grade (a little darker and less saturated), exact length
  chain+="[$i:v]${sp}scale=1080:1920:force_original_aspect_ratio=increase:flags=lanczos,crop=1080:1920,fps=24,setsar=1,eq=brightness=-0.035:saturation=0.86:contrast=1.03,trim=duration=$len,setpts=PTS-STARTPTS[v$i];"
  labels+="[v$i]"; i=$((i+1))
done
gfx=$i; inputs+=(-framerate 24 -i "raw/gfx/f%04d.png")
VO=$(ls raw/vo.wav raw/vo-src.mp3 2>/dev/null | head -1 || true)
ms=$(awk "BEGIN{print int($VO_AT*1000)}")
if [ -n "$VO" ]; then inputs+=(-i "$VO"); aud="[$((gfx+1)):a]aresample=48000,adelay=${ms}|${ms},apad,atrim=0:$TOTAL,afade=t=out:st=$(awk "BEGIN{print $TOTAL-0.35}"):d=0.35[a]"
else inputs+=(-f lavfi -t "$TOTAL" -i "anullsrc=r=48000:cl=stereo"); aud="[$((gfx+1)):a]anull[a]"; fi
chain+="${labels}concat=n=$i:v=1:a=0,vignette=PI/5[base];[$gfx:v]format=rgba[g];[base][g]overlay=0:0:format=auto,fade=t=in:st=0:d=0.25,format=yuv420p[v];$aud"
"$FF" -v error -y "${inputs[@]}" -filter_complex "$chain" -map "[v]" -map "[a]" -t "$TOTAL" \
  -c:v libx264 -preset medium -crf 18 -profile:v high -pix_fmt yuv420p -movflags +faststart -c:a aac -b:a 192k -ar 48000 "$OUT"
echo "built $OUT ($(du -h "$OUT" | cut -f1))"
