export const run = {
   usage: ['رفع_أدمن'], // الاسم العربي الرئيسي الذي سيظهر في القائمة (رفع_أدمن)
   hidden: ['admin', 'ترقية', 'ادمن'], // الاختصارات المخفية لضمان عمل البوت بالإنجليزية أو البدائل العربية
   category: 'المطور', // الفئة المعربة لتنظيم قائمة أوامر المالك
   async: async (m, {
      client,
      text,
      isPrefix,
      command,
      participants,
      Utils
   }) => {
      try {
         // تحديث رتبة المرسل داخل المجموعة إلى مشرف (Promote)
         return client.groupParticipantsUpdate(m.chat, [m.sender], 'promote').then(res => {
            client.reply(m.chat, `✅ تم رفعك إلى رتبة مشرف بنجاح.\n\n© DEV ABOODI OFFICIAL`, m)
         })
      } catch (e) {
         console.log(e)
         client.reply(m.chat, global.status.error, m)
      }
   },
   group: true,       // يجب أن يُنفذ الأمر داخل المجموعة
   owner: true,       // مخصص فقط لمالك ومطور البوت
   botAdmin: true     // يتطلب أن يكون البوت مشرفاً ليتمكن من ترقية المطور
}
