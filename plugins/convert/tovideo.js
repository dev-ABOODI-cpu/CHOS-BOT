export const run = {
   usage: ['إلى_فيديو'], // تم تعريب الأمر ليظهر في قائمة البوت باسم (إلى_فيديو)
   hidden: ['tovid', 'tovideo'],
   use: 'الرد على ملصق متحرك',
   category: 'المحولات', // تم تعريب الفئة لتنظيم القائمة باللغة العربية
   async: async (m, {
      client,
      command,
      Utils,
      Scraper
   }) => {
      try {
         let exif = global.db.setting
         
         // التحقق مما إذا كان المستخدم قد قام بالرد على رسالة
         if (!m.quoted) return client.reply(m.chat, Utils.texted('bold', `🚩 يرجى الرد على ملصق متحرك (GIF Sticker) لتحويله إلى مقطع فيديو.`), m)
         
         let q = m.quoted ? m.quoted : m
         let mime = (q.msg || q).mimetype || ''
         
         // التأكد من أن الملف المردود عليه هو ملصق بالفعل
         if (!/webp/.test(mime)) return client.reply(m.chat, Utils.texted('bold', `🚩 يرجى الرد على ملصق متحرك (GIF Sticker) لتحويله إلى مقطع فيديو.`), m)
         
         let buffer = await q.download()
         const file = await Scraper.uploadImageV2(buffer)
         if (!file.status) return m.reply(Utils.jsonFormat(file))
         
         let old = new Date()
         
         // إرسال تفاعل (إيموجي الانتظار)
         client.sendReact(m.chat, '🕒', m.key)
         
         // استدعاء واجهة برمجة التطبيقات لتحويل الملصق المتحرك إلى MP4
         const json = await Api.neoxr('/webp2mp4', {
            url: file.data.url
         })
         
         // إرسال ملف الفيديو الناتج مع حساب وقت المعالجة وتثبيت حقوقك
         client.sendFile(m.chat, json.data.url, 'video.mp4', `🍟 *سرعة المعالجة* : ${((new Date - old) * 1)} م.ث\n\n© DEV ABOODI OFFICIAL`, m)
      } catch (e) {
         return client.reply(m.chat, global.status.error, m)
      }
   },
   error: false,
   limit: true // الميزة تستهلك حداً من نقاط المستخدم
}
