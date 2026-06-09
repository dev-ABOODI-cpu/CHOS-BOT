export const run = {
   usage: ['تعيين_الحقوق'], // الاسم العربي الرئيسي الذي سيظهر في القائمة (تعيين_الحقوق)
   hidden: ['setwm', 'تغيير_الحقوق', 'حقوق_الملصقات'], // الاختصارات المخفية لضمان عمل البوت كبدائل دائمًا
   use: 'اسم الحزمة | اسم الحقوق',
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
         
         // التحقق من إدخال نص بعد الأمر، وفي حال عدم إدخاله يتم عرض مثال توضيحي للمطور
         if (!text) return client.reply(m.chat, Utils.example(isPrefix, command, 'حزمة ملصقات عبودي | @aboodi'), m)
         
         // فصل النص المدخل برمجياً بناءً على علامة الفاصل المشروطة (|)
         let [packname, ...author] = text.split`|`
         author = (author || []).join`|`
         
         // حفظ الإعدادات الجديدة في قاعدة بيانات البوت
         setting.sk_pack = packname ? packname.trim() : ''
         setting.sk_author = author ? author.trim() : ''
         
         client.reply(m.chat, Utils.texted('bold', `🚩 تم تعيين وتحديث الحقوق المائية للملصقات بنجاح.\n\n© DEV ABOODI OFFICIAL`), m)
      } catch (e) {
         client.reply(m.chat, Utils.jsonFormat(e), m)
      }
   },
   owner: true // الميزة محمية ومخصصة لمالك ومطور البوت فقط
}
