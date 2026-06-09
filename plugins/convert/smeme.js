export const run = {
   usage: ['ملصق_ميمز'], // تم تعريب الأمر ليظهر في قائمة البوت باسم (ملصق_ميمز)
   use: 'نص علوي | نص سفلي',
   category: 'المحولات', // تم تعريب الفئة لتنظيم القائمة باللغة العربية
   async: async (m, {
      client,
      text,
      isPrefix,
      command,
      Utils,
      Scraper
   }) => {
      try {
         let exif = global.db.setting
         if (!text) return client.reply(m.chat, Utils.example(isPrefix, command, 'نص علوي | نص سفلي'), m)
         
         // إرسال تفاعل (إيموجي الانتظار)
         client.sendReact(m.chat, '🕒', m.key)
         
         // فصل النص العلوي عن السفلي باستخدام علامة |
         let [top, bottom] = text.split`|`
         
         if (m.quoted ? m.quoted.message : m.msg.viewOnce) {
            let type = m.quoted ? Object.keys(m.quoted.message)[0] : m.mtype
            let q = m.quoted ? m.quoted.message[type] : m.msg
            if (/image/.test(type)) {
               let img = await client.downloadMediaMessage(q)
               let json = await Scraper.uploadImageV2(img)
               let res = `https://api.memegen.link/images/custom/${encodeURIComponent(top ? top : ' ')}/${encodeURIComponent(bottom ? bottom : '')}.png?background=${json.data.url}`
               
               // إرسال الملصق مع الحقوق الخاصة بك
               client.sendSticker(m.chat, res, m, {
                  packname: exif.sk_pack,
                  author: exif.sk_author
               })
            } else client.reply(m.chat, Utils.texted('bold', `🚩 هذه الميزة صالحة للصور فقط.`), m)
         } else {
            let q = m.quoted ? m.quoted : m
            let mime = (q.msg || q).mimetype || ''
            if (!mime) return client.reply(m.chat, Utils.texted('bold', `🚩 يرجى الرد على صورة لتوليد الميمز.`), m)
            if (!/image\/(jpe?g|png)/.test(mime)) return client.reply(m.chat, Utils.texted('bold', `🚩 هذه الميزة صالحة للصور فقط.`), m)
            
            let img = await q.download()
            let json = await Scraper.uploadImageV2(img)
            let res = `https://api.memegen.link/images/custom/${encodeURIComponent(top ? top : ' ')}/${encodeURIComponent(bottom ? bottom : '')}.png?background=${json.data.url}`
            
            // إرسال الملصق مع الحقوق الخاصة بك
            client.sendSticker(m.chat, res, m, {
               packname: exif.sk_pack,
               author: exif.sk_author
            })
         }
      } catch (e) {
         return client.reply(m.chat, Utils.jsonFormat(e), m)
      }
   },
   error: false,
   limit: true // الميزة تستهلك حداً (Limit) من نقاط المستخدم
}
