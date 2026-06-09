export const run = {
   usage: ['المحظورين', 'المميزين', 'المبلكين'], // الأوامر العربية الرئيسية المضافة للقائمة
   hidden: ['listban', 'listprem', 'listblock'], // الاختصارات المخفية لضمان عمل البوت بالإنجليزية أيضاً
   category: 'إحصائيات', // الفئة المعربة لتنظيم قائمة الأوامر
   async: async (m, {
      client,
      command,
      isOwner,
      blockList,
      Utils
   }) => {
      // 1. قسم عرض قائمة المحظورين من البوت (List Ban)
      if (command === 'المحظورين' || command === 'listban') {
         const data = global.db.users.filter(v => v.banned)
         if (data.length < 1) return m.reply(Utils.texted('bold', `🚩 القائمة فارغة، لا يوجد مستخدمين محظورين حالياً.`))
         
         let text = `乂  *قـائـمـة الـمـحـظـور يـن*\n\n`
         text += data.map((v, i) => {
            const jid = client.decodeJid(v.jid).replace(/@.+/, '')
            if (i == 0) {
               return `┌  ◦  @${jid}`
            } else if (i == data.length - 1) {
               return `└  ◦  @${jid}`
            } else {
               return `│  ◦  @${jid}`
            }
         }).join('\n')
         m.reply(text + '\n\n' + `© DEV ABOODI OFFICIAL`)

      // 2. قسم عرض قائمة الأعضاء المميزين (List Premium)
      } else if (command === 'المميزين' || command === 'listprem') {
         if (!isOwner) return m.reply(global.status.owner) // التحقق من أن المرسل هو المطور
         const data = global.db.users.filter(v => v.premium)
         if (data.length < 1) return m.reply(Utils.texted('bold', `🚩 القائمة فارغة، لا يوجد أعضاء مميزين حالياً.`))
         
         let text = `乂  *قـائـمـة الأعـضـاء الـمـمـيـزيـن*\n\n`
         text += data.map((v, i) => {
            const jid = client.decodeJid(v.jid).replace(/@.+/, '')
            return `   ┌ @${jid}\n   │ ` + Utils.texted('bold', 'الاستخدام') + ` : ${Utils.formatNumber(v.hit)} أمر\n   └ ` + Utils.texted('bold', 'وقت الانتهاء') + ` : ${Utils.timeReverse(v.expired - new Date() * 1)}`
         }).join('\n\n')
         m.reply(text + '\n\n' + `© DEV ABOODI OFFICIAL`)

      // 3. قسم عرض قائمة أرقام الحظر المباشر في الواتساب (List Block)
      } else if (command === 'المبلكين' || command === 'listblock') {
         if (blockList.length < 1) return m.reply(Utils.texted('bold', `🚩 القائمة فارغة، لم يتم حظر أي رقم على الواتساب.`))
         
         let text = `乂 *قـائـمـة الـحـظـر (بـلـوك)*\n\n`
         text += blockList.map((v, i) => {
            const jid = client.decodeJid(v).replace(/@.+/, '')
            if (i == 0) {
               return `┌  ◦  @${jid}`
            } else if (i == blockList.length - 1) {
               return `└  ◦  @${jid}`
            } else {
               return `│  ◦  @${jid}`
            }
         }).join('\n')
         m.reply(text + '\n\n' + `© DEV ABOODI OFFICIAL`)
      }
   },
   error: false
}
