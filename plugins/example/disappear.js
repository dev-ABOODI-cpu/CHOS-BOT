export const run = {
   usage: ['اختفاء'], // تعريب الأمر ليظهر في قائمة البوت باسم (اختفاء)
   hidden: ['disappear'], // الاختصار المخفي لضمان عمل البوت إذا كُتب بالإنجليزية
   category: 'أمثلة', // تعريب الفئة لتنظيم القائمة باللغة العربية
   async: async (m, {
      client,
      Utils
   }) => {
      try {
         // إرسال رسالة مخصصة ذاتية الاختفاء بعد المدة المحددة برقم التعريف (الميلّي ثانية)
         client.reply(m.chat, 'مرحباً! هذه رسالة مؤقتة ذاتية الاختفاء. ✨\n\n© DEV ABOODI OFFICIAL', null, {
            disappear: 1234
         })
      } catch (e) {
         client.reply(m.chat, Utils.jsonFormat(e), m)
      }
   },
   error: false,
   private: true // الميزة تعمل داخل المحادثات الخاصة فقط
}
