export const run = {
   usage: ['الصورة'], // الاسم العربي الرئيسي الذي سيظهر في القائمة (الصورة)
   hidden: ['ava', 'avatar'], // الاختصارات المخفية لضمان عمل البوت إذا كُتبت بالإنجليزية
   use: 'إشارة أو رد',
   category: 'المجموعات', // الفئة المعربة لتنظيم قائمة الأوامر
   async: async (m, {
      client,
      text,
      Utils
   }) => {
      // استخراج الرقم النمطي للمستخدم سواء من الإشارة أو النص
      let number = isNaN(text) ? (text.startsWith('+') ? text.replace(/[()+\s-]/g, '') : (text).split`@` [1]) : text
      
      // التحقق من وجود منشن أو رد على رسالة المستهدف
      if (!text && !m.quoted) return client.reply(m.chat, Utils.texted('bold', `🚩 يرجى عمل إشارة (منشن) للمستخدم أو الرد على رسالته.`), m)
      if (isNaN(number)) return client.reply(m.chat, Utils.texted('bold', `🚩 الرقم غير صحيح أو غير صالح.`), m)
      if (number.length > 15) return client.reply(m.chat, Utils.texted('bold', `🚩 صيغة المعرف الرقمي غير مدعومة.`), m)
      
      try {
         if (text) {
            var user = number + '@s.whatsapp.net'
         } else if (m.quoted.sender) {
            var user = m.quoted.sender
         } else if (m.mentionedJid) {
            var user = number + '@s.whatsapp.net'
         }
      } catch (e) {
         console.log(e)
      } finally {
         var pic = false
         try {
            // جلب رابط الصورة الشخصية بدقة عالية
            var pic = await client.profilePictureUrl(user, 'image')
         } catch {} finally {
            // في حال كان المستخدم يضع قيود خصوصية أو لا يملك صورة شخصية
            if (!pic) return client.reply(m.chat, Utils.texted('bold', `🚩 عذراً، هذا المستخدم لا يضع صورة شخصية أو يخفيها عن العامة.`), m)
            
            // إرسال الصورة المستخرجة مع الحقوق المخصصة بك
            client.sendFile(m.chat, pic, 'avatar.jpg', `📸 الصورة الشخصية للمستخدم المطلوب.\n\n© DEV ABOODI OFFICIAL`, m)
         }
      }
   },
   error: false
}
