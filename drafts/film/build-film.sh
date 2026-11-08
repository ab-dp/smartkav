#!/usr/bin/env bash
# build-film.sh — assembles the chained shots into ONE continuous film for drafts/proposal/film/.
#   film/d/0001.webp …  desktop frames, 1280x720
#   film/m/0001.webp …  phone frames, 720x720 square crop that follows the subject of each shot
#   film/poster.jpg     the first frame (shown before JS, without motion and while frames load)
#   film/film.json      { n, shots: { S1: firstFrame, … } } — the page anchors sections to shots
# Shots are listed in order below as  name:file:phone-crop-centre(0..1)[:last-source-frame]. Clips 2+ drop their first frame
# (it duplicates the previous clip's last frame), and everything is kept at 24fps, then every 3rd frame.
set -euo pipefail
cd "$(dirname "$0")"
BIN=$(ls -d /c/Users/Alon/AppData/Local/Microsoft/WinGet/Packages/Gyan.FFmpeg*/ffmpeg-*/bin 2>/dev/null | head -1)
FF="${BIN:+$BIN/}ffmpeg"; FP="${BIN:+$BIN/}ffprobe"
OUT=../../film; STEP=3   # 8 frames per film second: smooth under the lerped playhead, a third lighter
SHOTS=(
  "S1:raw/C1-seedance-final.mp4:0.10"
  "S2:raw/chain/S2.mp4:0.25"
  "S3:raw/chain/S3.mp4:0.45"
  "S4:raw/chain/S4.mp4:0.45"
  "S5:raw/chain/S5.mp4:0.45"
  "S6:raw/chain/S6.mp4:0.50"
  "S7:raw/chain/S7.mp4:0.40"
  "S8:raw/chain/S8.mp4:0.72:186"
  "S9:raw/chain/S9.mp4:0.50"
)
tmp=$(mktemp -d); command -v cygpath >/dev/null && tmp=$(cygpath -m "$tmp")
rm -rf "$OUT"; mkdir -p "$OUT/d" "$OUT/m"
json='{'; total=0; first=1
for spec in "${SHOTS[@]}"; do
  IFS=: read -r name file cx last <<<"$spec"; last=${last:-99999}   # optional 4th field: cut the shot after this source frame
  [ -f "$file" ] || { echo "stop at $name (missing $file)"; break; }
  skip=$([ $first = 1 ] && echo 0 || echo 1)
  # normalise every shot to 1280x720 / 24fps, drop the junction duplicate (and anything after a cut), keep every 3rd frame
  "$FF" -v error -y -i "$file" -vf "select='between(n\,$skip\,$last)',setpts=N/24/TB,scale=1280:720:flags=lanczos,select='not(mod(n\,$STEP))',setpts=N/8/TB" -fps_mode vfr -an -c:v libx264 -crf 10 -preset fast "$tmp/$name-d.mp4"
  "$FF" -v error -y -i "$file" -vf "select='between(n\,$skip\,$last)',setpts=N/24/TB,scale=-2:1080,crop=ih:ih:(iw-ih)*$cx:0,scale=720:720:flags=lanczos,select='not(mod(n\,$STEP))',setpts=N/8/TB" -fps_mode vfr -an -c:v libx264 -crf 10 -preset fast "$tmp/$name-m.mp4"
  n=$("$FP" -v error -count_frames -select_streams v -show_entries stream=nb_read_frames -of csv=p=0 "$tmp/$name-d.mp4")
  "$FF" -v error -y -i "$tmp/$name-d.mp4" -start_number $((total + 1)) -c:v libwebp -quality 56 -compression_level 6 "$OUT/d/%04d.webp"
  "$FF" -v error -y -i "$tmp/$name-m.mp4" -start_number $((total + 1)) -c:v libwebp -quality 52 -compression_level 6 "$OUT/m/%04d.webp"
  [ $first = 1 ] && "$FF" -v error -y -i "$tmp/$name-d.mp4" -frames:v 1 -q:v 4 "$OUT/poster.jpg"
  [ $first = 1 ] || json+=','
  json+="\"$name\":[$total,$n]"; total=$((total + n)); first=0
  echo "$name: $n frames (from $total)"
done
echo "{\"n\":$total,\"shots\":$json}}" > "$OUT/film.json"
echo "film: $total frames · desktop $(du -sh "$OUT/d" | cut -f1) · phone $(du -sh "$OUT/m" | cut -f1)"
cat "$OUT/film.json"; echo
rm -rf "$tmp"
