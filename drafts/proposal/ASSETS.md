# בריף תמונות AI · SmartKav v2

הדף עובד גם בלי התמונות: הרקע של ה-Hero ושל סצנת 01:00 הוא שובלי אור חיים שבנויים בקוד. התמונות הן שכבת צילום מתחת לשובלים, והן מה שיהפוך את הדף מ"מעוצב" ל"קולנועי".

## הכלי המומלץ (חינמי)
**Gemini** (gemini.google.com, "Create image"). חלופה: **Microsoft Designer / Bing Image Creator** (bing.com/create).

**איך עובדים:**
1. מדביקים את הפרומפט באנגלית בדיוק כמו שהוא, ומוסיפים בסוף את יחס המסך (למשל `Aspect ratio 16:9`).
2. מייצרים 3–4 גרסאות ובוחרים לפי הבדיקה שבסוף כל פריט.
3. **לפסול** כל תמונה עם טקסט, שלטים קריאים, לוגו, לוחית רישוי קריאה, פנים ברורות או זוהר מוגזם.
4. מכווצים ב-**squoosh.app**: ‏MozJPEG, איכות 70, רוחב 2560px (או 1080px לגרסת הנייד).
5. שומרים בתיקייה `drafts/proposal/assets/` בשם המדויק, ואומרים לי. אני מדליק את התמונה בקוד (`ASSETS` בראש הסקריפט) ובודק.

---

## 1. רקע ה-Hero · `hero-city-night.jpg` · **חובה**
- **מטרה:** העיר בלילה מתחת לשובלי האור. כל שובל בקוד הוא נסיעה של עובד, והצילום נותן לו עיר אמיתית.
- **מיקום:** המסך הראשון, מלא, באטימות 55%, ומעליו השובלים והכותרת.
- **יחס ורזולוציה:** ‏16:9, ‏2560×1440. משקל עד 350KB.

```
Aerial long-exposure photograph of a modern Mediterranean coastal metropolis at night, similar to the Tel Aviv metropolitan area, seen from very high above at a 30-degree angle. Highways and main roads form thin, sharp amber light trails from car headlights and taillights. A dense grid of mid-rise office and residential buildings with scattered warm window lights. Deep blue-black sky, no stars, no moon. Very dark overall exposure with crushed blacks; the upper half of the frame is mostly dark city and sky. Warm sodium-vapor amber is the dominant light color, with subtle cool navy shadows. Shot on a full-frame camera, 35mm lens, f/8, 20-second exposure, ultra sharp, photorealistic, restrained cinematic color grading. No text, no logos, no signs, no people, no lens flare, no bloom, no glow.
```
**בדיקה:** שהתמונה כהה מאוד (הכותרת צריכה לבלוט עליה), שהשובלים דקים וחדים ולא מטושטשים, ושאין אף אות או לוגו.

## 2. רקע ה-Hero לנייד · `hero-city-night-mobile.jpg` · נחמד שיהיה
- אותו פרומפט, עם `Aspect ratio 9:16`, ‏1080×1920, עד 250KB.
- אם לא תכין, הנייד ישתמש בגרסה הרחבה (חתוכה למרכז).

## 3. סצנת 01:00 · `gate-0100.jpg` · **חובה**
- **מטרה:** הרגע הרגשי לפני הטופס. נועה יוצאת מהמשמרת, והמונית כבר מחכה.
- **מיקום:** מסך מלא לפני השאלות הנפוצות. הכותרת יושבת בשליש התחתון.
- **יחס ורזולוציה:** ‏16:9, ‏2560×1440. משקל עד 350KB.

```
Photorealistic night photograph at 1 AM outside a modern office building in an Israeli business park. A white taxi with headlights on waits beside a closed sliding gate. Wet asphalt reflects a single warm sodium streetlight. A young woman in a light jacket, seen from behind, walks from the lit building entrance toward the taxi; she is small in the frame, in the upper right third. A few lit office windows, an empty parking lot, calm and quiet. Leave the bottom third of the frame dark and empty (dark asphalt) for text. Cinematic 35mm film look, eye-level camera, f/2, natural color, amber and deep navy palette, gentle film grain. No text, no readable signs, no logos, no readable license plate, no visible face, no lens flare, no glow.
```
**בדיקה:** שהשליש התחתון כהה (שם יושב הטקסט), שאין פנים, ושהמונית לא נושאת לוגו של חברה אמיתית.

## 4. תמונת שיתוף · `og.png` · נחמד שיהיה (אחרי האישור)
את זו אבנה בקוד מתוך ה-Hero הסופי (1200×630), כולל הכותרת "ניהול הסעות חכם לעובדי משמרות". לא צריך כלי AI.

---

## מסלול B (רק באישור מפורש שלך)
סרטון קצר של המונית שנכנסת לפריים בסצנת 01:00, שמתקדם עם הגלילה. זה כבר לא נדרש: הסצנה עובדת יפה עם תמונה סטטית ושובלי אור מעליה. אני ממליץ להתחיל בלעדיו.
