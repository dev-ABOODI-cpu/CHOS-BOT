export const run = {
   usage: ['ربط_ملصق', 'حذف_ملصق'], // الأوامر العربية الرئيسية المضافة للقائمة لقفل وتفعيل الأوامر بالملصقات
   hidden: ['+cmdstic', '-cmdstic', 'امر_ملصق'], // الاختصارات المخفية لضمان عمل البوت إذا كُتبت بالإنجليزية
   use: 'الأمر النصي / الرد على الملصق المستهدف',
   category: 'المطور', // الفئة المعربة لتنظيم قائمة أوامر المالك
   async: async (m, {
      client,
      text,
      command,
      Utils
   }) => {
      // 1. قسم ربط ملصق بأمر نصي معين (+cmdstic)
      if (command === 'ربط_ملصق' || command === '+cmdstic') {
         if (!m.quoted || !/webp/.test(m.quoted.mimetype)) return client.reply(m.chat, Utils.texted('bold', `🚩 يرجى الرد على الملصق الذي تريد ربطه بأمر معين.`), m)
         if (!text) return client.reply(m.chat, Utils.texted('bold', `🚩 يرجى كتابة النص أو الأمر البرمجي المراد ربطه بالملصق بعد اسم الأمر.`), m)
         
         let hash = m.quoted.fileSha256.toString().replace(/,/g, '')
         if (typeof global.db.sticker[hash] != 'undefined') return client.reply(m.chat, `${Utils.texted('bold', `🚩 هذا الملصق مرتبط بالفعل في قاعدة البيانات بالأمر`)} : ${Utils.texted('monospace', global.db.sticker[hash].text)}`, m)
         
         // تسجيل معرف الملصق والأمر المرتبط به وتوقيت الإنشاء
         global.db.sticker[hash] = {
            text: text,
            created: new Date() * 1
         }
         client.reply(m.chat, `${Utils.texted('bold', `🚩 تم ربط الملصق بالأمر بنجاح`)} : ${Utils.texted('monospace', text)}\n\n© DEV ABOODI OFFICIAL`, m)
         
      // 2. قسم حذف ربط ملصق وإلغاء أمره (-cmdstic)
      } else if (command === 'حذف_ملصق' || command === '-cmdstic') {
         if (!m.quoted || !/webp/.test(m.quoted.mimetype)) return client.reply(m.chat, Utils.texted('bold', `🚩 يرجى الرد على الملصق المراد إزالته من قائمة أوامر الملصقات.`), m)
         
         let hash = m.quoted.fileSha256.toString().replace(/,/g, '')
         if (typeof global.db.sticker[hash] == 'undefined') return client.reply(m.chat, Utils.texted('bold', `🚩 هذا الملصق غير مسجل أو مرتبط بأي أمر في قاعدة البيانات حالياً.`), m)
         
         // حذف السجل التشفيري للملصق من قاعدة البيانات
         delete global.db.sticker[hash]
         client.reply(m.chat, Utils.texted('bold', `🚩 تم حذف أمر الملصق وإلغاء ربطه بنجاح.\n\n© DEV ABOODI OFFICIAL`), m)
      }
   },
   owner: true // الأداة محمية ومخصصة لمالك البوت فقط لحماية اختصارات النظام
}
