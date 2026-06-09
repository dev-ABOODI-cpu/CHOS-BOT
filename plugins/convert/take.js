export const run = {
   usage: ['أخذ_الحقوق'], // تم تعريب الأمر ليظهر في قائمة البوت باسم (أخذ_الحقوق)
   hidden: ['wm', 'take'],
   use: 'اسم الحزمة | اسم الحقوق',
   category: 'المحولات', // تم تعريب الفئة لتنظيم القائمة باللغة العربية
   async: async (m, {
      client,
      text,
      isPrefix,
      Utils
   }) => {
      try {
         // التحقق من إدخال النص المطلوب لإنشاء الحقوق الجديدة
         if (!text) return client.reply(m.chat, Utils.texted('bold', `🚩 يرجى إدخال النص المطلوب لصياغة الحقوق بالشكل التالي:\n*اسم الحزمة | اسم الحقوق*`), m)
         
         // فصل اسم الحزمة عن اسم الحقوق عبر علامة |
         let [packname, ...author] = text.split`|`
         author = (author || []).join`|`
         
         let q = m.quoted ? m.quoted : m
         let mime = (q.msg || q).mimetype || ''
         
         // التحقق من أن المستخدم قام بالرد على ملصق بالفعل وليس نوع آخر من الوسائط
         if (!/webp/.test(mime)) return client.reply(m.chat, Utils.texted('bold', `🚩 يرجى الرد مباشرة على الملصق الذي ترغب في تغيير حقوقه.`), m)
         
         let img = await q.download()
         if (!img) return client.reply(m.chat, global.status.wrong, m)
         
         // إعادة إرسال الملصق بالحقوق الجديدة المدخلة
         client.sendSticker(m.chat, img, m, {
            packname: packname || '',
            author: author || ''
         })
      } catch (e) {
         console.log(e)
         return client.reply(m.chat, Utils.jsonFormat(e), m)
      }
   },
   error: false,
   premium: true, // ميزة مخصصة للمستخدمين المميزين (Premium)
   limit: true // الميزة تستهلك حداً من نقاط المستخدم
}
