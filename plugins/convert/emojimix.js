export const run = {
   usage: ['دمج_ايموجي'], // تم تعريب الأمر ليظهر في قائمة البوت باسم (دمج_ايموجي)
   hidden: ['mix', 'emomix', 'emojimix'],
   use: 'ايموجي + ايموجي',
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
         if (!text) return client.reply(m.chat, Utils.example(isPrefix, command, '😳+😂'), m)
         
         // إرسال تفاعل (إيموجي الانتظار)
         client.sendReact(m.chat, '🕒', m.key)
         
         let [emo1, emo2] = text.split`+`
         if (!emo1 || !emo2) return client.reply(m.chat, Utils.texted('bold', `🚩 يرجى إدخال إيموجيين اثنين وبينهما علامة (+) ليتم دمجهم.`), m)
         
         // استدعاء واجهة برمجة التطبيقات لدمج الإيموجي
         const json = await Api.neoxr('/emoji', {
            q: emo1.trim() + '_' + emo2.trim()
         })
         
         if (!json.status) return client.reply(m.chat, Utils.texted('bold', `🚩 تعذر دمج هذين الإيموجيين، قد يكون هذا التشكيل غير مدعوم.`), m)
         
         // إرسال الملصق المدمج الجاهز مع تثبيت الحقوق البرمجية الخاصة بك
         await client.sendSticker(m.chat, json.data.url, m, {
            packname: exif.sk_pack,
            author: exif.sk_author,
            categories: [emo1, emo2]
         })
      } catch (e) {
         return client.reply(m.chat, Utils.jsonFormat(e), m)
      }
   },
   error: false,
   limit: true // الميزة تستهلك حداً (Limit) من نقاط المستخدم
}
