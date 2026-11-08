#!/usr/bin/env bash
# build-film.sh — assembles the chained shots into ONE continuous film for /film (the page plays it by scroll).
#   film/d/0001.webp …  desktop frames, 1280x720
#   film/m/0001.webp …  phone frames, 540x900 portrait crop that follows the subject of each shot
#   film/poster.jpg, film/poster-m.jpg   the first frame (before JS, without motion, while frames load)
#   film/film.json      { n, shots: { S1: [firstFrame, frameCount], … } } — the page anchors sections to shots
# Shots are listed in order as  name:file:phone-crop-centre(0..1)[:first-last]  (source frame range to keep).
# Clips 2+ start one frame late (their first frame duplicates the previous clip's last), everything is normalised
# to 24fps and every 2nd frame is kept: 12 frames per film second, blended on the page into continuous motion.
set -euo pipefail
cd "$(dirname "$0")"
BIN=$(ls -d /c/Users/Alon/AppData/Local/Microsoft/WinGet/Packages/Gyan.FFmpeg*/ffmpeg-*/bin 2>/dev/null | head -1)
FF="${BIN:+$BIN/}ffmpeg"; FP="${BIN:+$BIN/}ffprobe"
OUT=../../film; STEP=2
SHOTS=(
  "S1:raw/C1-seedance-final.mp4:0.10"
  "S2:raw/chain/S2.mp4:0.25"
  "S3:raw/chain/S3.mp4:0.45"
  "S4:raw/chain/S4.mp4:0.45"
  "S5:raw/chain/S5.mp4:0.45"
  "S6:raw/chain/S6.mp4:0.50"
  "S7:raw/chain/S7.mp4:0.40"
  "BR:raw/chain/BW2.mp4:0.40>0.90"    # bridge, phone crop panning from S7.s centre to S8.s (Wan 3.0 first/last frame): exactly S7's last frame → exactly S8 frame 56
  "S8:raw/chain/S8.mp4:0.90:57-186"   # phone crop on the right, where the taxi stops; from the frame after the bridge lands to the cut before the second figure
  "S9:raw/chain/S9.mp4:0.50"
)
tmp=$(mktemp -d); command -v cygpath >/dev/null && tmp=$(cygpath -m "$tmp")
mkdir -p "$OUT/d" "$OUT/m"; rm -f "$OUT"/d/*.webp "$OUT"/m/*.webp   # clear the frames, not the folders (a local server may hold them open)
json='{'; total=0; first=1
for spec in "${SHOTS[@]}"; do
  spec=${spec%%#*}; spec=${spec%% *}
  IFS=: read -r name file cx range <<<"$spec"
  [ -f "$file" ] || { echo "stop at $name (missing $file)"; break; }
  if [ -n "${range:-}" ]; then a=${range%-*}; b=${range#*-}; else a=$([ $first = 1 ] && echo 0 || echo 1); b=99999; fi
  sel="fps=24,select='between(n\,$a\,$b)',setpts=N/24/TB"   # fps=24 first: a 30fps clip (the Wan bridge) keeps its real speed
  pick="select='not(mod(n\,$STEP))',setpts=N/12/TB"
  "$FF" -v error -y -i "$file" -vf "$sel,scale=1280:720:flags=lanczos,$pick" -fps_mode vfr -an -c:v libx264 -crf 8 -preset fast "$tmp/$name-d.mp4"
  n=$("$FP" -v error -count_frames -select_streams v -show_entries stream=nb_read_frames -of csv=p=0 "$tmp/$name-d.mp4")
  # phone crop: a fixed centre ("0.45"), or a pan across the clip ("0.40>0.72") so the crop meets both neighbours without a jump
  # and a clip whose centre differs from where the previous clip's crop ended eases over from it in its first 1.5 s
  if [[ $cx == *">"* ]]; then c0=${cx%>*}; c1=${cx#*>}; u="min(1\,n/$((n * STEP - 1)))"; cxe="($c0+($c1-$c0)*(3*pow($u\,2)-2*pow($u\,3)))"   # eased in and out
  elif [ -n "${prevcx:-}" ] && [ "$prevcx" != "$cx" ]; then c1=$cx; cxe="($prevcx+($cx-$prevcx)*(1-pow(1-min(1\,n/36)\,2)))"
  else c1=$cx; cxe=$cx; fi
  prevcx=$c1
  "$FF" -v error -y -i "$file" -vf "$sel,scale=-2:900:flags=lanczos,crop=540:900:(iw-540)*$cxe:0,$pick" -fps_mode vfr -an -c:v libx264 -crf 8 -preset fast "$tmp/$name-m.mp4"
  "$FF" -v error -y -i "$tmp/$name-d.mp4" -start_number $((total + 1)) -c:v libwebp -quality 64 -compression_level 6 "$OUT/d/%04d.webp"
  "$FF" -v error -y -i "$tmp/$name-m.mp4" -start_number $((total + 1)) -c:v libwebp -quality 62 -compression_level 6 "$OUT/m/%04d.webp"
  if [ $first = 1 ]; then
    "$FF" -v error -y -i "$tmp/$name-d.mp4" -frames:v 1 -q:v 3 "$OUT/poster.jpg"
    "$FF" -v error -y -i "$tmp/$name-m.mp4" -frames:v 1 -q:v 3 "$OUT/poster-m.jpg"
  fi
  [ $first = 1 ] || json+=','
  json+="\"$name\":[$total,$n]"; total=$((total + n)); first=0
  echo "$name: $n frames (from $((total - n)))"
done
echo "{\"n\":$total,\"shots\":$json}}" > "$OUT/film.json"
echo "film: $total frames · desktop $(du -sh "$OUT/d" | cut -f1) · phone $(du -sh "$OUT/m" | cut -f1)"
cat "$OUT/film.json"; echo
# keep the manifest inlined in the page in step (index.html reads it from <script id="film-data">)
node -e 'const fs=require("fs"),p="../../index.html",open="<script type=\"application/json\" id=\"film-data\">";let s=fs.readFileSync(p,"utf8");const m=fs.readFileSync("../../film/film.json","utf8").trim(),i=s.indexOf(open),j=s.indexOf("<"+"/script>",i);if(i<0||j<0)throw new Error("film-data not found");s=s.slice(0,i+open.length)+m+s.slice(j);fs.writeFileSync(p,s)' && echo "index.html manifest updated"
rm -rf "$tmp"
