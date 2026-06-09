export const run = {
   usage: ['تعيين_الترحيب', 'تعيين_المغادرة'], // تم تعريب الأوامر لتظهر في قائمة البوت بالعربية
   hidden: ['setout'],
   use: 'النص',
   category: 'أدوات المشرفين', // تم تعريب الفئة لتنظيم القائمة
   async: async (m, {
      client,
      text,
      isPrefix,
      command,
      Utils
   }) => {
      let setup = global.db.groups.find(v => v.jid == m.chat)
      
      // معالجة أمر تعيين نص الترحيب
      if (command == 'تعيين_الترحيب') {
         if (!text) return client.reply(m.chat, formatWel(isPrefix, command), m)
         setup.text_welcome = text
         await client.reply(m.chat, Utils.texted('bold', `✅ تم حفظ نص الترحيب الجديد بنجاح.\n\n© DEV ABOODI OFFICIAL`), m)
         
      // معالجة أمر تعيين نص المغادرة
      } else if (command == 'تعيين_المغادرة' || /set(out|left)/i.test(command)) {
         if (!text) return client.reply(m.chat, formatLef(isPrefix, command), m)
         setup.text_left = text
         await client.reply(m.chat, Utils.texted('bold', `✅ تم حفظ نص المغادرة الجديد بنجاح.\n\n© DEV ABOODI OFFICIAL`), m)
      }
   },
   admin: true, // يتطلب أن يكون المستخدم مشرفاً لتغيير الإعدادات
   group: true
}

// دالة تنسيق وشرح رسالة الترحيب بالعربية
const formatWel = (prefix, command) => {
   return `عذراً، لا يمكن ترك الأمر فارغاً بدون نص. إليك طريقة الاستخدام والمتغيرات المتاحة:

*1.* +tag : للإشارة (Tag) إلى العضو الجديد تلقائياً.
*2.* +grup : لجلب اسم المجموعة الحالي تلقائياً.

• *مثال توضيحي* : ${prefix + command} أهلاً بك يا +tag في مجموعة +grup، نتمنى لك وقتاً ممتعاً معنا.`
}

// دالة تنسيق وشرح رسالة المغادرة بالعربية
const formatLef = (prefix, command) => {
   return `عذراً، لا يمكن ترك الأمر فارغاً بدون نص. إليك طريقة الاستخدام والمتغيرات المتاحة:

*1.* +tag : للإشارة (Tag) إلى العضو المغادر تلقائياً.
*2.* +grup : لجلب اسم المجموعة الحالي تلقائياً.

• *مثال توضيحي* : ${prefix + command} وداعاً +tag، نراك على خير.`
}
