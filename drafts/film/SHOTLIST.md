# SmartKav · "טייק אחד" · רשימת שוטים והנחיות יצירה

מסלול B: סרטוני AI בתשלום, באישור של אלון (8.11.2026). אלון מייצר את הסרטונים בעצמו לפי המסמך הזה, ואני מעבד אותם ומחבר לדף.

---

## 1. איך סרטון של 5 שניות "מחזיק" גלילה ארוכה
בגלילה חיה **הסרטון לא מתנגן**. כל פריים מוצמד לנקודה בגלילה, והגולש מזיז את הפריימים בעצמו:
- לקליפ של 5 שניות ב-24fps יש 120 פריימים. אם פורשים אותם על גלילה של 150% מגובה המסך, כל פיקסל של גלילה מזיז את המצלמה קצת. בגלילה איטית זה נראה כמו צילום ארוך ואיטי.
- **אורך הקליפ לא קובע את אורך הגלילה.** אני קובע בקוד כמה גלילה כל שוט מקבל, וחותך, מאט או מאיץ בעיבוד.
- קליפ ארוך יותר הוא לא יתרון. הוא רק מוסיף משקל לדף ומגדיל את הסיכוי שהמודל "יתבלבל" באמצע. **5 שניות זה האידיאל, ו-8 זה המקסימום.**
- מה שכן חשוב הוא **תנועה איטית, רציפה ובמהירות קבועה**. גלילה מגדילה כל רעד, קפיצה או שינוי צורה.

**מה אני עושה עם כל קליפ:** חותך את ההתחלה והסוף, מיישר את הצבע בין השוטים, מייצא רצף תמונות (WebP: ‏1920px לדסקטופ ו-1080px לנייד, בערך 60–90 פריימים לשוט), טוען קודם פריים אחד מכל ארבעה ואחר כך משלים את השאר, ומחבר את הכול ל-ScrollTrigger. ב-reduced-motion ובכשל CDN מוצג פריים סטטי.

---

## 2. איפה מייצרים
**Higgsfield** (higgsfield.ai): מנוי אחד שנותן גישה ל-**Seedance 2.0**, ל-**Veo 3.1** ול-**Kling 3.0**, וכך אפשר להריץ אותו שוט בשלושתם ולבחור.
- לבחור תוכנית ש**כוללת Seedance 2.0 ו-Veo 3.1**. לפי כמה ביקורות, התוכנית הזולה ביותר לא כוללת אותם. צריך לבדוק בדף המחירים לפני שמשלמים.
- חודש אחד מספיק. הקרדיטים לא עוברים לחודש הבא.
- **תמונות המפתח** (Keyframes): ‏Nano Banana Pro בתוך Higgsfield, או Gemini. הכי חשוב לעשות אותן באותו כלי, כדי שהעולם יישאר עקבי.

**הגדרות לכל קליפ:**
- 16:9, ‏1080p (או 4K אם יש), ‏24fps
- 5 שניות (ב-Veo: ‏8)
- **בלי אודיו** (חוסך קרדיטים, אין לו שימוש)
- מצב **Start + End frame** (פריים פתיחה ופריים סיום)
- להוריד את הקובץ המקורי באיכות הגבוהה ביותר, בלי לכווץ

---

## 3. השיטה: קודם תמונות מפתח, אחר כך קליפים ביניהן
כדי שארבעה קליפים ייראו כמו **טייק אחד**, כל קליפ נבנה בין שתי תמונות מפתח (K), והתמונה שבה קליפ אחד נגמר היא התמונה שבה הבא מתחיל:

```
K0 ──C1──▶ K1 ──C2──▶ K2          (22:40: מהעיר אל השולחן)
K3 ──C3──▶ K4 ──C4──▶ K5          (01:00: השער, ואופציונלי חזרה לשמיים)
```

**סדר העבודה:**
1. **שלב א:** מייצרים את K0–K4 (ו-K5 אם רוצים) ושולחים לי. אני מניח אותן מתחת לכותרות של הדף ובודק קומפוזיציה, ניגודיות ומקום לטקסט.
2. **שלב ב:** מייצרים את C1 בשלושת המודלים, שניים-שלושה ניסיונות בכל אחד. אני בונה ממנו אב-טיפוס של ה-Hero, ואנחנו בוחרים מודל.
3. **שלב ג:** מייצרים את C2–C4 במודל שנבחר.

**כללים לכל תמונות המפתח:**
- **הצד הימני של הפריים (כ-40%) כהה ושקט.** שם יושבות הכותרות (הדף מימין לשמאל). הנושא נמצא במרכז או משמאל.
- אותה שעה, אותה עיר, אותה פלטה: ענבר של פנסי נתרן מול כחול-כהה. חשיפה כהה.
- בלי טקסט, שלטים קריאים, לוגו, לוחיות רישוי קריאות או פנים.
- כשמייצרים את K1 מתוך K0 (וכן הלאה): לתת לכלי את התמונה הקודמת כרפרנס ולבקש "same scene", כמו שכתוב בפרומפטים.

---

## 4. תמונות המפתח

### K0 · ‏22:40 · העיר מלמעלה (פתיחת ה-Hero)
```
Photorealistic aerial night photograph, very high above a modern Mediterranean coastal metropolis similar to the Tel Aviv metropolitan area, camera looking down at about 55 degrees. Highways and main roads are thin, sharp amber light trails from car headlights and taillights, long exposure. Dense grid of mid-rise office and residential buildings with sparse warm window lights. In the center-left of the frame, one mid-rise office tower is slightly more visible than its neighbors, with a single fully lit floor. The right 40% of the frame is darker and calmer, mostly dark rooftops. Deep blue-black atmosphere, no stars, no moon. Very dark overall exposure, crushed blacks, warm sodium-vapor amber as the dominant light, subtle cool navy shadows. Full-frame camera, 35mm lens, f/8, ultra sharp, restrained cinematic color grade. No text, no logos, no signs, no people, no lens flare, no bloom, no glow. Aspect ratio 16:9.
```

### K1 · ‏22:40 · ירידה אל הבניין
(לתת את K0 כרפרנס)
```
Same scene, same city, same night, same color grade as the reference image. The camera has descended and moved closer: now at the height of the 20th floor, about 150 meters from the office tower with the single lit floor. The lit floor is a horizontal band of large glass windows in the center-left of the frame; through the glass one can faintly see an open-plan office with one desk lamp on and the glow of a computer monitor. The rest of the building is dark. Below, a road with thin amber light trails. The right 40% of the frame stays dark and calm. Photorealistic, 35mm lens, f/4, ultra sharp, no text, no logos, no readable signs, no people visible, no lens flare, no glow. Aspect ratio 16:9.
```

### K2 · ‏22:40 · השולחן (מעבר לסצנת הבלגן)
(לתת את K1 כרפרנס)
```
Same night and color grade as the reference image. Now inside that lit office floor, camera at desk height looking slightly down at a single work desk near the window. On the desk: a laptop with a softly glowing screen showing only a blurred, unreadable interface, a coffee mug, a closed notebook, and a smartphone lying face up in the center-left of the frame with its screen lit but completely blank and evenly glowing. Behind the desk, the floor-to-ceiling window shows the dark city with distant amber road lights, out of focus. The office around is empty and dark, one warm desk lamp. The right 40% of the frame is darker. Photorealistic, 50mm lens, f/2.8, shallow depth of field, gentle film grain. No text, no readable screens, no logos, no people, no lens flare, no glow. Aspect ratio 16:9.
```

### K3 · ‏01:00 · השער, לפני
```
Photorealistic night photograph at 1 AM outside a modern office building in an Israeli business park. Eye-level camera on the street facing a closed sliding metal gate and the building's glass entrance, which is softly lit from inside. Wet asphalt reflects a single warm sodium streetlight. An empty parking lot, a few lit office windows above, calm and quiet. No cars, no people. The bottom third of the frame is dark asphalt, empty, for text. Cinematic 35mm film look, f/2, natural color, amber and deep navy palette, gentle film grain. No text, no readable signs, no logos, no lens flare, no glow. Aspect ratio 16:9.
```

### K4 · ‏01:00 · השער, המונית הגיעה
(לתת את K3 כרפרנס)
```
Exactly the same scene, camera position, light and color grade as the reference image. Now a plain white sedan taxi has stopped beside the closed gate, headlights on, reflections of its headlights on the wet asphalt; its roof sign is unlit and has no lettering. A young woman in a light jacket, seen from behind, walks from the lit building entrance toward the taxi; she is small in the frame, in the upper left third. The bottom third of the frame stays dark asphalt, empty. Photorealistic, cinematic 35mm film look, gentle film grain. No text, no readable signs, no logos, no readable license plate, no visible face, no lens flare, no glow. Aspect ratio 16:9.
```

### K5 · ‏01:00 · חזרה לשמיים (אופציונלי, לפני הטופס)
(לתת את K4 וגם את K0 כרפרנס)
```
Same city and color grade as the reference images. Aerial night view from high above the same business park, camera looking down at about 55 degrees. Four long, calm, parallel streams of amber headlights flow along the main roads toward the residential neighborhoods, orderly and evenly spaced. The rest of the city is dark and quiet. The right 40% of the frame darker and calm. Photorealistic, 35mm, f/8, ultra sharp, long exposure. No text, no logos, no signs, no lens flare, no glow. Aspect ratio 16:9.
```

**בדיקה לתמונות המפתח:** שהן כהות מספיק לטקסט בהיר, שהצד הימני רגוע, שאין אותיות או לוגו, ושהמראה עקבי בין K0 ל-K1 ל-K2 (אותה עיר ואותו גוון).

---

## 5. הקליפים

**פתיח קבוע לכל פרומפט וידאו:**
```
Single continuous shot, no cuts. Smooth, slow, constant-speed camera move on a stabilized drone or dolly, no shake, no zoom pulsing, no speed ramps. The scene stays physically consistent: buildings, roads and objects do not morph, appear or disappear. Realistic motion blur only on moving car lights.
```

**שליליות (אם יש שדה negative):**
```
cuts, transitions, morphing, warping buildings, flickering lights, camera shake, handheld, text, letters, logos, watermark, faces, lens flare, bloom, glow, fast motion, time-lapse jumps
```

### C1 · ‏K0 → K1 · "הירידה" (ה-Hero, ננעל בגלילה)
```
[fixed opening]. The camera descends slowly and continuously from high above the night city toward the office tower with the single lit floor, while gently tilting from looking down to looking at the building straight on. Car light trails keep flowing along the roads below. The lit floor stays in the center-left of the frame for the whole move and grows larger. Ends exactly on the end frame.
```

### C2 · ‏K1 → K2 · "דרך החלון" (מעבר לסצנת הבלגן)
```
[fixed opening]. The camera glides slowly forward toward the lit floor and passes smoothly through the glass window into the office, without any flash or reflection burst, settling at desk height over the desk with the smartphone. The phone screen stays blank and evenly lit. The city lights behind fall gently out of focus. Ends exactly on the end frame.
```

### C3 · ‏K3 → K4 · "המונית מגיעה" (סצנת 01:00)
```
[fixed opening]. Locked-off camera with a very slow push-in. A white taxi with headlights on enters from the left side of the frame, drives slowly and stops beside the gate; its headlight reflections slide across the wet asphalt. A young woman, seen from behind, walks out of the lit entrance toward the taxi. The bottom third of the frame stays dark. Ends exactly on the end frame.
```

### C4 · ‏K4 → K5 · "חזרה לשמיים" (אופציונלי)
```
[fixed opening]. As the taxi pulls away, the camera rises slowly and continuously straight up and back, revealing the business park and then the whole night city, where four calm parallel streams of amber headlights flow toward the neighborhoods. Ends exactly on the end frame.
```

**בדיקה לכל קליפ (לפסול אם אחד מאלה קורה):**
- יש חיתוך או קפיצה באמצע
- בניין, חלון, רכב או חפץ משנה צורה, מופיע או נעלם
- חלונות מהבהבים
- המצלמה רועדת, מאיצה או מאטה בפתאומיות
- מופיע טקסט, לוגו או פנים
- הפריים הראשון או האחרון לא דומים לתמונת המפתח

---

## 6. נייד
בשלב הראשון, בנייד אני חותך את המרכז של אותם קליפים. אם התוצאה נראית חלשה, נייצר גרסת 9:16 רק ל-C1 ול-C3 (אותם פרומפטים, `Aspect ratio 9:16`, והנושא במרכז).

---

## 7. איך מעבירים לי
- לשמור בתיקייה `drafts/film/raw/` בשמות הבאים, ולהגיד לי:
  - `K0.png` … `K5.png`
  - `C1-seedance-1.mp4`, ‏`C1-veo-1.mp4`, ‏`C1-kling-1.mp4` וכן הלאה (שם המודל ומספר הניסיון)
- הקבצים המקוריים **לא נכנסים לגיט**, כי הריפו ציבורי וכבד. התיקייה `raw` מוחרגת ב-`.gitignore`, ונכנסים לגיט רק הפריימים המעובדים.
- לעיבוד אני צריך את **ffmpeg** במחשב. הוא עוד לא מותקן, ואתקין אותו (`winget install Gyan.FFmpeg`) רק אחרי שתאשר.

## 8. תקציב משוער
- מנוי Higgsfield לחודש, בתוכנית שכוללת Seedance ו-Veo.
- בערך 15–25 קליפים כולל ניסיונות, ו-10–15 תמונות מפתח.
- המחירים לא אחידים בין המקורות, אז צריך לבדוק בדף המחירים של Higgsfield.
