export const run = {
   usage: ['تحويل_ايموجي'], // تم تعريب الأمر ليظهر في قائمة البوت باسم (تحويل_ايموجي)
   use: 'الإيموجي',
   category: 'المحولات', // تم تعريب الفئة لتنظيم القائمة باللغة العربية
   async: async (m, {
      client,
      args,
      isPrefix,
      command,
      Utils
   }) => {
      try {
         let exif = global.db.setting
         if (!args || !args[0]) return client.reply(m.chat, Utils.example(isPrefix, command, '😳'), m)
         
         // إرسال تفاعل (إيموجي الانتظار)
         client.sendReact(m.chat, '🕒', m.key)
         
         // استدعاء واجهة برمجة التطبيقات لتحويل الإيموجي
         const json = await Api.neoxr('/emojito', {
            q: args[0]
         })
         
         if (!json.status) return client.reply(m.chat, Utils.texted('bold', `🚩 تعذر تحويل الإيموجي: ${json.msg}`), m)
         
         // تحميل الصورة وتحويلها إلى ملصق مع تثبيت الحقوق البرمجية الخاصة بك
         const buffer = await Utils.fetchAsBuffer(json.data.url)
         await client.sendSticker(m.chat, buffer, m, {
            packname: exif.sk_pack,
            author: exif.sk_author,
            categories: [args[0]]
         })
      } catch (e) {
         return client.reply(m.chat, Utils.jsonFormat(e), m)
      }
   },
   error: false,
   limit: true // الميزة تستهلك حداً (Limit) من نقاط المستخدم
}
