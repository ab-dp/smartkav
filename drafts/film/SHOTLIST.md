# SmartKav · "טייק אחד" · מדריך הפקה מלא ב-Higgsfield

מסלול B: סרטוני AI בתשלום, באישור של אלון (8.11.2026). אלון מייצר ב-Higgsfield לפי המדריך הזה, ואני מעבד את הקבצים ומחבר אותם לדף.

**איך משתמשים במדריך:** כל פרומפט כאן שלם ומוכן להדבקה. מעתיקים את כל הבלוק כמו שהוא, מהשורה הראשונה עד האחרונה, בלי לקצר ובלי להשלים כלום. כל פרומפט כולל בתוכו את כל כללי העולם (עיר, שעה, צבע, קומפוזיציה ואיסורים), כי המודל לא זוכר מה היה בפרומפט הקודם.

---

## חלק 1 · למה 5 שניות זה האורך הנכון

בגלילה חיה הסרטון לא מתנגן. כל פריים מוצמד לנקודה בגלילה, והגולש מזיז את המצלמה בעצמו.
- לקליפ של 5 שניות יש 120 פריימים, ואני מחליט בקוד על כמה גלילה לפרוש אותם (למשל מסך וחצי). בגלילה איטית זה נראה כמו צילום ארוך ואיטי.
- **אורך הקליפ לא קובע את אורך הגלילה.** אני חותך, מאט או מאיץ בעיבוד.
- קליפ ארוך מכביד על הדף ומגדיל את הסיכוי שהמודל "יתבלבל" באמצע. Higgsfield עצמם ממליצים לבדוק את האזור של 5–8 שניות, כי שם מופיעות רוב הבעיות.
- **מה שחשוב באמת:** תנועת מצלמה אחת, איטית, רציפה ובמהירות קבועה. גלילה מגדילה כל רעד, קפיצה או שינוי צורה.

**מה אני עושה עם כל קליפ:** חותך, מיישר צבע בין השוטים, מייצא רצף תמונות WebP (‏1920px לדסקטופ ו-1080px לנייד, 60–90 פריימים לשוט), טוען קודם פריים אחד מכל ארבעה ואחר כך משלים, ומחבר הכול ל-ScrollTrigger. ב-reduced-motion ובכשל CDN מוצג פריים סטטי.

---

## חלק 2 · המפה

```
דסקטופ (16:9)
K0 ──C1──▶ K1 ──C2──▶ K2        22:40  העיר → הבניין → השולחן (ה-Hero ומעבר לבלגן)
K3 ──C3──▶ K4 ──C4──▶ K5        01:00  השער → המונית → חזרה לשמיים (לפני הטופס)

נייד (9:16), רק אם החיתוך מהדסקטופ ייראה חלש
M0 ──C1M──▶ M1                  ה-Hero בנייד
M3 ──C3M──▶ M4                  01:00 בנייד
```

| קובץ | מה זה | חובה? |
|---|---|---|
| K0, K1, K2 | תמונות מפתח של 22:40 | חובה |
| K3, K4 | תמונות מפתח של 01:00 | חובה |
| K5 | חזרה לשמיים | אופציונלי |
| C1 | הירידה (ה-Hero) | חובה |
| C2 | דרך החלון | חובה (יש גיבוי C2B) |
| C3 | המונית מגיעה | חובה |
| C4 | חזרה לשמיים | אופציונלי |
| M0, M1, M3, M4, C1M, C3M | גרסאות נייד | רק אם אבקש |

---

## חלק 3 · סדר העבודה

1. **שלב א · תמונות מפתח:** K0 ← K1 ← K2, ואז K3 ← K4 (ו-K5 אם רוצים). כל התמונות מייצרים ישר ב-**2K**. **שולחים לי לפני שממשיכים לווידאו.** אני מניח כל תמונה מתחת לכותרות של הדף ובודק.
2. **שלב ב · השוואת מודלים על C1:** ‏Seedance 2.5, ‏Kling 3.0 ו-Veo 3.1, שניים-שלושה ניסיונות בכל אחד. אני בונה מהם אב-טיפוס של ה-Hero עם גלילה חיה, ובוחרים מודל.
3. **שלב ג · שאר הקליפים:** C2, ‏C3 (ו-C4) במודל שנבחר.
4. **שלב ד · נייד:** רק אם אבקש אחרי שאבדוק חיתוך מהדסקטופ.

**כלל זהב (גם של Higgsfield):** כשתוצאה לא טובה, משנים **דבר אחד בלבד** בכל ניסיון: או את הפרומפט או את תמונת הרפרנס, ולא את שניהם.

---

## חלק 4 · הגדרות ב-Higgsfield

### תמונות · Nano Banana Pro
1. בתפריט העליון: **Image** ← בוחרים **Nano Banana Pro**.
2. מצב:
   - **Text-to-Image** ל-K0, ‏K3 ו-M0.
   - **Multi-reference** לכל השאר. מעלים את תמונות הרפרנס שכתובות ליד כל פרומפט, **בסדר שכתוב שם**, כי הפרומפט מתייחס אליהן לפי מספר (Image 1, ‏Image 2).
3. יחס מסך: **16:9** (בנייד **9:16**). אם אין בחירת יחס, השורה האחרונה בפרומפט כבר מבקשת אותו.
4. רזולוציה: **2K**, לכל התמונות ומההתחלה. לא מייצרים "שוב ב-4K": יצירה חוזרת נותנת תמונה אחרת, וממילא הווידאו יוצא ב-1080p, אז 2K מספיק. אם תמונה שאהבת יוצאת רכה מדי, משתמשים ב-**Upscale** על אותה תמונה.
5. מספר תוצאות: 4 בכל לחיצה, אם אפשר.
6. להוריד את הקובץ המקורי (PNG או JPG באיכות מלאה), לא צילום מסך.

### וידאו · Seedance 2.5 (וגם Kling 3.0 ו-Veo 3.1 להשוואה)
1. בתפריט העליון: **Video** ← בוחרים את המודל.
2. מעלים את תמונות המפתח:
   - **אם יש שדות "Start frame" ו-"End frame"** (או "First / Last frame"): תמונת הפתיחה בראשון ותמונת הסיום בשני.
   - **אם יש רק שדה רפרנסים:** מעלים את שתיהן לפי הסדר (קודם הפתיחה, אחר כך הסיום). הפרומפט כבר אומר למודל שהראשונה היא הפריים הראשון והשנייה האחרונה.
   - **אם המודל מקבל רק תמונה אחת:** מעלים את תמונת הפתיחה ומדביקים את אותו פרומפט. אחר כך אני בודק אם הסוף קרוב מספיק.
3. הגדרות:
   - **Duration:** ‏5s (ב-Veo: ‏8s, הקצר ביותר)
   - **Aspect ratio:** ‏16:9 (בנייד 9:16). לא Auto.
   - **Resolution:** ‏**1080p** (ב-Kling, אם יש 4K, לבחור 4K)
   - **Bitrate/Quality:** הגבוה ביותר
   - **Sound/Audio:** כבוי
   - **Enhance prompt / Magic prompt / Auto-prompt:** **כבוי**, כי הוא משכתב את הפרומפט וזורק פרטים.
4. להוריד את ה-MP4 המקורי באיכות המלאה.
5. אפשר לבדוק בזול ב-720p, וכשהפרומפט עובד לייצר את הגרסה הסופית ב-1080p.

---

## חלק 5 · תמונות המפתח (16:9)

### K0 · ‏22:40 · העיר מלמעלה
**מצב:** Text-to-Image · **רפרנסים:** אין · **יחס:** 16:9 · **קובץ:** `K0.png`

```
A real night photograph taken from a helicopter, very high above a modern Mediterranean coastal metropolis inspired by the Tel Aviv metropolitan area, at 22:40 on a weekday.

CAMERA AND FRAMING: The camera is about 600 meters above the ground, looking down at the city at a 55-degree angle. Full-frame digital cinema camera, 35mm lens, f/8, everything in sharp focus, perfectly level horizon. Horizontal 16:9 frame.

THE CITY: A dense grid of mid-rise office and residential blocks, 6 to 20 stories tall, pale stone and glass facades, flat roofs with small rooftop structures and water heaters, a few palm trees along the wide avenues. Two wide multi-lane highways and several main avenues cross the frame diagonally; car headlights and taillights form thin, sharp, continuous amber light trails from a long exposure. Most windows are dark; only a few scattered windows glow a warm amber-white. Far at the top-left edge, the dark sea meets the city with no visible horizon line.

THE HERO BUILDING: In the left part of the frame, about 35% from the left edge and 45% from the top, stands one rectangular 14-story office tower with a pale stone base and a dark glass curtain-wall facade and a flat roof. Exactly one floor of this tower, the 9th floor, is fully lit along its whole width with warm white-amber office light; every other floor of this tower is completely dark. This lit floor is the only fully lit floor in the whole frame, so the eye goes to it, but it is small and natural, not glowing.

COMPOSITION: The right 40% of the frame is darker and visually calm: mostly dark rooftops and a few faint street lights, no bright elements, because large white headline text will sit there. The brightest light trails run through the left and center of the frame.

LIGHT AND COLOR: Very dark overall exposure with crushed, deep blacks. The only light sources are warm sodium-vapor amber street lights, amber car light trails and a few warm windows. Shadows are a deep navy-black. No other colors: no neon, no blue or purple city glow, no green, no colored signs. The sky is a deep blue-black, no stars, no moon, no clouds lit by the city.

TEXTURE: Looks like a real photograph, natural fine film grain, true-to-life detail, no CGI sheen, no HDR look, no oversaturation, no painterly look, no miniature or tilt-shift effect.

EXCLUSIONS: No text, letters, numbers, signs, billboards, logos, watermarks. No people visible. No aircraft, drones or birds. No fog, haze, smoke. No lens flare, no bloom, no glow halos around lights, no light leaks, no vignette.

Aspect ratio 16:9.
```
**לבדוק:** שהתמונה כהה מאוד, שיש בניין אחד עם קומה מוארת אחת בשמאל-מרכז, שהצד הימני שקט, שהשובלים דקים וחדים, ושאין אף אות.

---

### K1 · ‏22:40 · ירידה אל הבניין
**מצב:** Multi-reference · **רפרנסים לפי הסדר:** ‏1 = ‏`K0` · **יחס:** 16:9 · **קובץ:** `K1.png`

```
Image 1 is the reference for the city, the hero office tower, the color palette, the exposure and the photographic look. Keep all of them exactly the same as in Image 1.

A real night photograph of the same city and the same moment, 22:40, but the camera has descended and moved much closer to the hero office tower from Image 1: the rectangular 14-story office tower with the pale stone base, the dark glass curtain-wall facade, and exactly one fully lit floor, the 9th floor.

CAMERA AND FRAMING: The camera is now in the air at the height of the 11th floor, about 120 meters away from the tower, looking at it almost straight on with a slight downward tilt of 10 degrees. Full-frame digital cinema camera, 35mm lens, f/4, sharp. Perfectly level, vertical lines of the building perfectly vertical. Horizontal 16:9 frame.

THE TOWER: The tower fills the left 60% of the frame from top to bottom. The lit 9th floor is a long horizontal band of large floor-to-ceiling glass windows, positioned about 35% from the left edge and 50% from the top of the frame. Through the glass of the lit floor one can softly see an open-plan office: rows of empty desks, one warm desk lamp switched on, and the soft glow of one computer screen near the window. No people. Every other floor of the tower is dark glass reflecting faint amber city lights.

AROUND THE TOWER: Below the tower, a street with thin amber light trails from passing cars. Neighboring buildings are dark with only a few warm windows.

COMPOSITION: The right 40% of the frame is darker and visually calm: dark neighboring rooftops and night sky, no bright elements, because large white headline text will sit there.

LIGHT AND COLOR: Same as Image 1. Very dark overall exposure, crushed deep blacks, warm sodium-vapor amber light only, deep navy-black shadows. No neon, no blue or purple glow, no other colors. Sky deep blue-black, no stars, no moon.

TEXTURE: A real photograph, natural fine film grain, no CGI sheen, no HDR look, no oversaturation.

EXCLUSIONS: No text, letters, numbers, signs, logos, watermarks. No people. No aircraft, drones or birds. No fog, haze, smoke. No lens flare, no bloom, no glow halos, no reflections bursting on the glass, no vignette.

Aspect ratio 16:9.
```
**לבדוק:** שזה אותו בניין ואותה עיר כמו ב-K0, שהקומה המוארת היא פס חלונות בשמאל-מרכז, שרואים בעדינות משרד ריק דרך הזכוכית, ושהצד הימני כהה.

---

### K2 · ‏22:40 · השולחן
**מצב:** Multi-reference · **רפרנסים לפי הסדר:** ‏1 = ‏`K1`, ‏2 = ‏`K0` · **יחס:** 16:9 · **קובץ:** `K2.png`

```
Image 1 is the reference for the lit office floor seen through the windows, the light and the color palette. Image 2 is the reference for the city outside and its amber lights. Keep the same night, the same palette and the same photographic look.

A real photograph taken inside the lit 9th-floor open-plan office from Image 1, at 22:40, right after the camera has come in through the window. Everyone has gone home except the person who sits at this desk, who is not in the frame.

CAMERA AND FRAMING: The camera is 1.2 meters above the floor, about 1 meter from a single work desk that stands right next to the floor-to-ceiling window, looking down at the desk at a 35-degree angle. Full-frame digital cinema camera, 50mm lens, f/2.8, shallow depth of field: the desk surface is sharp, the background softly out of focus. Horizontal 16:9 frame.

THE DESK: A light oak desk. On it, exactly these objects and nothing else:
- a black smartphone lying flat, face up, positioned about 35% from the left edge and 58% from the top of the frame, its screen fully lit with a plain, smooth, evenly glowing warm-white blank screen, with no icons, no text, no interface and no notch details;
- an open silver laptop toward the back-left of the desk, its screen glowing softly but completely out of focus and abstract, with no readable text;
- a white ceramic coffee mug, half full, to the right of the phone;
- a closed dark-gray notebook with a black pen on top, near the front edge of the desk.

THE ROOM: Behind the desk, the floor-to-ceiling window shows the dark city at night with distant amber street lights and car light trails, softly out of focus. The rest of the office is dark and empty: the outlines of other empty desks and chairs disappear into the shadow. One warm desk lamp on the left side of the desk is the main light, casting a warm pool of light on the desk.

COMPOSITION: The phone and the main pool of light are in the left 60% of the frame. The right 40% of the frame is darker and visually calm: the dark edge of the desk, a dark office chair and shadow, no bright elements, because large white headline text will sit there.

LIGHT AND COLOR: Warm amber-white desk lamp light, the soft glow of the phone and laptop screens, and the amber city lights outside. Deep navy-black shadows. No neon, no blue or purple light, no RGB lighting. Dark overall exposure.

TEXTURE: A real photograph, natural fine film grain, true-to-life material detail of the wood, ceramic and glass, no CGI sheen, no HDR look.

EXCLUSIONS: No text, letters, numbers, logos or brand marks anywhere, including on the phone, the laptop, the mug and the notebook. No readable screens. No people, no hands. No lens flare, no bloom, no glow halos, no vignette.

Aspect ratio 16:9.
```
**לבדוק:** שמסך הטלפון ריק לגמרי ובמקום שכתוב (שם יופיעו ההודעות שלנו), שאין לוגו על המחשב, ושהצד הימני כהה.

---

### K3 · ‏01:00 · השער, לפני
**מצב:** Text-to-Image · **רפרנסים:** אין · **יחס:** 16:9 · **קובץ:** `K3.png`

```
A real night photograph at 1:00 AM on a weekday, outside a modern office building in an Israeli business park, in the same Mediterranean coastal metropolis. The night shift is about to end. Calm, quiet, empty.

CAMERA AND FRAMING: Eye-level camera, 1.6 meters above the ground, standing on the access road about 25 meters from the building, facing it straight on. Full-frame digital cinema camera, 35mm lens, f/2, natural perspective, perfectly level, vertical lines perfectly vertical. Horizontal 16:9 frame.

THE BUILDING: A 6-story modern office building with a pale stone and dark glass facade. On the ground floor, in the center-left of the frame, a glass entrance lobby lit warmly from inside, with the glass doors closed. A few office windows on the upper floors are still lit warm; most are dark.

THE GATE: In front of the building, a closed sliding steel gate made of dark horizontal bars, about 2 meters tall, runs across the driveway from the center of the frame to the right. A narrow pedestrian path leads from the lobby doors to the left end of the gate.

THE STREET: The foreground is a dark, empty access road of wet asphalt after light rain. One tall streetlight on the left side of the frame casts a single warm sodium-vapor amber pool of light, reflected softly on the wet asphalt. No cars, no people, no animals.

COMPOSITION: The building, the lobby and the gate occupy the upper two thirds of the frame. The bottom third of the frame is dark, empty wet asphalt with only soft reflections, no objects and no bright spots, because white headline text will sit there.

LIGHT AND COLOR: Warm sodium-vapor amber from the streetlight, warm white-amber light from the lobby and a few windows, deep navy-black shadows and sky. No neon, no blue or purple light, no other colors. Dark overall exposure.

TEXTURE: A real photograph with a cinematic 35mm film look, natural fine film grain, no CGI sheen, no HDR look, no oversaturation.

EXCLUSIONS: No text, letters, numbers, signs, company names, logos, watermarks. No cars, no people. No fog, no haze. No lens flare, no bloom, no glow halos, no vignette.

Aspect ratio 16:9.
```
**לבדוק:** שהשליש התחתון כהה וריק, שהלובי והשער ברורים, ושאין שלט עם שם חברה.

---

### K4 · ‏01:00 · המונית בשער
**מצב:** Multi-reference · **רפרנסים לפי הסדר:** ‏1 = ‏`K3` · **יחס:** 16:9 · **קובץ:** `K4.png`

```
Image 1 is the exact reference for the location, the building, the gate, the streetlight, the camera position, the framing, the light, the color palette and the photographic look. Keep all of them exactly the same; do not move the camera and do not change the building.

The same moment, a few seconds later, 1:00 AM: the night shift has ended and the ride is already waiting.

NEW IN THE FRAME:
- A taxi: a plain white mid-size sedan of a generic, unbranded design with no badges, with a small unlit roof sign box on top that has no lettering at all. It has stopped on the access road just to the left of the gate, parked parallel to the building, its front facing right. Its low-beam headlights are on and its red taillights glow; the headlight light falls on the wet asphalt in front of it and its reflections stretch across the road. The taxi occupies about 22% of the frame width, positioned between 25% and 47% from the left edge, sitting in the middle third of the frame vertically.
- A woman: a young woman, about 30 years old, in a light beige jacket and dark trousers, with a small shoulder bag, seen from behind, walking calmly along the pedestrian path from the lit lobby doors toward the taxi. She is small in the frame, about 14% of the frame height, in the upper-left third of the frame between the lobby and the taxi. Her face is not visible.

KEEP: The bottom third of the frame stays dark wet asphalt with only soft reflections, empty, because white headline text will sit there.

LIGHT AND COLOR: Same as Image 1. Warm sodium-vapor amber, warm white headlights, red taillights, deep navy-black shadows. No neon, no blue or purple light. Dark overall exposure.

TEXTURE: A real photograph, cinematic 35mm film look, natural fine film grain, no CGI sheen, no HDR look.

EXCLUSIONS: No text, letters or numbers anywhere, including on the taxi roof sign, the doors and the license plate (the plate is blank or not visible). No logos, no brand badges, no company names. No visible face. No other people, no other cars. No lens flare, no bloom, no glow halos, no vignette.

Aspect ratio 16:9.
```
**לבדוק:** שהמצלמה לא זזה לעומת K3 (אפשר לעבור בין שתי התמונות ולראות שהבניין לא קופץ), שאין כיתוב על השלט ועל הלוחית, שהאישה מגבה, ושהשליש התחתון ריק.

---

### K5 · ‏01:00 · חזרה לשמיים (אופציונלי)
**מצב:** Multi-reference · **רפרנסים לפי הסדר:** ‏1 = ‏`K0`, ‏2 = ‏`K4` · **יחס:** 16:9 · **קובץ:** `K5.png`

```
Image 1 is the reference for the city, the aerial viewpoint, the exposure, the color palette and the photographic look. Image 2 is the reference for the office building and the business park at 1:00 AM. Keep the same city, the same palette and the same photographic look.

A real night photograph taken from a helicopter at 1:00 AM, very high above the same Mediterranean coastal metropolis, looking down at the business park where the office building from Image 2 stands, now small in the frame.

CAMERA AND FRAMING: About 500 meters above the ground, looking down at a 55-degree angle. Full-frame digital cinema camera, 35mm lens, f/8, sharp, level horizon. Horizontal 16:9 frame.

THE MOMENT: The city is quieter than at 22:40. From the business park in the left part of the frame, exactly four long, calm, parallel streams of amber car headlights flow along four main roads toward the residential neighborhoods, evenly spaced and orderly, like four lines on a map. The rest of the roads are almost empty and dark.

COMPOSITION: The four streams of light run through the left and center of the frame. The right 40% of the frame is darker and visually calm, dark rooftops only, because large white headline text will sit there.

LIGHT AND COLOR: Same as Image 1. Very dark exposure, crushed deep blacks, warm sodium-vapor amber only, deep navy-black shadows. No neon, no blue or purple glow. Sky deep blue-black, no stars, no moon.

TEXTURE: A real photograph, long exposure, natural fine film grain, no CGI sheen, no HDR look.

EXCLUSIONS: No text, letters, numbers, signs, logos, watermarks. No people. No aircraft, drones or birds. No fog, haze. No lens flare, no bloom, no glow halos, no vignette.

Aspect ratio 16:9.
```
**לבדוק:** שיש בדיוק ארבעה זרמי אור מסודרים, ושהמראה תואם ל-K0.

---

## חלק 6 · הקליפים (16:9)

### C1 · ‏K0 → K1 · "הירידה" (ה-Hero, ננעל בגלילה)
**פריים פתיחה:** ‏`K0` · **פריים סיום:** ‏`K1` · ‏5s · ‏16:9 · ‏1080p · בלי אודיו · **קבצים:** `C1-seedance-1.mp4`, ‏`C1-kling-1.mp4`, ‏`C1-veo-1.mp4` …

```
FRAMES: The first uploaded image is the exact first frame of the video. The second uploaded image is the exact last frame of the video. The video must start on the first image and end precisely on the second image.

GLOBAL STYLE: A real, photographic night shot of a modern Mediterranean coastal city inspired by Tel Aviv, filmed from a stabilized helicopter-mounted cinema camera. One single continuous shot, no cuts, no transitions. Very dark exposure, crushed blacks, warm sodium-vapor amber lights against deep navy-black shadows. Natural fine film grain, no CGI sheen, no HDR look. No text, no logos, no signs, no people.

SCENE: 22:40 on a weekday night. In the city below, one 14-story office tower with a pale stone base and a dark glass facade has exactly one fully lit floor, the 9th floor. Everything else in the tower is dark.

FIRST FRAME AND BLOCKING: The shot opens about 600 meters above the city, looking down at 55 degrees. The hero tower stands in the left part of the frame, about 35% from the left edge. The right 40% of the frame is dark and calm and stays dark and calm for the whole shot.

TIMELINE:
0.0s to 5.0s: The camera descends slowly and continuously toward the hero tower in one smooth curve, moving forward and down at the same time, while gently tilting up from looking down at 55 degrees to looking at the tower almost straight on. The lit 9th floor stays at the same place in the frame, about 35% from the left and around the vertical middle, and grows steadily larger until it becomes a horizontal band of glass windows through which an empty office with one desk lamp is softly visible. The move ends exactly on the last frame.

CAMERA: Stabilized helicopter gimbal, constant speed from the first frame to the last, no acceleration, no deceleration, no speed ramps, no shake, no wobble, no rotation or roll, no zoom, no zoom pulsing. The horizon and the vertical lines of the buildings stay level.

OPTICS: 35mm full-frame, deep focus, f/8 at the start becoming f/4 near the tower, sharp throughout.

PHYSICS: The buildings, the roads and the tower are solid architecture: they never bend, warp, morph, melt, flicker, appear or disappear, and they keep their exact shapes and positions relative to each other as the parallax changes naturally. Only the car light trails move, flowing steadily along the roads. Window lights do not flicker or switch on or off.

LIGHTING: Constant night lighting for the whole shot, no change in exposure, no flash, no glow, no lens flare, no bloom, no light leaks.

AUDIO: None. Silent.
```

**ב-Veo 3.1 (8 שניות):** אותו פרומפט, ובשורת ה-TIMELINE להחליף `0.0s to 5.0s` ב-`0.0s to 8.0s`.

**לבדוק (לפסול אם אחד מאלה קורה):**
- יש חיתוך או מעבר באמצע
- בניין, כביש או חלון משנה צורה, מופיע, נעלם או מהבהב
- המצלמה מאיצה, מאטה, רועדת, מסתובבת או עושה זום
- הקומה המוארת "קופצת" למקום אחר בפריים
- הפריים האחרון לא דומה ל-K1
- מופיע טקסט, לוגו או אנשים

---

### C2 · ‏K1 → K2 · "דרך החלון" (מעבר לסצנת הבלגן)
**פריים פתיחה:** ‏`K1` · **פריים סיום:** ‏`K2` · ‏5s · ‏16:9 · ‏1080p · בלי אודיו · **קבצים:** `C2-<model>-1.mp4`

```
FRAMES: The first uploaded image is the exact first frame of the video. The second uploaded image is the exact last frame of the video. The video must start on the first image and end precisely on the second image.

GLOBAL STYLE: A real, photographic night shot, one single continuous shot from a stabilized drone that flies into a building, no cuts, no transitions, no dissolves. Very dark exposure, crushed blacks, warm amber light against deep navy-black shadows. Natural fine film grain, no CGI sheen, no HDR look. No text, no logos, no people.

SCENE: 22:40. A 14-story office tower at night with exactly one fully lit floor, the 9th floor. Inside that floor, an empty open-plan office and one work desk next to the window with a warm desk lamp, a laptop, a white coffee mug, a closed notebook, and a black smartphone lying face up with a blank, evenly glowing screen.

FIRST FRAME AND BLOCKING: The shot opens outside, in the air about 120 meters from the tower, looking at the lit 9th floor, which is a horizontal band of glass windows at about 35% from the left edge of the frame. The right 40% of the frame is dark and stays dark through the whole shot.

TIMELINE:
0.0s to 3.0s: The camera flies slowly and steadily straight toward the lit band of windows; the windows grow until one window fills the frame and the empty office inside becomes clearly visible.
3.0s to 3.6s: The camera passes smoothly through the glass, as if the glass were not there, with no reflection burst, no flash, no white frame and no blur.
3.6s to 5.0s: Inside, the camera continues forward and gently tilts down, slowing very slightly and smoothly, and settles above the desk next to the window, looking down at 35 degrees, with the blank glowing smartphone at about 35% from the left and 58% from the top of the frame. The video ends exactly on the last frame.

CAMERA: Stabilized drone gimbal, smooth constant forward motion, only a very gentle slowdown in the last second, no shake, no rotation or roll, no zoom, no zoom pulsing.

OPTICS: 35mm outside becoming 50mm-like framing at the desk, focus pulls smoothly from the building to the desk surface; shallow depth of field at the end, with the city lights behind the window softly out of focus.

PHYSICS: The building, the windows, the desk and every object on it are solid and keep their exact shapes: no bending, warping, morphing, melting, appearing or disappearing. The smartphone screen stays blank and evenly lit for the whole shot, with no icons, no text and no interface. Window and lamp lights do not flicker.

LIGHTING: Constant night lighting, no exposure jumps when passing through the glass, no flash, no glow, no lens flare, no bloom, no light leaks.

AUDIO: None. Silent.
```

**לבדוק:** שהמעבר דרך הזכוכית חלק (בלי הבזק לבן או מריחה), שמסך הטלפון נשאר ריק עד הסוף, ושהחפצים על השולחן לא משתנים.

**C2B · גיבוי אם C2 נכשל פעמיים:** את המעבר "דרך החלון" אעשה בקוד (זום לתוך החלון של C1 ומעבר רך), וממך אצטרך רק תנועה איטית מעל השולחן.
**פריים פתיחה:** ‏`K2` בלבד · ‏5s · ‏16:9 · ‏1080p · בלי אודיו · **קובץ:** `C2B-<model>-1.mp4`

```
FRAMES: The uploaded image is the exact first frame of the video.

GLOBAL STYLE: A real, photographic night shot inside an empty office at 22:40, one single continuous shot, no cuts. Dark exposure, warm amber desk-lamp light against deep navy-black shadows. Natural fine film grain, no CGI sheen, no HDR look. No text, no logos, no people, no hands.

SCENE: A light oak work desk next to a floor-to-ceiling window. On the desk: a black smartphone lying face up with a blank, evenly glowing warm-white screen, an open silver laptop with a soft out-of-focus screen, a white coffee mug, a closed dark-gray notebook with a pen. Behind the window, the dark city with distant amber lights, out of focus.

FIRST FRAME AND BLOCKING: Exactly as the uploaded image. The smartphone is at about 35% from the left and 58% from the top of the frame. The right 40% of the frame is dark.

TIMELINE:
0.0s to 5.0s: A very slow, smooth, straight push-in toward the smartphone, about 30 centimeters in total. The smartphone stays at the same place in the frame and grows slightly. The city lights behind the window drift very slightly with natural parallax. The steam from the coffee mug rises gently.

CAMERA: Motorized slider dolly, constant speed, no shake, no rotation, no zoom.

OPTICS: 50mm, f/2.8, focus locked on the smartphone, background softly out of focus.

PHYSICS: Every object stays solid and keeps its exact shape and position. The smartphone screen stays blank and evenly lit, with no icons, no text and no interface. No flicker.

LIGHTING: Constant, no exposure change, no flash, no lens flare, no bloom.

AUDIO: None. Silent.
```

---

### C3 · ‏K3 → K4 · "המונית מגיעה" (סצנת 01:00)
**פריים פתיחה:** ‏`K3` · **פריים סיום:** ‏`K4` · ‏5s · ‏16:9 · ‏1080p · בלי אודיו · **קבצים:** `C3-<model>-1.mp4`

```
FRAMES: The first uploaded image is the exact first frame of the video. The second uploaded image is the exact last frame of the video. The video must start on the first image and end precisely on the second image.

GLOBAL STYLE: A real, photographic night shot with a cinematic 35mm film look, one single continuous shot, no cuts, no transitions. Dark exposure, warm sodium-vapor amber light against deep navy-black shadows, wet asphalt. Natural fine film grain, no CGI sheen, no HDR look. No text, no logos, no readable license plates, no visible faces.

SCENE: 1:00 AM outside a 6-story modern office building in a business park. A warmly lit glass lobby, a closed sliding steel gate of dark horizontal bars, one tall amber streetlight on the left, wet empty asphalt. The night shift has just ended.

CHARACTERS: A plain white unbranded mid-size sedan taxi with a small unlit roof sign box with no lettering. A young woman, about 30, in a light beige jacket and dark trousers with a small shoulder bag, always seen from behind, face never visible.

FIRST FRAME AND BLOCKING: The shot opens on the empty scene exactly as the first image: no car, no people. Eye-level camera 25 meters from the building. The bottom third of the frame is dark empty wet asphalt and stays dark and empty for the whole shot.

TIMELINE:
0.0s to 3.0s: The white taxi enters calmly from the left edge of the frame with its low-beam headlights on, drives slowly along the access road, slows down smoothly and stops just to the left of the gate, front facing right. Its headlight reflections glide across the wet asphalt.
2.0s to 5.0s: The glass door of the lit lobby opens and the young woman walks out, seen from behind, and walks calmly along the pedestrian path toward the waiting taxi. The video ends exactly on the last frame, with the taxi stopped and the woman on her way to it.

CAMERA: Locked-off tripod camera with an extremely slow, almost imperceptible push-in, about one meter in total over the whole shot. Constant speed, no shake, no pan, no rotation, no zoom.

OPTICS: 35mm full-frame, f/2, focus on the building and the taxi, natural perspective.

PHYSICS: The building, the gate, the streetlight and the road are solid and never bend, warp, morph or flicker. The taxi keeps its exact shape, color and size while it moves, its wheels turn naturally and it stops smoothly with realistic weight. The woman walks with natural human motion, her body keeps its shape and her clothes keep their colors. No other cars, no other people appear.

LIGHTING: Constant night lighting. The headlights light the asphalt naturally as the car moves. No flash, no glow halos, no lens flare, no bloom, no light leaks.

AUDIO: None. Silent.
```

**לבדוק:** שהמונית לא משנה צורה או צבע, שאין כיתוב על השלט ועל הלוחית, שהאישה הולכת טבעי ולא מסובבת פנים, שהשער והבניין יציבים, ושהשליש התחתון ריק.

---

### C4 · ‏K4 → K5 · "חזרה לשמיים" (אופציונלי)
**פריים פתיחה:** ‏`K4` · **פריים סיום:** ‏`K5` · ‏5s · ‏16:9 · ‏1080p · בלי אודיו · **קבצים:** `C4-<model>-1.mp4`

```
FRAMES: The first uploaded image is the exact first frame of the video. The second uploaded image is the exact last frame of the video. The video must start on the first image and end precisely on the second image.

GLOBAL STYLE: A real, photographic night shot, one single continuous shot from a stabilized drone, no cuts, no transitions. Dark exposure, crushed blacks, warm sodium-vapor amber light against deep navy-black shadows. Natural fine film grain, no CGI sheen, no HDR look. No text, no logos, no readable license plates, no visible faces.

SCENE: 1:00 AM. A white taxi waits beside the gate of a modern office building in a business park; a young woman, seen from behind, is walking toward it. Around the business park lies a quiet Mediterranean coastal city at night.

FIRST FRAME AND BLOCKING: The shot opens exactly as the first image: eye-level, 25 meters from the building, the taxi to the left of the gate, the woman on the path. The right side of the frame stays darker and calm for the whole shot.

TIMELINE:
0.0s to 1.5s: The camera begins to rise smoothly straight up and slightly back. The woman reaches the taxi.
1.5s to 5.0s: The camera keeps rising steadily and tilts down, revealing the roof of the building, then the whole business park, then the quiet city around it, where exactly four long, calm, parallel streams of amber car headlights flow along four main roads toward the residential neighborhoods. The white taxi, now tiny, pulls away and joins one of the streams. The video ends exactly on the last frame.

CAMERA: Stabilized drone gimbal, one continuous rising move at constant speed, no shake, no rotation or roll, no zoom, no zoom pulsing.

OPTICS: 35mm full-frame, deep focus, sharp throughout.

PHYSICS: The buildings and roads are solid and never bend, warp, morph or flicker, and keep their shapes as the parallax changes naturally. The taxi keeps its shape and color. Window lights do not flicker.

LIGHTING: Constant night lighting, no exposure jumps, no flash, no glow, no lens flare, no bloom.

AUDIO: None. Silent.
```

---

## חלק 7 · נייד (9:16) · רק אם אבקש
בשלב הראשון בנייד אני חותך את המרכז של קליפי הדסקטופ. אם זה ייראה חלש, נייצר את אלה. בנייד הכותרת יושבת **בחצי התחתון** של המסך, ולכן הנושא עולה למעלה.

### M0 · ה-Hero בנייד, פתיחה
**מצב:** Multi-reference · **רפרנסים:** ‏1 = ‏`K0` · **יחס:** 9:16 · **קובץ:** `M0.png`

```
Image 1 is the reference for the city, the hero office tower, the color palette, the exposure and the photographic look. Keep all of them exactly the same; only the framing changes to a vertical frame.

A real night photograph taken from a helicopter, very high above the same Mediterranean coastal metropolis inspired by the Tel Aviv metropolitan area, at 22:40 on a weekday.

CAMERA AND FRAMING: About 600 meters above the ground, looking down at the city at a 55-degree angle. Full-frame digital cinema camera, 35mm lens, f/8, everything sharp, level horizon. Vertical 9:16 frame.

THE CITY: A dense grid of mid-rise office and residential blocks, pale stone and glass, flat roofs, a few palm trees on the avenues. Highways and main avenues with thin, sharp, continuous amber light trails from car lights in a long exposure. Most windows dark, a few warm windows.

THE HERO BUILDING: The same rectangular 14-story office tower from Image 1, pale stone base, dark glass facade, flat roof, with exactly one fully lit floor, the 9th floor, in warm white-amber light. It stands in the horizontal center of the frame, about 30% from the top of the frame.

COMPOSITION: The subject and the brightest light trails are in the upper half of the frame. The bottom 45% of the frame is darker and visually calm, dark rooftops only, no bright elements, because large white headline text will sit there.

LIGHT AND COLOR: Very dark overall exposure, crushed deep blacks, warm sodium-vapor amber light only, deep navy-black shadows. No neon, no blue or purple glow, no other colors. Sky deep blue-black, no stars, no moon.

TEXTURE: A real photograph, natural fine film grain, no CGI sheen, no HDR look, no tilt-shift effect.

EXCLUSIONS: No text, letters, numbers, signs, logos, watermarks. No people. No aircraft, drones or birds. No fog, haze. No lens flare, no bloom, no glow halos, no vignette.

Aspect ratio 9:16.
```

### M1 · ה-Hero בנייד, סיום
**מצב:** Multi-reference · **רפרנסים לפי הסדר:** ‏1 = ‏`M0`, ‏2 = ‏`K1` · **יחס:** 9:16 · **קובץ:** `M1.png`

```
Image 1 is the reference for the vertical framing, the city, the palette and the photographic look. Image 2 is the reference for how the hero tower and its lit 9th floor look from close up. Keep the same tower, the same night and the same look.

A real night photograph of the same city at 22:40. The camera has descended to the height of the 11th floor, about 120 meters from the 14-story office tower with the pale stone base, the dark glass facade and exactly one fully lit floor, the 9th floor, looking at it almost straight on with a slight downward tilt of 10 degrees. Full-frame digital cinema camera, 35mm lens, f/4, sharp, vertical lines perfectly vertical. Vertical 9:16 frame.

THE TOWER: The tower fills the center of the frame from the top edge down. The lit 9th floor is a horizontal band of floor-to-ceiling glass windows across the frame, about 30% from the top. Through the glass, an empty open-plan office with one warm desk lamp and the soft glow of a computer screen is softly visible. No people. Other floors are dark glass.

COMPOSITION: The bottom 45% of the frame is darker and calm: the dark lower floors of the tower and the dark street, no bright elements, because large white headline text will sit there.

LIGHT AND COLOR: Very dark exposure, crushed deep blacks, warm sodium-vapor amber light only, deep navy-black shadows. No neon, no blue or purple glow.

TEXTURE: A real photograph, natural fine film grain, no CGI sheen, no HDR look.

EXCLUSIONS: No text, letters, numbers, signs, logos, watermarks. No people. No aircraft, drones or birds. No fog. No lens flare, no bloom, no glow halos, no vignette.

Aspect ratio 9:16.
```

### C1M · ‏M0 → M1
**פריים פתיחה:** ‏`M0` · **פריים סיום:** ‏`M1` · ‏5s · ‏**9:16** · ‏1080p · בלי אודיו · **קובץ:** `C1M-<model>-1.mp4`

```
FRAMES: The first uploaded image is the exact first frame of the video. The second uploaded image is the exact last frame of the video. The video must start on the first image and end precisely on the second image.

GLOBAL STYLE: A real, photographic night shot of a modern Mediterranean coastal city inspired by Tel Aviv, filmed from a stabilized helicopter-mounted cinema camera, vertical 9:16 frame. One single continuous shot, no cuts, no transitions. Very dark exposure, crushed blacks, warm sodium-vapor amber lights against deep navy-black shadows. Natural fine film grain, no CGI sheen, no HDR look. No text, no logos, no signs, no people.

SCENE: 22:40 on a weekday night. One 14-story office tower with a pale stone base and a dark glass facade has exactly one fully lit floor, the 9th floor.

FIRST FRAME AND BLOCKING: The shot opens about 600 meters above the city, looking down at 55 degrees, with the hero tower in the horizontal center of the frame, about 30% from the top. The bottom 45% of the frame is dark and calm and stays dark and calm for the whole shot.

TIMELINE:
0.0s to 5.0s: The camera descends slowly and continuously toward the hero tower in one smooth curve, forward and down at the same time, while gently tilting up to look at the tower almost straight on. The lit 9th floor stays in the horizontal center, about 30% from the top, and grows steadily into a band of glass windows with an empty office softly visible inside. The move ends exactly on the last frame.

CAMERA: Stabilized helicopter gimbal, constant speed, no acceleration, no deceleration, no shake, no rotation or roll, no zoom, no zoom pulsing. Vertical lines stay vertical.

OPTICS: 35mm full-frame, deep focus, sharp throughout.

PHYSICS: Buildings, roads and the tower are solid and never bend, warp, morph, melt, flicker, appear or disappear. Only the car light trails move, flowing steadily. Window lights do not flicker.

LIGHTING: Constant night lighting, no exposure change, no flash, no glow, no lens flare, no bloom.

AUDIO: None. Silent.
```

### M3 · ‏01:00 בנייד, לפני
**מצב:** Multi-reference · **רפרנסים:** ‏1 = ‏`K3` · **יחס:** 9:16 · **קובץ:** `M3.png`

```
Image 1 is the exact reference for the building, the lobby, the gate, the streetlight, the wet asphalt, the light, the color palette and the photographic look. Keep all of them the same; only the framing changes to a vertical frame.

A real night photograph at 1:00 AM outside the same 6-story modern office building in an Israeli business park. Calm, quiet, empty.

CAMERA AND FRAMING: Eye-level camera, 1.6 meters above the ground, on the access road about 30 meters from the building, facing it straight on. Full-frame digital cinema camera, 35mm lens, f/2, vertical lines perfectly vertical. Vertical 9:16 frame.

LAYOUT: The warmly lit glass lobby entrance is in the horizontal center of the frame, about 35% from the top. The closed sliding steel gate of dark horizontal bars runs across the driveway just below and to the right of the lobby. The tall amber streetlight stands at the left edge. A few upper-floor windows are lit warm. No cars, no people.

COMPOSITION: The bottom 45% of the frame is dark, empty wet asphalt with only soft amber reflections, no objects, no bright spots, because white headline text will sit there.

LIGHT AND COLOR: Warm sodium-vapor amber, warm lobby light, deep navy-black shadows and sky. No neon, no blue or purple light. Dark overall exposure.

TEXTURE: A real photograph, cinematic 35mm film look, natural fine film grain, no CGI sheen, no HDR look.

EXCLUSIONS: No text, letters, numbers, signs, company names, logos, watermarks. No cars, no people. No fog. No lens flare, no bloom, no glow halos, no vignette.

Aspect ratio 9:16.
```

### M4 · ‏01:00 בנייד, המונית
**מצב:** Multi-reference · **רפרנסים לפי הסדר:** ‏1 = ‏`M3`, ‏2 = ‏`K4` · **יחס:** 9:16 · **קובץ:** `M4.png`

```
Image 1 is the exact reference for the vertical framing, the camera position, the building, the gate, the light and the photographic look; do not move the camera and do not change the building. Image 2 is the reference for the white taxi and the young woman: keep their exact look.

The same moment a few seconds later, 1:00 AM, the night shift has ended.

NEW IN THE FRAME:
- The plain white unbranded mid-size sedan taxi from Image 2, with a small unlit roof sign box that has no lettering, has stopped on the access road just to the left of the gate, front facing right, low-beam headlights on, red taillights glowing, headlight reflections on the wet asphalt. It sits around the middle of the frame vertically, about 50% from the top.
- The young woman from Image 2, about 30, light beige jacket, dark trousers, small shoulder bag, seen from behind, walks calmly from the lit lobby doors toward the taxi. She is small, about 10% of the frame height, between the lobby and the taxi. Her face is not visible.

KEEP: The bottom 45% of the frame stays dark wet asphalt with only soft reflections, empty, because white headline text will sit there.

LIGHT AND COLOR: Warm sodium-vapor amber, warm white headlights, red taillights, deep navy-black shadows. No neon, no blue or purple light. Dark exposure.

TEXTURE: A real photograph, cinematic 35mm film look, natural fine film grain, no CGI sheen, no HDR look.

EXCLUSIONS: No text, letters or numbers anywhere, including the roof sign and the license plate. No logos, no badges. No visible face. No other people or cars. No lens flare, no bloom, no glow halos, no vignette.

Aspect ratio 9:16.
```

### C3M · ‏M3 → M4
**פריים פתיחה:** ‏`M3` · **פריים סיום:** ‏`M4` · ‏5s · ‏**9:16** · ‏1080p · בלי אודיו · **קובץ:** `C3M-<model>-1.mp4`

```
FRAMES: The first uploaded image is the exact first frame of the video. The second uploaded image is the exact last frame of the video. The video must start on the first image and end precisely on the second image.

GLOBAL STYLE: A real, photographic night shot with a cinematic 35mm film look, vertical 9:16 frame, one single continuous shot, no cuts, no transitions. Dark exposure, warm sodium-vapor amber light against deep navy-black shadows, wet asphalt. Natural fine film grain, no CGI sheen, no HDR look. No text, no logos, no readable license plates, no visible faces.

SCENE: 1:00 AM outside a 6-story modern office building in a business park. A warmly lit glass lobby, a closed sliding steel gate, one tall amber streetlight on the left, wet empty asphalt.

CHARACTERS: A plain white unbranded mid-size sedan taxi with a small unlit roof sign box with no lettering. A young woman, about 30, in a light beige jacket and dark trousers with a small shoulder bag, always seen from behind, face never visible.

FIRST FRAME AND BLOCKING: The shot opens on the empty scene exactly as the first image: no car, no people. The lobby is in the horizontal center about 35% from the top. The bottom 45% of the frame is dark empty wet asphalt and stays dark and empty for the whole shot.

TIMELINE:
0.0s to 3.0s: The white taxi enters calmly from the left edge of the frame with its low-beam headlights on, drives slowly and stops just to the left of the gate, front facing right. Its headlight reflections glide across the wet asphalt.
2.0s to 5.0s: The glass lobby door opens and the young woman walks out, seen from behind, and walks calmly toward the waiting taxi. The video ends exactly on the last frame.

CAMERA: Locked-off tripod camera with an extremely slow, almost imperceptible push-in. Constant speed, no shake, no pan, no rotation, no zoom.

OPTICS: 35mm full-frame, f/2, natural perspective.

PHYSICS: The building, gate, streetlight and road are solid and never bend, warp, morph or flicker. The taxi keeps its exact shape, color and size, its wheels turn naturally and it stops smoothly with realistic weight. The woman walks with natural human motion and keeps her shape and clothing colors. No other cars or people appear.

LIGHTING: Constant night lighting, headlights light the asphalt naturally. No flash, no glow halos, no lens flare, no bloom.

AUDIO: None. Silent.
```

---

## חלק 8 · כשמשהו לא עובד

| הבעיה | מה משנים (רק דבר אחד) |
|---|---|
| התמונה בהירה מדי או "מזויפת" | מוסיפים בתחילת הפרומפט: `Underexposed by two stops, documentary realism, shot on ARRI Alexa 35.` |
| הופיעו אותיות או שלט | Inpaint (ב-Image editing) על האזור, עם הפרומפט `dark empty surface, no text` |
| K1 לא דומה ל-K0 | מייצרים מחדש עם אותו פרומפט. אם זה חוזר על עצמו, מעלים את K0 פעמיים כרפרנס |
| מסך הטלפון ב-K2 לא ריק | Inpaint על המסך: `plain evenly glowing warm-white blank phone screen, no icons, no text` |
| בווידאו המצלמה מאיצה או רועדת | מייצרים שוב. אם זה חוזר, עוברים מודל (Kling 3.0 או Veo 3.1) עם אותו פרומפט |
| הבניינים "נמסים" באמצע | מורידים ל-4 שניות. אם זה עדיין קורה, עוברים מודל |
| הסיום לא נוחת על תמונת הסיום | בודקים שהתמונות הועלו בסדר הנכון ובשדות הנכונים. אחר כך מנסים ב-Veo 3.1, שיודע לעבוד עם פריים פתיחה וסיום |
| C2 (דרך החלון) לא עובד אחרי שני ניסיונות | עוברים ל-C2B ואני עושה את המעבר בקוד |
| Upscale | רק אם קליפ יצא מתחת ל-1080p, או אם תמונה שנבחרה רכה מדי |

---

## חלק 9 · איך מעבירים לי

- שומרים בתיקייה `drafts/film/raw/` בשמות **בדיוק** כמו שכתוב כאן: `K0.png` … `K5.png`, ‏`M0.png` …, וקליפים בפורמט `C1-seedance-1.mp4`, ‏`C1-kling-2.mp4`, ‏`C1-veo-1.mp4` (שוט, מודל, מספר ניסיון).
- שומרים גם ניסיונות שנכשלו, אם יש בהם משהו מעניין. אני בוחר מהם.
- אומרים לי בצ׳אט כשמשהו מוכן. התיקייה `raw` מוחרגת מגיט (הריפו ציבורי), ונכנסים לגיט רק הפריימים המעובדים.

## חלק 10 · תקציב
- תוכנית **Plus** ‏(‎$59 לחודש, 1,200 קרדיטים), חודשי. לכבות את החידוש האוטומטי אחרי התשלום.
- הערכה: 10–20 תמונות ו-15–25 קליפים כולל ניסיונות. העלות המדויקת מופיעה על כפתור **Generate** לפני כל יצירה. Veo 3.1 יקר יותר, ולכן משתמשים בו רק בהשוואה על C1 ובמקרים שהסיום לא נוחת.
