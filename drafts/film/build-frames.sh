#!/usr/bin/env bash
# Turns the chosen Higgsfield clips (drafts/film/raw/*.mp4) into scroll-scrubbed WebP frame sequences
# for drafts/proposal/film/. Run from anywhere: bash drafts/film/build-frames.sh
#
# Output per sequence:
#   film/<name>/d/0000.webp …  desktop, 1280x720
#   film/<name>/m/0000.webp …  phone, 720x720 square crop around the subject (the canvas covers-crops it to portrait)
#   film/<name>/poster.jpg     first frame, shown before JS / in reduced motion
#   film/<name>/end.jpg        last frame, the resting state
set -euo pipefail
cd "$(dirname "$0")"
BIN=$(ls -d /c/Users/Alon/AppData/Local/Microsoft/WinGet/Packages/Gyan.FFmpeg*/ffmpeg-*/bin 2>/dev/null | head -1)
FF="${BIN:+$BIN/}ffmpeg"
OUT=../proposal/film
STEP=2            # keep every 2nd frame (24fps → 12 frames per clip second)
Q_D=68; Q_M=62    # WebP quality

# seq <name> <mobile crop center x 0..1> <clip:skip_first_frames> ...
seq() {
  local name=$1 cx=$2; shift 2
  local tmp; tmp=$(mktemp -d); command -v cygpath >/dev/null && tmp=$(cygpath -m "$tmp")   # ffmpeg on Windows needs a Windows path in the concat list
  rm -rf "$OUT/$name"; mkdir -p "$OUT/$name/d" "$OUT/$name/m"
  local parts=() i=0
  for spec in "$@"; do
    local clip=${spec%%:*} skip=${spec##*:}
    # drop the first frames (the model's jump from the still into motion), normalise to 24fps
    "$FF" -v error -y -i "raw/$clip" -vf "select='gte(n\,$skip)',setpts=N/24/TB" -an -c:v libx264 -crf 12 -preset fast "$tmp/p$i.mp4"
    parts+=("file '$tmp/p$i.mp4'"); i=$((i+1))
  done
  printf '%s\n' "${parts[@]}" > "$tmp/list.txt"
  "$FF" -v error -y -f concat -safe 0 -i "$tmp/list.txt" -c copy "$tmp/all.mp4"
  "$FF" -v error -y -i "$tmp/all.mp4" -vf "select='not(mod(n\,$STEP))',setpts=N/12/TB,scale=1280:720:flags=lanczos" -fps_mode vfr -c:v libwebp -quality $Q_D -compression_level 6 "$OUT/$name/d/%04d.webp"
  "$FF" -v error -y -i "$tmp/all.mp4" -vf "select='not(mod(n\,$STEP))',setpts=N/12/TB,crop=ih:ih:(iw-ih)*$cx:0,scale=720:720:flags=lanczos" -fps_mode vfr -c:v libwebp -quality $Q_M -compression_level 6 "$OUT/$name/m/%04d.webp"
  "$FF" -v error -y -i "$tmp/all.mp4" -vf "select='eq(n\,0)',scale=1600:-2" -frames:v 1 -q:v 4 "$OUT/$name/poster.jpg"
  "$FF" -v error -y -sseof -0.1 -i "$tmp/all.mp4" -vf "scale=1600:-2" -frames:v 1 -q:v 4 "$OUT/$name/end.jpg"
  local n; n=$(ls "$OUT/$name/d" | wc -l)
  echo "$name: $n frames, desktop $(du -sh "$OUT/$name/d" | cut -f1), phone $(du -sh "$OUT/$name/m" | cut -f1)"
  rm -rf "$tmp"
}

# Hero: the descent (C1) and the flight through the window to the desk (C2), as one take.
seq hero 0.10 C1-seedance-final.mp4:3 C2-seedance-final.mp4:3
# 01:00: the taxi arrives at the gate (C3).
if [ -f raw/C3-seedance-final.mp4 ]; then seq gate 0.60 C3-seedance-final.mp4:3; fi
