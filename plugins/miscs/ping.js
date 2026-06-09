export const run = {
   usage: ['فحص_السرعة'], // الاسم العربي الرئيسي الذي سيظهر في القائمة (فحص_السرعة)
   hidden: ['ping', 'بينج', 'السرعة'], // الاختصارات المخفية لضمان عمل البوت إذا كُتبت بالإنجليزية أو العربية البديلة
   category: 'إحصائيات', // الفئة المعربة لتنظيم قائمة الأوامر
   async: async (m, {
      client
   }) => {
      const start = Date.now()
      
      // إرسال رسالة الفحص الأولية
      const msg = await client.reply(m.chat, 'جاري الفحص ...', m)
      const end = Date.now()
      
      // تعديل الرسالة السابقة لإظهار سرعة الاستجابة الفعلية بالملي ثانية وحفظ حقوقك
      client.sendMessage(m.chat, {
         text: `✨ سرعة استجابة السيرفر: [ ${end - start}ms ]\n\n© DEV ABOODI OFFICIAL`,
         edit: msg.key
      })
   },
   error: false
}
