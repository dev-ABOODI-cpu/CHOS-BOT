import fsPromise from 'fs/promises'
import { structure } from '../../lib/models.js'

export const run = {
   usage: ['استعادة_القاعدة'], // الاسم العربي الرئيسي الذي سيظهر في القائمة (استعادة_القاعدة)
   hidden: ['restore', 'استرجاع_البيانات', 'ترميم_الداتا'], // الاختصارات المخفية لضمان عمل البوت كبدائل دائمًا
   use: 'الرد على ملف النسخة الاحتياطية (.json)',
   category: 'المطور', // الفئة المعربة لتنظيم قائمة أوامر المالك
   async: async (m, {
      client,
      Config,
      system,
      Utils
   }) => {
      try {
         // التحقق مما إذا كان المستخدم قد قام بالرد على ملف وثيقة بصيغة JSON
         if (m.quoted && /document/.test(m.quoted.mtype) && /json/.test(m.quoted.fileName)) {
            await client.sendReact(m.chat, '🕒', m.key)
            
            // محاولة تحميل الملف المؤقت وتحليله
            const fn = await Utils.getFile(await m.quoted.download())
            if (!fn.status) return m.reply(Utils.texted('bold', '🚩 عذراً، تعذر تحميل ملف النسخة الاحتياطية من خوادم واتساب.'))
            
            // قراءة بيانات الملف المرفوع وتطبيقها على قاعدة بيانات النظام
            const data = await fsPromise.readFile(fn.file, 'utf-8')
            await system.proxy.restore(structure, data, Config.database)
            
            m.reply('✅ تم استعادة قاعدة البيانات بنجاح وترميم كافة السجلات السابقة.\n\n© DEV ABOODI OFFICIAL')
         } else {
            // في حال عدم الرد على ملف مدعوم
            m.reply(Utils.texted('bold', '🚩 خطأ: يرجى الرد أولاً على ملف النسخة الاحتياطية (.json) الخاص بالبوت متبوعاً بكتابة هذا الأمر.'))
         }
      } catch (e) {
         return client.reply(m.chat, Utils.jsonFormat(e), m)
      }
   },
   owner: true // الميزة محمية وصالحة للمطور الرئيسي فقط لمنع تخريب البيانات
}
