import fsPromise from 'fs/promises'
import { structure } from '../../lib/models.js'

export const run = {
   usage: ['نسخة_احتياطية'], // الاسم العربي الرئيسي الذي سيظهر في القائمة (نسخة_احتياطية)
   hidden: ['backup', 'نسخه', 'باك اب'], // الاختصارات المخفية لضمان عمل البوت إذا كُتبت بالإنجليزية أو العربية البديلة
   category: 'المطور', // الفئة المعربة لتنظيم قائمة الأوامر الخاصة بالمالك
   async: async (m, {
      client,
      Config,
      system,
      Utils
   }) => {
      try {
         await client.sendReact(m.chat, '🕒', m.key)
         
         // استدعاء دالة النسخ الاحتياطي لقاعدة البيانات
         const data = await system.proxy.backup(structure, Config.database)
         const now = new Intl.DateTimeFormat('en-CA', { timeZone: process.env.TZ, hour12: false, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(new Date()).replace(', ', '_').replace(/:/g, '-')
         const filename = `${Config.database}-${now}.json`
         
         // كتابة الملف مؤقتاً على السيرفر وقراءته لإرساله
         await fsPromise.writeFile(filename, data, 'utf-8')
         const buffer = await fsPromise.readFile(filename)
         
         // إرسال ملف النسخة الاحتياطية للمطور وحذفه فوراً بعد الإرسال بنجاح
         await client.sendFile(m.chat, buffer, filename, '📦 تم توليد النسخة الاحتياطية بنجاح.\n\n© DEV ABOODI OFFICIAL', m).then(async () => {
            await fsPromise.unlink(filename)
         })
      } catch (e) {
         return client.reply(m.chat, Utils.jsonFormat(e), m)
      }
   },
   owner: true // الميزة مقفلة وتعمل فقط لمالك ومطور البوت الرئيسي
}
