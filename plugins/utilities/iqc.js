export const run = {
   usage: ['صنع_اقتباس'], // الاسم العربي الرئيسي الذي سيظهر في القائمة (صنع_اقتباس)
   hidden: ['iqc', 'اقتباس_شات', 'صورة_دردشة'], // الاختصارات المخفية لضمان عمل البوت كبدائل دائماً
   use: 'النص | الوقت الرئيسي | وقت الرسالة',
   category: 'أدوات مـساعدة', // الفئة المعربة لتنظيم قائمة الأوامر العامة
   async: async (m, {
      client,
      text,
      isPrefix,
      command,
      Utils
   }) => {
      try {
         // التحقق من كتابة نص بعد الأمر، وفي حال عدم إدخاله يتم عرض مثال توضيحي لكيفية التقسيم
         if (!text) return client.reply(m.chat, Utils.example(isPrefix, command, `مرحباً | 20:20 | 04:30`), m)
         
         // إرسال تفاعل تفاعلي يفيد ببدء توليد الصورة
         client.sendReact(m.chat, '🕒', m.key)
         
         let old = new Date()
         
         // فصل النص المدخل برمجياً بناءً على علامة الفاصل (|) إلى ثلاثة أجزاء
         const [chat, time, chat_time] = text.split('|')
         
         // إرسال البيانات المجهزة إلى الخادم لصنع الصورة
         const json = await Api.neoxr('/iqc', {
            text: chat.trim(),
            time: time?.trim(),
            chat_time: chat_time?.trim()
         })
         
         // إرسال الصورة الناتجة للمستخدم مع حساب سرعة المعالجة بالميلي ثانية وحقوقك
         let caption = `🍟 *سرعة الجلب* : ${((new Date() - old) * 1)} م.ث\n\n© DEV ABOODI OFFICIAL`
         client.sendFile(m.chat, json.data.url, 'quote.png', caption, m)
         
      } catch (e) {
         console.log(e)
         return client.reply(m.chat, Utils.jsonFormat(e), m)
      }
   },
   error: false,
   limit: true // تفعيل استهلاك نقاط الحد اليومي عند استخدام هذا الأمر لضمان استقرار السيرفر
}
