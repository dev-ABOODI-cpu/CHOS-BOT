export const run = {
   usage: ['تعيين_القائمة'], // الاسم العربي الرئيسي الذي سيظهر في القائمة (تعيين_القائمة)
   hidden: ['setmenu', 'تغيير_المنيو', 'شكل_القائمة'], // الاختصارات المخفية لضمان عمل البوت كبدائل دائمًا
   use: 'رقم الشكل (من 1 إلى 6)',
   category: 'المطور', // الفئة المعربة لتنظيم قائمة أوامر المالك
   async: async (m, {
      client,
      args,
      isPrefix,
      command,
      setting,
      Utils
   }) => {
      try {
         // التحقق من إدخال رقم الشكل المطلوب، وفي حال عدم إدخاله يتم عرض مثال توضيحي للمطور
         if (!args || !args[0]) return m.reply(Utils.example(isPrefix, command, '2'))
         
         // التحقق من أن رقم الشكل المدخل مدعوم برمجياً وضمن الخيارات المتاحة من 1 إلى 6
         if (!['1', '2', '3', '4', '5', '6'].includes(args[0])) return client.reply(m.chat, Utils.texted('bold', `🚩 هذا الشكل غير متوفر حالياً. الأشكال المتاحة فقط هي من 1 إلى 6.`), m)
         
         // تحديث شكل القائمة في قاعدة بيانات الإعدادات وإرسال رسالة التأكيد
         client.reply(m.chat, `🚩 تم تعيين وتحديث شكل قائمة الأوامر بنجاح باستخدام النمط الرقمي [ *${args[0]}* ].\n\n© DEV ABOODI OFFICIAL`, m).then(() => setting.style = parseInt(args[0]))
      } catch (e) {
         client.reply(m.chat, Utils.jsonFormat(e), m)
      }
   },
   owner: true // الأداة محمية ومخصصة لمالك ومطور البوت فقط لحماية واجهة العرض
}
