export const run = {
   async: async (m, {
      client,
      body,
      users,
      Utils
   }) => {
      try {
         // جمع كل المعرفات التي تم الإشارة إليها في الرسالة أو الرد
         let afk = [...new Set([...(m.mentionedJid || []), ...(m.quoted ? [m.quoted.sender] : [])])]
         for (let jid of afk) {
            let is_user = global.db.users.find(v =>
               v.jid == jid || v.lid === jid
            )
            if (!is_user) continue
            let afkTime = is_user.afk
            if (!afkTime || afkTime < 0) continue
            let reason = is_user.afkReason || ''
            
            // إذا لم تكن الرسالة صادرة من البوت نفسه
            if (!m.fromMe) {
               // 1. الرد داخل المجموعة لتوضيح حالة غياب العضو
               client.reply(m.chat, `*العضو في وضع الغياب الحركي (AFK)* : @${is_user.jid.split('@')[0]}\n• *السبب* : ${reason ? reason : 'بدون سبب معين'}\n• *مدة الغياب* : [ ${Utils.toTime(new Date - afkTime)} ]\n\n© DEV ABOODI OFFICIAL`, m).then(async () => {
                  
                  // 2. إرسال تنبيه خاص في شات العضو الغائب لإعلامه بالإشارة
                  client.reply(jid, `تنبيه: قام أحد الأعضاء في مجموعة *${await (await client.groupMetadata(m.chat)).subject}* بالإشارة إليك أو الرد على رسالتك.\n\n• *المرسل* : @${m.sender.split('@')[0]}`, m).then(async () => {
                     // نسخ وتوجيه الرسالة الأصلية إلى خاص العضو الغائب
                     await client.copyNForward(jid, m)
                  })
               })
            }
         }
      } catch (e) {
         return client.reply(m.chat, Utils.jsonFormat(e), m)
      }
   },
   error: false,
   group: true // الميزة تعمل داخل المجموعات فقط لتتبع إشارات الأعضاء
}
