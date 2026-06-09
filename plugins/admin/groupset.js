export const run = {
   usage: ['الاسم', 'الوصف'], // تم تعريب الأوامر لتظهر في قائمة البوت باللغة العربية
   use: 'النص',
   category: 'أدوات المشرفين', // تم تعريب الفئة لتنظيم القائمة
   async: async (m, {
      client,
      text,
      isPrefix,
      command,
      Utils
   }) => {
      // جلب النص سواء كان مكتوباً بعد الأمر أو مأخوذاً من الرسالة التي تم الرد عليها
      let value = m.quoted ? m.quoted.text : text
      
      // [أولاً] معالجة أمر تغيير اسم المجموعة
      if (command == 'الاسم') {
         if (!value) return client.reply(m.chat, Utils.example(isPrefix, command, 'مجموعة الدعم الفني'), m)
         if (value.length > 25) return client.reply(m.chat, Utils.texted('bold', `🚩 النص طويل جداً، الحد الأقصى لاسم المجموعة هو 25 حرفاً.`), m)
         await client.groupUpdateSubject(m.chat, value).then(() => {
            client.reply(m.chat, Utils.texted('bold', `✅ تم تغيير اسم المجموعة بنجاح.\n\n© DEV ABOODI OFFICIAL`), m)
         })
         
      // [ثانياً] معالجة أمر تغيير وصف المجموعة
      } else if (command == 'الوصف') {
     	if (!value) return client.reply(m.chat, Utils.example(isPrefix, command, `يرجى الالتزام بالقوانين لتفادي الطرد.`), m)
         await client.groupUpdateDescription(m.chat, value).then(() => {
            client.reply(m.chat, Utils.texted('bold', `✅ تم تحديث وصف المجموعة بنجاح.\n\n© DEV ABOODI OFFICIAL`), m)
         })
      }
   },
   group: true, // يعمل داخل المجموعات فقط
   admin: true, // يتطلب أن يكون المستخدم مشرفاً
   botAdmin: true // يتطلب أن يكون البوت مشرفاً لتعديل بيانات المجموعة
}
