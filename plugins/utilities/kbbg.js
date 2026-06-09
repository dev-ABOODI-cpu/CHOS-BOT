export const run = {
   usage: ['قاموس_العامية'], // الاسم العربي الرئيسي الذي سيظهر في القائمة (قاموس_العامية)
   hidden: ['kbbg', 'عامية', 'معنى_كلمة'], // الاختصارات المخفية لضمان عمل البوت كبدائل دائماً
   use: 'الكلمة أو المصطلح المراد البحث عنه',
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
         if (!text) return client.reply(m.chat, Utils.example(isPrefix, command, 'مصطلح'), m)
         
         // إرسال تفاعل تفاعلي يفيد ببدء المعالجة والتحضير
         client.sendReact(m.chat, '🕒', m.key)
         
         // إرسال طلب جلب تعريف الكلمة من الخادم برمجياً
         const json = await Api.neoxr('/kbbg', {
            q: text
         })
         
         // التحقق من نجاح عملية جلب البيانات من الخادم
         if (!json.status) return client.reply(m.chat, Utils.jsonFormat(json), m)
         
         // إرسال الكلمة وتعريفها للمستخدم متبوعة بحقوق المطور
         let replyMessage = `*الكلمة:* ${json.data.word}\n\n*التعريف:* ${json.data.description}\n\n© DEV ABOODI OFFICIAL`
         client.reply(m.chat, replyMessage, m)
      } catch (e) {
         client.reply(m.chat, Utils.jsonFormat(e), m)
      }
   },
   error: false,
   limit: true, // تفعيل استهلاك نقاط الحد اليومي عند استخدام هذا الأمر
   restrict: true
}
