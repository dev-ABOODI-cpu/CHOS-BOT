import translate from 'translate-google-api'

export const run = {
   usage: ['ترجمة'], // الاسم العربي الرئيسي الذي سيظهر في القائمة (ترجمة)
   hidden: ['translate', 'tr', 'مترجم'], // الاختصارات المخفية لضمان عمل البوت كبدائل دائماً
   use: 'رمز اللغة + النص المستهدف (أو الرد على رسالة)',
   category: 'أدوات مـساعدة', // الفئة المعربة لتنظيم قائمة الأوامر العامة
   async: async (m, {
      client,
      text,
      isPrefix,
      command,
      Utils
   }) => {
      // التحقق من إدخال نص أو رمز لغة، وفي حال عدم وجوده يتم عرض مثال توضيحي (مثال: ar لترجمة النص إلى العربية)
      if (!text) return client.reply(m.chat, Utils.example(isPrefix, command, 'ar i love you'), m)
      
      // 1. حالة الرد (Reply) على رسالة نصية لترجمتها إلى اللغة المحددة
      if (text && m.quoted && m.quoted.text) {
         let lang = text.slice(0, 2) // استخراج رمز اللغة المكون من حرفين
         try {
            let data = m.quoted.text
            let result = await translate(`${data}`, {
               to: lang
            })
            
            let replyMessage = `✅ *الترجمة الناتجة:* \n\n${result[0]}\n\n© DEV ABOODI OFFICIAL`
            client.reply(m.chat, replyMessage, m)
         } catch {
            return client.reply(m.chat, Utils.texted('bold', `🚩 عذراً، رمز اللغة المدخل غير مدعوم أو غير صحيح.`), m)
         }
         
      // 2. حالة كتابة رمز اللغة والنص معاً في نفس الرسالة
      } else if (text) {
         let lang = text.slice(0, 2) // استخراج رمز اللغة المكون من حرفين
         try {
            let data = text.substring(2).trim() // استخراج النص المراد ترجمته بعد رمز اللغة
            let result = await translate(`${data}`, {
               to: lang
            })
            
            let replyMessage = `✅ *الترجمة الناتجة:* \n\n${result[0]}\n\n© DEV ABOODI OFFICIAL`
            client.reply(m.chat, replyMessage, m)
         } catch {
            return client.reply(m.chat, Utils.texted('bold', `🚩 عذراً، رمز اللغة المدخل غير مدعوم أو غير صحيح.`), m)
         }
      }
   },
   error: false
}
