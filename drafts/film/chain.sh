#!/usr/bin/env bash
# chain.sh <name> <mp4-url> [prev-name]
# Downloads one chained Higgsfield clip into raw/chain/, extracts its literal first and last frames,
# measures the junction against the previous clip's last frame (SSIM), and writes a contact sheet.
# The last frame (<name>-last.jpg) is the start image of the next clip. Adapted from scroll-film-studio.
set -euo pipefail
cd "$(dirname "$0")/raw/chain"
BIN=$(ls -d /c/Users/Alon/AppData/Local/Microsoft/WinGet/Packages/Gyan.FFmpeg*/ffmpeg-*/bin 2>/dev/null | head -1)
FF="${BIN:+$BIN/}ffmpeg"; FP="${BIN:+$BIN/}ffprobe"
NAME=$1; URL=$2; PREV=${3:-}
curl -fsSL -o "$NAME.mp4" "$URL"
"$FF" -y -v error -i "$NAME.mp4" -vf "select=eq(n\,0)" -frames:v 1 -update 1 "$NAME-first.png"
"$FF" -y -v error -sseof -0.05 -i "$NAME.mp4" -update 1 "$NAME-last.png"
"$FF" -y -v error -i "$NAME-last.png" -q:v 2 "$NAME-last.jpg"
"$FF" -y -v error -i "$NAME.mp4" -vf "select='not(mod(n\,12))',scale=480:-1,tile=4x3" -frames:v 1 -q:v 3 "$NAME-sheet.jpg"
echo "$NAME: $("$FP" -v error -select_streams v -show_entries stream=width,height,nb_frames -of csv=p=0 "$NAME.mp4")"
if [ -n "$PREV" ]; then
  SSIM=$( ("$FF" -i "$PREV-last.png" -i "$NAME-first.png" -lavfi "[0]scale=1280:720[a];[1]scale=1280:720[b];[a][b]ssim" -f null - 2>&1 || true) | grep -o 'All:[0-9.]*' | cut -d: -f2)
  echo "junction $PREV -> $NAME SSIM: $SSIM"
fi
