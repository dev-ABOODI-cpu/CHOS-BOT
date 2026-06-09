import { Converter } from '@neoxr/wb'

export const run = {
   usage: ['بنترست'], // الاسم العربي الرئيسي الذي سيظهر في القائمة
   hidden: ['pin', 'pinterest'], // الاختصارات المخفية لضمان عمل البوت إذا كُتبت بالإنجليزية
   use: 'رابط أو كلمة بحث',
   category: 'التحميلات', // الفئة المعربة لتنظيم قائمة الأوامر
   async: async (m, {
      client,
      text,
      isPrefix,
      command,
      Utils
   }) => {
      try {
         // التحقق من إدخال نص أو رابط بعد الأمر
         if (!text) return client.reply(m.chat, Utils.example(isPrefix, command, 'https://pin.it/5fXaAWE أو خلفيات أنمي'), m)
         
         // إرسال تفاعل (إيموجي الانتظار)
         client.sendReact(m.chat, '🕒', m.key)
         let old = new Date()
         
         // الحالة الأولى: إذا كان المدخل عبارة عن رابط (تحميل)
         if (Utils.isUrl(text.trim())) {
            // فحص ما إذا كان الرابط ينتمي لموقع بنترست بالفعل
            if (!text.match(/pin(?:terest)?(?:\.it|\.com)/)) return m.reply(global.status.invalid)
            
            // استدعاء واجهة برمجة التطبيقات لجلب بيانات الرابط
            const json = await Api.neoxr('/pin', {
               url: text.trim()
            })
            
            if (!json.status) return client.reply(m.chat, Utils.jsonFormat(json), m)
            
            // إذا كان الملف المستخرج صورة (jpg)
            if (/jpg/.test(json.data.type)) return client.sendFile(m.chat, json.data.url, 'image.jpg', `🍟 *مدة الجلب* : ${((new Date - old) * 1)} ms\n\n© DEV ABOODI OFFICIAL`, m)
            
            // إذا كان الملف المستخرج مقطع فيديو أو ملف GIF متحرك
            if (/mp4|gif/.test(json.data.type)) {
               const buffer = await Converter.toVideo(json.data.url)
               client.sendFile(m.chat, buffer, 'video.mp4', `🍟 *مدة الجلب* : ${((new Date - old) * 1)} ms\n\n© DEV ABOODI OFFICIAL`, m)
            }
            
         // الحالة الثانية: إذا كان المدخل نصاً عادياً (البحث عن صور)
         } else {
            // استدعاء واجهة برمجة التطبيقات للبحث عن الصور بناءً على كلمة البحث
            const json = await Api.neoxr('/pinterest', {
               q: text.trim()
            })
            
            if (!json.status) return client.reply(m.chat, Utils.jsonFormat(json), m)
            
            // اختيار صورة عشوائية من نتائج البحث وإرسالها مع الحقوق
            const imgUrl = Utils.random(json.data)
            client.sendFile(m.chat, imgUrl, 'pinterest.jpg', `✨ نتيجة البحث عن: *${text.trim()}*\n\n© DEV ABOODI OFFICIAL`, m)
         }
      } catch {
         client.reply(m.chat, global.status.error, m)
      }
   },
   error: false,
   limit: true // الميزة تستهلك حداً من نقاط المستخدم
}
