export const run = {
   usage: ['فحص'], // الاسم العربي الرئيسي الذي سيظهر في القائمة (فحص)
   hidden: ['profile', 'معلومات', 'كشف'], // الاختصارات المخفية لضمان عمل البوت كبدائل دائماً
   use: 'إشارة (منشن)، رد، أو رقم الهاتف المستهدف',
   category: 'معلومات المستخدم', // الفئة المعربة لتنظيم قائمة أوامر الأعضاء
   async: async (m, {
      client,
      text,
      blockList,
      Config,
      Utils
   }) => {
      // تنظيف المدخلات واستخراج الرقم النقي سواء من المنشن أو النص
      let number = isNaN(text) ? (text.startsWith('+') ? text.replace(/[()+\s-]/g, '') : (text).split`@`[1]) : text
      if (!text && !m.quoted) return client.reply(m.chat, Utils.texted('bold', `🚩 يرجى الإشارة (منشن) أو الرد على المستخدم المستهدف أو كتابة رقمه لفحصه.`), m)
      if (isNaN(number)) return client.reply(m.chat, Utils.texted('bold', `🚩 الرقم المدخل غير صالحة أو يحتوي على رموز خاطئة.`), m)
      if (number.length > 15) return client.reply(m.chat, Utils.texted('bold', `🚩 صيغة الرقم غير صحيحة (تجاوز الحد المسموح لطول الأرقام).`), m)
      
      try {
         if (text) {
            var user = number + '@s.whatsapp.net'
         } else if (m.quoted.sender) {
            var user = m.quoted.sender
         } else if (m.mentionedJid) {
            var user = number + '@s.whatsapp.net'
         }
      } catch (e) { } finally {
         let target = global.db.users.find(v => v.jid == user)
         if (typeof target == 'undefined') return client.reply(m.chat, Utils.texted('bold', `🚩 تعذر العثور على بيانات هذا المستخدم في قاعدة بيانات البوت.`), m)
         
         // جلب الصورة الشخصية للحساب المستهدف
         const avatar = await client.profilePicture(user)
         let blocked = blockList.includes(user) ? true : false
         
         // جلب عدد التحذيرات الحالية للمستخدم المستهدف
         let groupWarning = m.isGroup ? (typeof global.db.groups.find(v => v.jid == m.chat).member[user] != 'undefined' ? global.db.groups.find(v => v.jid == m.chat).member[user].warning : 0) : target.warning

         // بناء واجهة البيانات للشخص المستهدف
         let caption = `乂  *مـعـلـو مـا ت  ا لـعـضـو*\n\n`
         caption += `	◦  *الاسم* : ${target.name}\n`
         caption += `	◦  *الحد اليومي* : ${Utils.formatNumber(target.limit)}\n`
         caption += `	◦  *عدد الاستخدامات* : ${Utils.formatNumber(target.hit)}\n`
         caption += `	◦  *التحذيرات* : ${groupWarning} / 5\n\n`
         
         caption += `乂  *حـا لـة  ا لـحـسـا ب*\n\n`
         caption += `	◦  *محظور من رقم البوت* : ${(blocked ? 'نعم  ✅' : 'لا  ❌')}\n`
         caption += `	◦  *محظور برمجياً (بان)* : ${(target.ban_temporary > 0 && (Date.now() - target.ban_temporary < Config.timeout))
            ? 'مؤقت لـ ' + Utils.toTime((target.ban_temporary + Config.timeout) - Date.now())
            : target.banned ? 'نعم  ✅' : 'لا  ❌'}\n`
         caption += `	◦  *استخدم الخاص* : ${(global.db.chats.map(v => v.jid).includes(user) ? 'نعم  ✅' : 'لا  ❌')}\n`
         caption += `	◦  *الحساب المميز (Premium)* : ${(target.premium ? 'نعم  ⭐' : 'لا  ❌')}\n`
         caption += `	◦  *انتهاء الاشتراك المميز* : ${target.expired == 0 ? '-' : Utils.timeReverse(target.expired - new Date() * 1)}\n\n`
         
         caption += `© DEV ABOODI OFFICIAL`
         
         // إرسال بطاقة الفحص مدمجة مع الصورة الشخصية للحساب المستهدف بشكل مربع
         client.sendMessageModify(m.chat, caption, m, {
            largeThumb: true,
            type: 'preview-link',
            ratio: 'square',
            thumbnail: avatar
         })
      }
   },
   error: false
}
