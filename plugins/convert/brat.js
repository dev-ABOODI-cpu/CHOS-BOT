export const run = {
   usage: ['برات'], // تم تعريب الأمر ليظهر في قائمة البوت باسم (برات)
   use: 'النص',
   category: 'المحولات', // تم تعريب الفئة لتنظيم القائمة باللغة العربية
   async: async (m, {
      client,
      text,
      isPrefix,
      command,
      Utils
   }) => {
      try {
         let exif = global.db.setting
         if (!text) return client.reply(m.chat, Utils.example(isPrefix, command, 'اكتب نصاً هنا'), m)
         if (text.length > 30) return client.reply(m.chat, Utils.texted('bold', `🚩 الحد الأقصى المسموح به هو 30 حرفاً فقط.`), m)
         
         // إرسال تفاعل (إيموجي الانتظار)
         client.sendReact(m.chat, '🕒', m.key)
         
         // استدعاء واجهة برمجة التطبيقات لتوليد الملصق النصي
         const json = await Api.neoxr('/brat', {
            text
         })
         
         if (!json.status) return client.reply(m.chat, Utils.texted('bold', `🚩 تعذر إنشاء ملصق برات، يرجى المحاولة لاحقاً.`), m)
         
         // إرسال الملصق الجاهز مع تثبيت الحقوق البرمجية الخاصة بك
         await client.sendSticker(m.chat, json.data.url, m, {
            packname: exif.sk_pack,
            author: exif.sk_author
         })
      } catch (e) {
         return client.reply(m.chat, Utils.jsonFormat(e), m)
      }
   },
   error: false,
   limit: true // الميزة تستهلك حداً (Limit) من نقاط المستخدم عند الاستخدام
}
