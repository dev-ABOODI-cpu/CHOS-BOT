export const run = {
   usage: ['أكورد'], // الاسم العربي الرئيسي الذي سيظهر في القائمة (أكورد)
   hidden: ['chord', 'نوتة', 'عزف'], // الاختصارات المخفية لضمان عمل البوت كبدائل دائماً
   use: 'اسم الأغنية أو الفنان',
   category: 'أدوات مـساعدة', // الفئة المعربة لتنظيم قائمة الأوامر العامة
   async: async (m, {
      client,
      text,
      isPrefix,
      command,
      Utils
   }) => {
      try {
         // التحقق من كتابة نص بعد الأمر، وفي حال عدم إدخاله يتم عرض مثال توضيحي للمستخدم
         if (!text) return client.reply(m.chat, Utils.example(isPrefix, command, 'اسم الأغنية'), m)
         
         // إرسال تفاعل تفاعلي يفيد ببدء المعالجة والتحضير
         client.sendReact(m.chat, '🕒', m.key)
         
         // إرسال طلب جلب الأكوردات الموسيقية من الخادم برمجياً
         const json = await Api.neoxr('/chord', {
            q: text
         })
         
         // التحقق من نجاح عملية جلب البيانات من الخادم
         if (!json.status) return client.reply(m.chat, Utils.jsonFormat(json), m)
         
         // إرسال الأكوردات الموسيقية للمستخدم متبوعة بحقوق المطور
         let replyMessage = `${json.data.chord}\n\n© DEV ABOODI OFFICIAL`
         client.reply(m.chat, replyMessage, m)
      } catch (e) {
         client.reply(m.chat, Utils.jsonFormat(e), m)
      }
   },
   error: false,
   limit: true, // تفعيل استهلاك نقاط الحد اليومي عند استخدام هذا الأمر
   restrict: true
}
