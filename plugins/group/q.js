export const run = {
   usage: ['اقتباس'], // الاسم العربي الرئيسي الذي سيظهر في القائمة (اقتباس)
   hidden: ['q', 'quoted'], // الاختصارات المخفية لضمان عمل البوت إذا كُتبت بالإنجليزية
   use: 'الرد على رسالة تحتوي مقتبس',
   category: 'المجموعات', // الفئة المعربة لتنظيم قائمة الأوامر
   async: async (m, {
      client,
      store,
      Utils
   }) => {
      try {
         // التحقق مما إذا كان المستخدم قد قام بالرد على رسالة ما
         if (!m.quoted) return client.reply(m.chat, Utils.texted('bold', `🚩 يرجى الرد على الرسالة التي تحتوي على اقتباس داخلي.`), m)
         
         // تحميل بيانات الرسالة المستهدفة من ذاكرة التخزين المؤقت للبوت
         const msg = await store.loadMessage(m.chat, m.quoted.id)
         
         // التحقق مما إذا كانت الرسالة المحملة تحتوي بالفعل على رد أو اقتباس مخفي
         if (msg.quoted === null) return client.reply(m.chat, Utils.texted('bold', `🚩 هذه الرسالة لا تحتوي على رد أو اقتباس داخلي لجلبها.`), m)
         
         // نسخ وتحويل الرسالة المقتبسة الأصلية وإرسالها في الشات
         return client.copyNForward(m.chat, msg.quoted.fakeObj)
      } catch (e) {
         // في حال عدم العثور على الرسالة في الذاكرة أو حدوث خطأ في التحميل
         client.reply(m.chat, `🚩 عذراً، لم أتمكن من تحميل الرسالة الأصلية من الذاكرة مؤقتاً.`, m)
      }
   },
   error: false
}
