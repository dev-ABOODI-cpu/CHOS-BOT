export const run = {
   async: async (m, {
      client,
      Utils
   }) => {
      try {
         /**
          * تم استخدام المتغير global.clearDB لضمان إنشاء مؤقت التنظيف التلقائي لمرة واحدة فقط.
          * هذا يمنع البوت من تكرار إنشاء دالة (setInterval) مع كل رسالة جديدة،
          * مما يحمي السيرفر من استهلاك المعالج (CPU) وتضخم الذاكرة العشوائية (RAM).
          */
         if (!global.clearDB) {
            global.clearDB = true
            
            // تعيين مؤقت يعمل بشكل دوري في الخلفية كل 60 ثانية (دقيقة واحدة)
            setInterval(async () => {
               let day = 86400000 * 3, // تعيين مدة المهلة (3 أيام بالمللي ثانية)
                   now = new Date() * 1 // الوقت الحالي بالمللي ثانية
               
               // 1. تصفية وحذف حسابات المستخدمين غير النشطين لمدة 3 أيام
               global.db.users.filter(v => now - v.lastseen > day && !v.premium && !v.banned && v.point < 1000000).map(v => {
                  let user = global.db.users.find(x => x.jid == v.jid)
                  if (user) Utils.removeItem(global.db.users, user)
               })
               
               // 2. تصفية وحذف سجلات الدردشات (الخاص) المهجورة منذ 3 أيام
               global.db.chats.filter(v => now - v.lastseen > day).map(v => {
                  let chat = global.db.chats.find(x => x.jid == v.jid)
                  if (chat) Utils.removeItem(global.db.chats, chat)
               })
               
               // 3. تصفية وحذف بيانات المجموعات غير النشطة منذ 3 أيام
               global.db.groups.filter(v => now - v.activity > day).map(v => {
                  let group = global.db.groups.find(x => x.jid == v.jid)
                  if (group) Utils.removeItem(global.db.groups, group)
               })
            }, 60_000)
         }
      } catch (e) {
         // إرسال تفاصيل الخطأ البرمجي في حال حدوث مشكلة أثناء التنظيف
         return client.reply(m.chat, Utils.jsonFormat(e), m)
      }
   },
   error: false
}
