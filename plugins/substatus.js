import fs from 'fs'
import path from 'path'

const sessionsDir = path.resolve('./sessions_sub')

export const run = {
   usage: ['حالة_البوت', 'حالة_ربطي'],
   hidden: ['botstatus', 'substatus'],
   category: 'البوتات الفرعية',
   async: async (m, { client, Utils }) => {
      const userNumber = m.sender.split('@')[0]
      const userSessionPath = path.join(sessionsDir, userNumber)

      if (!fs.existsSync(userSessionPath)) {
         return client.reply(m.chat, Utils.texted('bold', `🚩 ليس لديك بوت فرعي نشط حالياً. اكتب (.ربط) لتشغيل بوتك.`), m)
      }

      const userDb = global.db.users[m.sender] || {}
      const msgCount = userDb.subBotMsgs || 0
      const uptimeMs = userDb.subBotUptime ? Date.now() - userDb.subBotUptime : 0
      
      const hours = Math.floor(uptimeMs / (1000 * 60 * 60))
      const minutes = Math.floor((uptimeMs % (1000 * 60 * 60)) / (1000 * 60))
      const uptimeString = `${hours} ساعة و ${minutes} دقيقة`

      const statusText = `${Utils.texted('bold', `📊 إحصائيات البوت الفرعي الخاص بك:`)}\n\n` +
                         `• *الحالة:* متصل ومستقر 🟢\n` +
                         `• *عدد الرسائل المعالجة:* ${msgCount} رسالة\n` +
                         `• *مدة العمل الحالية:* ${uptimeString}\n\n` +
                         `© DEV ABOODI OFFICIAL`

      await client.reply(m.chat, statusText, m)
   },
   error: false
}
