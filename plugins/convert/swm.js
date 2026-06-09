export const run = {
   usage: ['حقوق_الملصق'], // تم تعريب الأمر ليظهر في قائمة البوت باسم (حقوق_الملصق)
   use: 'اسم الحزمة | اسم الحقوق',
   category: 'المحولات', // تم تعريب الفئة لتنظيم القائمة باللغة العربية
   async: async (m, {
      client,
      text,
      isPrefix,
      command,
      Utils
   }) => {
      try {
         // فصل اسم الحزمة عن اسم الحقوق باستخدام علامة |
         let [packname, ...author] = text.split`|`
         author = (author || []).join`|`
         
         if (m.quoted ? m.quoted.message : m.msg.viewOnce) {
            let type = m.quoted ? Object.keys(m.quoted.message)[0] : m.mtype
            let q = m.quoted ? m.quoted.message[type] : m.msg
            let img = await client.downloadMediaMessage(q)
            if (/video/.test(type)) {
               if (q.seconds > 10) return client.reply(m.chat, Utils.texted('bold', `🚩 الحد الأقصى لطول مقطع الفيديو هو 10 ثوانٍ فقط لتوليد ملصق متحرك.`), m)
               return await client.sendSticker(m.chat, img, m, {
                  packname: packname || '',
                  author: author || ''
               })
            } else if (/image/.test(type)) {
               return await client.sendSticker(m.chat, img, m, {
                  packname: packname || '',
                  author: author || ''
               })
            }
         } else {
            let q = m.quoted ? m.quoted : m
            let mime = (q.msg || q).mimetype || ''
            if (/image\/(jpe?g|png)/.test(mime)) {
               let img = await q.download()
               if (!img) return client.reply(m.chat, global.status.wrong, m)
               return await client.sendSticker(m.chat, img, m, {
                  packname: packname || '',
                  author: author || ''
               })
            } else if (/video/.test(mime)) {
               if ((q.msg || q).seconds > 10) return client.reply(m.chat, Utils.texted('bold', `🚩 الحد الأقصى لطول مقطع الفيديو هو 10 ثوانٍ فقط لتوليد ملصق متحرك.`), m)
               let img = await q.download()
               if (!img) return client.reply(m.chat, global.status.wrong, m)
               return await client.sendSticker(m.chat, img, m, {
                  packname: packname || '',
                  author: author || ''
               })
            } else client.reply(m.chat, `🚩 لإضافة حقوقك الخاصة على الملصق، يرجى الرد على صورة أو مقطع فيديو باستخدام التنسيق التالي:\n*${isPrefix + command} اسم الحزمة | اسم الحقوق*\n\n© DEV ABOODI OFFICIAL`, m)
         }
      } catch (e) {
         console.log(e)
         return client.reply(m.chat, Utils.jsonFormat(e), m)
      }
   },
   error: false,
   limit: true // الميزة تستهلك حداً من نقاط المستخدم
}
