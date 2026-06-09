export const run = {
   usage: ['بينج'], // الاسم العربي الرئيسي الذي سيظهر في القائمة (بينج)
   hidden: ['bing', 'بينغ', 'ذكاء_بينج'], // الاختصارات المخفية لضمان عمل البوت كبدائل دائماً
   use: 'السؤال أو الاستفسار الموجه للبوت',
   category: 'أدوات مـساعدة', // الفئة المعربة لتنظيم قائمة الأوامر العامة
   async: async (m, {
      client,
      text,
      isPrefix,
      command,
      Utils
   }) => {
      try {
         if (command === 'بينج' || command === 'bing') {
            // التحقق من كتابة نص بعد الأمر، وفي حال عدم إدخاله يتم عرض مثال توضيحي للمستخدم
            if (!text) return client.reply(m.chat, Utils.example(isPrefix, command, 'ما هي الثقوب السوداء'), m)
            
            // إرسال تفاعل تفاعلي يفيد ببدء المعالجة والتحضير
            client.sendReact(m.chat, '🕒', m.key)
            
            // إرسال الاستفسار إلى خادم الذكاء الاصطناعي برمجياً
            const json = await Api.neoxr('/bing-chat', {
               q: text
            })
            
            // التحقق من نجاح عملية جلب البيانات من الخادم
            if (!json.status) return client.reply(m.chat, Utils.jsonFormat(json), m)
            
            // إرسال إجابة الذكاء الاصطناعي للمستخدم متبوعة بحقوق المطور
            let replyMessage = `${json.data.message}\n\n© DEV ABOODI OFFICIAL`
            client.reply(m.chat, replyMessage, m)
         }
      } catch (e) {
         client.reply(m.chat, Utils.jsonFormat(e), m)
      }
   },
   error: false,
   limit: true // تفعيل استهلاك نقاط الحد اليومي عند استخدام هذا الأمر
}
