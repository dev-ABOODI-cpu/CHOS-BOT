export const run = {
   usage: ['ملصق_ايموجي'], // تم تعريب الأمر ليظهر في قائمة البوت باسم (ملصق_ايموجي)
   hidden: ['emoimg', 'skemo'],
   use: 'الإيموجي النوع',
   category: 'المحولات', // تم تعريب الفئة لتنظيم القائمة باللغة العربية
   async: async (m, {
      client,
      args,
      isPrefix,
      command,
      setting: exif,
      Utils
   }) => {
      try {
         if (!args || !args[0]) return client.reply(m.chat, Utils.example(isPrefix, command, '😳 apple'), m)
         
         // إرسال تفاعل (إيموجي الانتظار)
         client.sendReact(m.chat, '🕒', m.key)
         
         const [emoji, style] = args
         
         // استدعاء واجهة برمجة التطبيقات لتوليد صورة الإيموجي بالنمط المحدد
         const json = await Api.neoxr('/emoimg', {
            q: emoji,
            style: style || 'apple' // النمط الافتراضي هو آبل في حال لم يحدد المستخدم نوعاً آخر
         })
         
         if (!json.status) return client.reply(m.chat, Utils.texted('bold', `🚩 تعذر تحويل الإيموجي: ${json.msg}`), m)
         
         // تحميل الصورة وتحويلها إلى ملصق مع تثبيت الحقوق البرمجية الخاصة بك
         const buffer = await Utils.fetchAsBuffer(json.data.url)
         await client.sendSticker(m.chat, buffer, m, {
            packname: exif.sk_pack,
            author: exif.sk_author,
            categories: [emoji]
         })
      } catch (e) {
         return client.reply(m.chat, Utils.jsonFormat(e), m)
      }
   },
   error: false,
   limit: true // الميزة تستهلك حداً (Limit) من نقاط المستخدم
}
