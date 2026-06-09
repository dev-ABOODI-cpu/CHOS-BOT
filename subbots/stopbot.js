import fs from 'fs'
import path from 'path'

const sessionsDir = path.resolve('./sessions_sub')

export const run = {
   usage: ['ايقاف_البوت', 'حذف_ربطي'],
   hidden: ['stopbot', 'logout'],
   category: 'البوتات الفرعية',
   async: async (m, { client, Utils }) => {
      const userNumber = m.sender.split('@')[0]
      const userSessionPath = path.join(sessionsDir, userNumber)

      if (!fs.existsSync(userSessionPath)) {
         return client.reply(m.chat, Utils.texted('bold', `🚩 ليس لديك جلسة نشطة لإنهائها بالفعل.`), m)
      }

      try {
         // حذف مجلد الجلسة بالكامل وإعادة تصفير العدادات
         fs.rmSync(userSessionPath, { recursive: true, force: true })
         if (global.db.users[m.sender]) {
            global.db.users[m.sender].subBotMsgs = 0
            global.db.users[m.sender].subBotUptime = null
         }

         await client.reply(m.chat, Utils.texted('bold', `🛑 تم إيقاف البوت الفرعي الخاص بك بنجاح وحذف كافة بيانات الجلسة من النظام.`), m)
      } catch (e) {
         await client.reply(m.chat, Utils.texted('bold', `🚩 حدث خطأ أثناء محاولة حذف الجلسة.`), m)
      }
   },
   error: false
}

