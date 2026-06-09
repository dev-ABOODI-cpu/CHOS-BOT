export const run = {
   usage: ['من_الذكاء'], // تعريب الأمر ليظهر في قائمة البوت باسم (من_الذكاء)
   hidden: ['fromai'], // الاختصار المخفي لضمان عمل البوت إذا كُتب بالإنجليزية
   category: 'أمثلة', // تعريب الفئة لتنظيم القائمة باللغة العربية
   async: async (m, {
      client,
      Utils
   }) => {
      try {
         // إرسال رسالة تظهر للمستخدم كأنها صادرة من نظام الذكاء الاصطناعي للبوت
         client.sendFromAI(m.chat, 'مرحباً! هذه الرسالة تم إرسالها من واجهة نظام الذكاء الاصطناعي الخاص بالبورت. ✨\n\n© DEV ABOODI OFFICIAL', m)
      } catch (e) {
         client.reply(m.chat, Utils.jsonFormat(e), m)
      }
   },
   error: false,
   private: true // الميزة تعمل داخل المحادثات الخاصة فقط
}
