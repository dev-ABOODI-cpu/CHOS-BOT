import { execSync } from 'child_process'

export const run = {
   usage: ['تحديث_البوت'], // الاسم العربي الرئيسي الذي سيظهر في القائمة (تحديث_البوت)
   hidden: ['update', 'تحديث', 'تحديث_النظام'], // الاختصارات المخفية لضمان عمل البوت كبدائل دائماً
   category: 'المطور', // الفئة المعربة لتنظيم قائمة أوامر المالك
   async: async (m, {
      client,
      Utils,
   }) => {
      try {
         // تنفيذ أمر جلب التحديثات من مستودع الـ GitHub برمجياً
         var stdout = execSync('git pull')
         var output = stdout.toString()
         
         // 1. في حال كان السيرفر محدثاً بالفعل لآخر إصدار
         if (output.match(new RegExp('Already up to date', 'g'))) {
            return client.reply(m.chat, Utils.texted('bold', `🚩 نظام البوت محدث بالفعل إلى آخر إصدار متاح حالياً.`), m)
         }
         
         // 2. في حال وجود ملفات متعارضة، يتم تخزينها مؤقتاً وسحب التحديث ثم إعادة تشغيل البوت
         if (output.match(/stash/g)) {
            var stdout = execSync('git stash && git pull')
            var output = stdout.toString()
            client.reply(m.chat, `🚩 تم العثور على ملفات متعارضة؛ جاري تخزينها مؤقتاً وسحب التحديثات الجديدة بنجاح...\n\nجاري إعادة تشغيل السيرفر لتطبيق التعديلات.\n\n© DEV ABOODI OFFICIAL`, m).then(async () => process.send('reset'))
         
         // 3. في حال تم التحديث العادي بنجاح وبدون مشاكل
         } else {
            return client.reply(m.chat, `✅ تم سحب وتثبيت التحديثات الجديدة بنجاح.\n\nجاري إعادة تشغيل نظام البوت لتطبيق الملفات الجديدة فوراً.\n\n© DEV ABOODI OFFICIAL`, m).then(async () => process.send('reset'))
         }
      } catch (e) {
         return client.reply(m.chat, Utils.jsonFormat(e), m)
      }
   },
   owner: true // الأداة إدارية حساسة للغاية ومخصصة فقط لمالك البوت لحماية ملفات السيرفر
}
