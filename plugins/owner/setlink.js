export const run = {
   usage: ['تعيين_الرابط'], // الاسم العربي الرئيسي الذي سيظهر في القائمة (تعيين_الرابط)
   hidden: ['setlink', 'تغيير_الرابط', 'رابط_البوت'], // الاختصارات المخفية لضمان عمل البوت كبدائل دائمًا
   use: 'الرابط الجديد (URL)',
   category: 'المطور', // الفئة المعربة لتنظيم قائمة أوامر المالك
   async: async (m, {
      client,
      text,
      isPrefix,
      command,
      Utils
   }) => {
      try {
         let setting = global.db.setting
         
         // التحقق من إدخال نص بعد الأمر، وفي حال عدم إدخاله يتم عرض مثال توضيحي بالرابط الحالي
         if (!text) return client.reply(m.chat, Utils.example(isPrefix, command, global.db.setting.link), m)
         
         // فحص ما إذا كان النص المدخل يمثل رابطاً حقيقياً وصالحاً
         const isUrl = Utils.isUrl(text)
         if (!isUrl) return client.reply(m.chat, Utils.texted('bold', `🚩 العذر، الرابط المدخل غير صالح. يرجى إدخال رابط صحيح يبدأ بـ http أو https.`), m)
         
         // تحديث الرابط في قاعدة بيانات الإعدادات
         setting.link = text
         client.reply(m.chat, Utils.texted('bold', `🚩 تم تعيين وتحديث رابط البوت بنجاح.\n\n© DEV ABOODI OFFICIAL`), m)
      } catch (e) {
         client.reply(m.chat, Utils.jsonFormat(e), m)
      }
   },
   owner: true // الميزة محمية ومخصصة لمالك ومطور البوت فقط
}
