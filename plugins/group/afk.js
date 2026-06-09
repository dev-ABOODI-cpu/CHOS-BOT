export const run = {
   usage: ['وضع_الغياب'], // الاسم العربي الرئيسي الذي سيظهر في القائمة (وضع_الغياب)
   hidden: ['afk'], // الاختصار المخفي لضمان عمل البوت إذا كُتب بالإنجليزية
   use: 'السبب (اختياري)',
   category: 'المجموعات', // الفئة المعربة لتنظيم قائمة الأوامر
   async: async (m, {
      client,
      text,
      Utils
   }) => {
      try {
         let user = global.db.users.find(v => v.jid == m.sender)
         user.afk = +new Date
         user.afkReason = text
         user.afkObj = m
         let tag = m.sender.split`@` [0]
         
         // إرسال رسالة التنبيه باللغة العربية مع الإشارة لـ ID المستخدم
         return client.reply(m.chat, Utils.texted('bold', `🚩 العضو @${tag} الآن في وضع الغياب (AFK)!`), m)
      } catch {
         client.reply(m.chat, global.status.error, m)
      }
   },
   error: false,
   group: true // الميزة تعمل حصرياً داخل المجموعات
}
