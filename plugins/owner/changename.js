export const run = {
   usage: ['تغيير_الاسم'], // الاسم العربي الرئيسي الذي سيظهر في القائمة (تغيير_الاسم)
   hidden: ['changename', 'اسم_البوت'], // الاختصارات المخفية لضمان عمل البوت إذا كُتبت بالإنجليزية أو العربية البديلة
   use: 'الاسم الجديد',
   category: 'المطور', // الفئة المعربة لتنظيم قائمة أوامر المالك
   async: async (m, {
      client,
      text,
      isPrefix,
      command,
      Utils
   }) => {
      try {
         // في حال لم يقم المطور بكتابة الاسم الجديد بعد الأمر، يتم إظهار مثال توضيحي له
         if (!text) return client.reply(m.chat, Utils.example(isPrefix, command, 'بوت عبودي'), m)
         
         // التحقق من قيود الطول لأسماء الحسابات في واتساب
         if (text.length > 25) return client.reply(m.chat, `🚩 النص طويل جداً، الحد الأقصى المسموح به هو 25 حرفاً فقط.`, m)
         
         // تحديث اسم البوت برمجياً في ملفات الاعتماد وحفظ التعديل بقاعدة البيانات
         client.authState.creds.me.name = text
         await props.save(global.db)
         
         return client.reply(m.chat, `🚩 تم تغيير اسم البوت بنجاح إلى: *${text}*\n\n© DEV ABOODI OFFICIAL`, m)
      } catch {
         // في حال حدوث خطأ أثناء محاولة التعديل أو الحفظ
         return client.reply(m.chat, Utils.texted('bold', `🚩 عذراً، فشلت عملية تغيير الاسم. تأكد من صلاحيات النظام.`), m)
      }
   },
   owner: true // الأداة محمية ومخصصة لمالك البوت فقط
}
