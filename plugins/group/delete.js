export const run = {
   usage: ['حذف'], // الاسم العربي الرئيسي الذي سيظهر في القائمة (حذف)
   hidden: ['delete', 'del'], // الاختصارات المخفية لضمان عمل البوت إذا كُتبت بالإنجليزية
   use: 'الرد على الرسالة',
   category: 'المجموعات', // الفئة المعربة لتنظيم قائمة الأوامر
   async: async (m, {
      client,
      isBotAdmin
   }) => {
      // التحقق من وجود رد على الرسالة المستهدفة بالحذف
      if (!m.quoted) return
      
      // تنفيذ أمر حذف الرسالة برمجياً من خوادم واتساب
      client.sendMessage(m.chat, {
         delete: {
            remoteJid: m.chat,
            fromMe: isBotAdmin ? false : true, // السماح بحذف رسائل الآخرين فقط إذا كان البوت مشرفاً
            id: m.quoted.id,
            participant: m.quoted.sender
         }
      })
   },
   error: false,
   group: true // الميزة تعمل حصرياً داخل المجموعات
}
