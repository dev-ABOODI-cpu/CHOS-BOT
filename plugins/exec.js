import { exec } from 'child_process'
import util from 'util'
import syntax from 'syntax-error'

export const run = {
   async: async (m, {
      client,
      body,
      ctx,
      isOwner,
      Utils,
      Scraper,
      waSocket
   }) => {
      // التحقق الصارم: إذا لم يكن المستخدم هو المطور (Owner)، يتم تجاهل الأمر تماماً لحماية السيرفر
      if (typeof body === 'object' || !isOwner) return
      
      let command, text
      let x = body && body.trim().split`\n`,
         y = ''
      command = x[0] ? x[0].split` `[0] : ''
      y += x[0] ? x[0].split` `.slice`1`.join` ` : '', y += x ? x.slice`1`.join`\n` : ''
      text = y.trim()
      if (!text) return
      
      // 1. رمز (=>): لتقييم واختبار الأكواد مع إرجاع القيمة المرتجعة فوراً للمطور
      if (command === '=>') {
         try {
            var evL = await eval(`(async () => { return ${text} })()`)
            
            // إرسال النتيجة منسقة بصيغة JSON متبوعة بحقوقك
            let replyMessage = `${Utils.jsonFormat(evL)}\n\n© DEV ABOODI OFFICIAL`
            client.reply(m.chat, replyMessage, m)
         } catch (e) {
            let err = await syntax(text)
            m.reply(typeof err != 'undefined' ? Utils.texted('monospace', err) + '\n\n' : '' + util.format(e))
         }
         
      // 2. رمز (>): لتشغيل الأكواد البرمجية مباشرة دون اشتراط وجود قيمة مرتجعة (Return)
      } else if (command === '>') {
         try {
            var evL = await eval(`(async () => { ${text} })()`)
            m.reply(Utils.jsonFormat(evL))
         } catch (e) {
            let err = await syntax(text)
            m.reply(typeof err != 'undefined' ? Utils.texted('monospace', err) + '\n\n' : '' + Utils.jsonFormat(e))
         }
         
      // 3. رمز ($): لتنفيذ أوامر سطر الأوامر (Terminal Commands) داخل بيئة لينكس أو الويندوز المستضيف للسيرفر
      } else if (command == '$') {
         // إرسال تفاعل الانتظار أثناء معالجة الأمر في النظام
         client.sendReact(m.chat, '🕒', m.key)
         
         exec(text.trim(), (err, stdout) => {
            if (err) return m.reply(`🚩 خطأ في النظام:\n${err.toString()}`)
            if (stdout) {
               let replySystem = `✅ مخرجات النظام:\n${stdout.toString()}\n\n© DEV ABOODI OFFICIAL`
               return m.reply(replySystem)
            }
         })
      }
   },
   error: false
}
