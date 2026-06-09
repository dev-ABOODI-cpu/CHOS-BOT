export const run = {
   usage: ['المجموعة'], // تعريب مصفوفة الأمر
   use: 'فتح / غلق',
   category: 'أدوات المشرفين', // تعريب الفئة
   async: async (m, {
      client,
      args,
      Utils
   }) => {
      // التحقق من إدخال الوسيط الصحيح (فتح أو غلق)
      if (!args || !args[0]) return client.reply(m.chat, Utils.texted('bold', `🚩 يرجى تحديد الإجراء المطلوب: اكتب (فتح) أو (غلق).`), m)
      
      // إذا كان الأمر فتح المجموعة للأعضاء
      if (args[0] == 'فتح') {
         await client.groupSettingUpdate(m.chat, 'not_announcement').then(() => {
            client.reply(m.chat, Utils.texted('bold', `✅ تم فتح المجموعة بنجاح، يمكن للأعضاء الآن إرسال الرسائل.\n\n© DEV ABOODI OFFICIAL`), m)
         })
         
      // إذا كان الأمر إغلاق المجموعة وقصرها على المشرفين
      } else if (args[0] == 'غلق') {
         await client.groupSettingUpdate(m.chat, 'announcement').then(() => {
            client.reply(m.chat, Utils.texted('bold', `✅ تم إغلاق المجموعة بنجاح، الإرسال متاح للمشرفين فقط الآن.\n\n© DEV ABOODI OFFICIAL`), m)
         })
      }
   },
   group: true, // يعمل داخل المجموعات فقط
   admin: true, // يتطلب أن يكون المستخدم مشرفاً لتنفيذ الأمر
   botAdmin: true // يتطلب أن يكون البوت مشرفاً ليتمكن من تغيير إعدادات المجموعة
}
