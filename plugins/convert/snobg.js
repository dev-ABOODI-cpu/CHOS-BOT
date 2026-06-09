export const run = {
   usage: ['ملصق_شفاف'], // تم تعريب الأمر ليظهر في قائمة البوت باسم (ملصق_شفاف)
   use: 'الرد على صورة',
   category: 'المحولات', // تم تعريب الفئة لتنظيم القائمة باللغة العربية
   async: async (m, {
      client,
      isPrefix,
      command,
      Utils,
      Scraper
   }) => {
      try {
         let exif = global.db.setting
         
         if (m.quoted ? m.quoted.message : m.msg.viewOnce) {
            let type = m.quoted ? Object.keys(m.quoted.message)[0] : m.mtype
            let q = m.quoted ? m.quoted.message[type] : m.msg
            if (/image/.test(type)) {
               // إرسال تفاعل (إيموجي الانتظار)
               client.sendReact(m.chat, '🕒', m.key)
               
               let img = await client.downloadMediaMessage(q)
               let image = await Scraper.uploadImageV2(img)
               
               // استدعاء واجهة برمجة التطبيقات لإزالة الخلفية
               const json = await Api.neoxr('/nobg', {
                  image: image.data.url
               })
               if (!json.status) return m.reply(Utils.jsonFormat(json))
               
               // إرسال الملصق الشفاف مع تثبيت الحقوق الخاصة بك
               client.sendSticker(m.chat, json.data.no_background, m, {
                  packname: exif.sk_pack,
                  author: exif.sk_author
               })
            } else client.reply(m.chat, Utils.texted('bold', `🚩 هذه الميزة صالحة للصور فقط.`), m)
         } else {
            let q = m.quoted ? m.quoted : m
            let mime = (q.msg || q).mimetype || ''
            if (!mime) return client.reply(m.chat, Utils.texted('bold', `🚩 يرجى الرد على صورة لتحويلها لملصق بدون خلفية.`), m)
            if (!/image\/(jpe?g|png)/.test(mime)) return client.reply(m.chat, Utils.texted('bold', `🚩 هذه الميزة صالحة للصور فقط.`), m)
            
            // إرسال تفاعل (إيموجي الانتظار)
            client.sendReact(m.chat, '🕒', m.key)
            
            let img = await q.download()
            let image = await Scraper.uploadImageV2(img)
            
            // استدعاء واجهة برمجة التطبيقات لإزالة الخلفية
            const json = await Api.neoxr('/nobg', {
               image: image.data.url
            })
            if (!json.status) return m.reply(Utils.jsonFormat(json))
            
            // إرسال الملصق الشفاف مع تثبيت الحقوق الخاصة بك
            client.sendSticker(m.chat, json.data.no_background, m, {
               packname: exif.sk_pack,
               author: exif.sk_author
            })
         }
      } catch (e) {
         return client.reply(m.chat, Utils.jsonFormat(e), m)
      }
   },
   error: false,
   premium: true, // ميزة مخصصة للمشتركين المميزين (Premium)
   limit: true // الميزة تستهلك حداً من نقاط المستخدم
}
