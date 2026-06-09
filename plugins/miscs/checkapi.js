export const run = {
   usage: ['فحص_المفاتيح'], // الاسم العربي الرئيسي الذي سيظهر في القائمة (فحص_المفاتيح)
   hidden: ['checkapi', 'check'], // الاختصارات المخفية لضمان عمل البوت إذا كُتبت بالإنجليزية
   category: 'إحصائيات', // الفئة المعربة لتنظيم قائمة الأوامر
   async: async (m, {
      client,
      Utils
   }) => {
      try {
         // استدعاء دالة الفحص من خادم الواجهة المبرمجة
         let json = await Api.neoxr('/check')
         
         // إرسال البيانات المرتجعة من الفحص منسقة داخل الشات
         await client.reply(m.chat, Utils.jsonFormat(json), m)
      } catch (e) {
         // في حال حدوث مشكلة في الاتصال بالخادم أو خطأ برمجي
         client.reply(m.chat, global.status.error, m)
      }
   },
   error: false
}
