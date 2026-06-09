export const run = {
   usage: ['تصفير_الحدود'], // الاسم العربي الرئيسي الذي سيظهر في القائمة (تصفير_الحدود)
   hidden: ['reset', 'تصفير', 'تجديد_الحدود'], // الاختصارات المخفية لضمان عمل البوت إذا كُتبت بالإنجليزية أو العربية البديلة
   category: 'المطور', // الفئة المعربة لتنظيم قائمة أوامر المالك
   async: async (m, {
      client,
      args,
      command,
      setting,
      Config,
      Utils
   }) => {
      try {
         // إعادة تعيين حد الاستخدام للمستخدمين غير المشتركين في النظام المميز
         global.db.users.filter(v => v.limit < Config.limit && !v.premium).map(v => v.limit = args[0] ? parseInt(args[0]) : Config.limit)
         
         // تسجيل وقت التحديث الحالي في إعدادات النظام
         setting.lastReset = new Date * 1
         
         // إرسال رسالة التأكيد باللغة العربية مع حفظ حقوقك الشخصية
         client.reply(m.chat, Utils.texted('bold', `🚩 تم إعادة تعيين حد الاستخدام اليومي لجميع المستخدمين المجانيين إلى الحد الافتراضي بنجاح.\n\n© DEV ABOODI OFFICIAL`), m)
      } catch (e) {
         return client.reply(m.chat, Utils.jsonFormat(e), m)
      }
   },
   owner: true // الأداة محمية ومخصصة لمالك البوت فقط
}
