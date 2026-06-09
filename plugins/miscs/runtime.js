export const run = {
   usage: ['مدة_التشغيل'], // الاسم العربي الرئيسي الذي سيظهر في القائمة (مدة_التشغيل)
   hidden: ['runtime', 'run', 'التشغيل'], // الاختصارات المخفية لضمان عمل البوت إذا كُتبت بالإنجليزية أو العربية البديلة
   category: 'إحصائيات', // الفئة المعربة لتنظيم قائمة الأوامر
   async: async (m, {
      client,
      Utils
   }) => {
      // حساب وقت تشغيل العمليات بالملي ثانية وتحويله لصيغة زمنية مقروءة
      let _uptime = process.uptime() * 1000
      let uptime = Utils.toTime(_uptime)
      
      // إرسال النتيجة باللغة العربية مع دمج حقوق المطور الخاصة بك
      client.reply(m.chat, Utils.texted('bold', `⏳ مدة تشغيل البوت المستمرة: [ ${uptime} ]\n\n© DEV ABOODI OFFICIAL`), m)
   },
   error: false
}
