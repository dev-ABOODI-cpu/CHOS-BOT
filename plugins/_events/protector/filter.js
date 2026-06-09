export const run = {
   async: async (m, {
      client,
      body,
      users,
      groupSet,
      setting,
      isAdmin,
      isBotAdmin,
      Utils
   }) => {
      try {
         // التحقق مما إذا كانت ميزة التصفية مفعلة، والمرسل ليس مشرفاً، والبوت مشرف، والرسالة ليست من البوت نفسه
         if (groupSet.filter && !isAdmin && isBotAdmin && !m.fromMe) {
            let toxic = setting.toxic
            if (body && (new RegExp('\\b' + toxic.join('\\b|\\b') + '\\b')).test(body.toLowerCase())) {
               
               // زيادة عداد التحذيرات للعضو المخالف بمقدار 1
               groupSet.member[m.sender].warning += 1
               let warning = groupSet.member[m.sender].warning
               
               // إذا بلغت التحذيرات 5 من 5، يتم طرد العضو وحذف رسالته
               if (warning > 4) return client.reply(m.chat, Utils.texted('bold', `🚩 تحذير النظام: [ 5 / 5 ]، لقد تجاوزت الحد المسموح به للتحذيرات. وداعاً ~~`), m).then(() => {
                  client.groupParticipantsUpdate(m.chat, [m.sender], 'remove').then(async () => {
                     groupSet.member[m.sender].warning = 0
                     client.sendMessage(m.chat, {
                        delete: {
                           remoteJid: m.chat,
                           fromMe: isBotAdmin ? false : true,
                           id: m.key.id,
                           participant: m.sender
                        }
                     })
                  })
               })
               
               // في حال كان التحذير أقل من 5، يتم إرسال تنبيه للعضو وحذف الرسالة المخالفة
               return client.reply(m.chat, `乂  *ت ن ب ي ه  و ت ح ذ ي ر* \n\nلقد تلقيت تحذيراً بسبب استخدام كلمات غير لائقة: [ ${warning} / 5 ]\n\n⚠️ تنبيه: إذا وصلت إلى 5 تحذيرات، سيتم طردك تلقائياً من المجموعة.\n\n© DEV ABOODI OFFICIAL`, m).then(() => client.sendMessage(m.chat, {
                  delete: {
                     remoteJid: m.chat,
                     fromMe: isBotAdmin ? false : true,
                     id: m.key.id,
                     participant: m.sender
                  }
               }))
            }
         }
      } catch (e) {
         return client.reply(m.chat, Utils.jsonFormat(e), m)
      }
   },
   group: true // الميزة تعمل داخل المجموعات فقط
}
