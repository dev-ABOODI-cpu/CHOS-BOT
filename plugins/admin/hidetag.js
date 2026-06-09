export const run = {
   usage: ['نداء'], // تم تعريب الأمر ليظهر في قائمة البوت باسم (نداء)
   use: 'النص',
   category: 'أدوات المشرفين', // تم تعريب الفئة لتنظيم القائمة باللغة العربية
   async: async (m, {
      client,
      text,
      participants
   }) => {
      // جلب جميع معرفات الأعضاء المتواجدين في المجموعة حالياً
      let users = participants.map(u => u.id)
      
      // إرسال الرسالة مع تضمين الإشارات بشكل مخفي في الخلفية
      // تم إضافة حقوق المطور أسفل نص الرسالة تلقائياً
      await client.reply(m.chat, text ? `${text}\n\n© DEV ABOODI OFFICIAL` : `📢 نداء إلى جميع الأعضاء!\n\n© DEV ABOODI OFFICIAL`, null, {
         mentions: users
      })
   },
   admin: true, // يتطلب أن يكون المستخدم مشرفاً لتنفيذ الأمر
   group: true // يعمل داخل المجموعات فقط
}
