export const run = {
   usage: ['ملصق_اشكال'], // تم تعريب الأمر ليظهر في قائمة البوت باسم (ملصق_اشكال)
   use: 'الشكل',
   category: 'المحولات', // تم تعريب الفئة لتنظيم القائمة باللغة العربية
   async: async (m, {
      client,
      args,
      isPrefix,
      command,
      Utils,
      Scraper
   }) => {
      try {
         // قائمة الأشكال المدعومة من الـ API باللغة الإنجليزية للمعالجة البرمجية
         let style = ["triangle", "circle", "pentagon", "star", "hexagon", "octagon", "spider", "broken", "love"]
         
         // قاموس لترجمة واستعراض الأشكال بالعربية للمستخدم
         const styleTranslate = {
            "triangle": "مثلث",
            "circle": "دائرة",
            "pentagon": "مخمس",
            "star": "نجمة",
            "hexagon": "مسدس",
            "octagon": "مثمن",
            "spider": "عنكبوت",
            "broken": "مكسور",
            "love": "قلب"
         }

         // بناء رسالة المساعدة واستعراض الأشكال المتاحة بشكل منسق بالعربية
         let print = `💡 *طريقة الاستخدام*:\nاستخدم الأمر مع تحديد أحد الأشكال المتاحة أدناه بالإنجليزية:\n\n`
         print += style.sort((a, b) => a.localeCompare(b)).map((v, i) => {
            if (i == 0) {
               return `┌  ◦  ${isPrefix + command} ${v} (${styleTranslate[v]})`
            } else if (i == style.length - 1) {
               return `└  ◦  ${isPrefix + command} ${v} (${styleTranslate[v]})`
            } else {
               return `│  ◦  ${isPrefix + command} ${v} (${styleTranslate[v]})`
            }
         }).join('\n')
         print += `\n\n© DEV ABOODI OFFICIAL`

         // التحقق من إدخال الشكل المطلوب بشكل صحيح
         if (!args || !args[0]) return client.sendFile(m.chat, 'https://iili.io/HtfsWdv.jpg', '', print, m)
         if (!style.includes(args[0].toLowerCase())) return client.sendFile(m.chat, 'https://iili.io/HtfsWdv.jpg', '', print, m)
         
         let exif = global.db.setting
         
         // إرسال تفاعل (إيموجي الانتظار)
         client.sendReact(m.chat, '🕒', m.key)
         
         if (m.quoted ? m.quoted.message : m.msg.viewOnce) {
            let type = m.quoted ? Object.keys(m.quoted.message)[0] : m.mtype
            let q = m.quoted ? m.quoted.message[type] : m.msg
            if (/image/.test(type)) {
               let img = await client.downloadMediaMessage(q)
               let json = await Scraper.uploadImage(img)
               let res = await Api.neoxr('/cropshape', {
                  image: json.data.url,
                  style: args[0].toLowerCase()
               })
               if (!res.status) return m.reply(Utils.jsonFormat(res))
               
               // إرسال الملصق المقصوص بالحقوق الخاصة بك
               client.sendSticker(m.chat, res.data.url, m, {
                  packname: exif.sk_pack,
                  author: exif.sk_author
               })
            } else client.reply(m.chat, Utils.texted('bold', `🚩 هذه الميزة صالحة للصور فقط.`), m)
         } else {
            let q = m.quoted ? m.quoted : m
            let mime = (q.msg || q).mimetype || ''
            if (!mime) return client.reply(m.chat, Utils.texted('bold', `🚩 يرجى الرد على صورة لتطبيق تأثير القص عليها.`), m)
            if (!/image\/(jpe?g|png)/.test(mime)) return client.reply(m.chat, Utils.texted('bold', `🚩 هذه الميزة صالحة للصور فقط.`), m)
            
            let img = await q.download()
            let json = await Scraper.uploadImage(img)
            let res = await Api.neoxr('/cropshape', {
               image: json.data.url,
               style: args[0].toLowerCase()
            })
            if (!res.status) return m.reply(Utils.jsonFormat(res))
            
            // إرسال الملصق المقصوص بالحقوق الخاصة بك
            client.sendSticker(m.chat, res.data.url, m, {
               packname: exif.sk_pack,
               author: exif.sk_author
            })
         }
      } catch (e) {
         return client.reply(m.chat, Utils.jsonFormat(e), m)
      }
   },
   error: false,
   limit: true // الميزة تستهلك حداً من نقاط المستخدم
}
