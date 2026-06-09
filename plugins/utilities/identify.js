export const run = {
   usage: ['تعرف_على_الصورة'], // الاسم العربي الرئيسي الذي سيظهر في القائمة
   hidden: ['identify', 'recog', 'تحليل_الصورة', 'فحص_الصورة'], // الاختصارات المخفية لضمان عمل البوت كبدائل دائماً
   use: 'الرد على صورة مستهدفة',
   category: 'أدوات مـساعدة', // الفئة المعربة لتنظيم قائمة الأوامر العامة
   async: async (m, {
      client,
      text,
      isPrefix,
      command,
      Utils,
      Scraper
   }) => {
      try {
         // 1. التعامل مع الصور المرسلة كعرض لمرة واحدة (View Once) أو الصور المقتبسة في رسائل معينة
         if (m.quoted ? m.quoted.message : m.msg.viewOnce) {
            let type = m.quoted ? Object.keys(m.quoted.message)[0] : m.mtype
            let q = m.quoted ? m.quoted.message[type] : m.msg
            
            if (/image/.test(type)) {
               client.sendReact(m.chat, '🕒', m.key)
               let img = await client.downloadMediaMessage(q)
               let image = await Scraper.uploadImageV2(img)
               
               // استدعاء محرك الذكاء الاصطناعي مع تحويل اللغة إلى العربية (ar)
               const json = await Api.neoxr('/gemini-vision', {
                  image: image.data.url,
                  lang: 'ar'
               })
               if (!json.status) return m.reply(Utils.jsonFormat(json))
               
               let caption = `${json.data.description}\n\n© DEV ABOODI OFFICIAL`
               client.sendFile(m.chat, json.data.image, '', caption, m)
            } else {
               client.reply(m.chat, Utils.texted('bold', `🚩 هذا الأمر مخصص لتحليل الصور فقط.`), m)
            }
            
         // 2. التعامل مع الصور العادية التي يتم الرد عليها مباشرة في الدردشة
         } else {
            let q = m.quoted ? m.quoted : m
            let mime = (q.msg || q).mimetype || ''
            
            if (!mime) return client.reply(m.chat, Utils.texted('bold', `🚩 يرجى الرد على الصورة التي تريد من البوت تحليلها والتعرف عليها.`), m)
            if (!/image\/(jpe?g|png)/.test(mime)) return client.reply(m.chat, Utils.texted('bold', `🚩 عذراً، الصيغة غير مدعومة. يرجى الرد على صور من نوع (PNG أو JPEG) فقط.`), m)
            
            client.sendReact(m.chat, '🕒', m.key)
            let img = await q.download()
            let image = await Scraper.uploadImageV2(img)
            
            // استدعاء محرك الذكاء الاصطناعي مع تحويل اللغة إلى العربية (ar)
            const json = await Api.neoxr('/gemini-vision', {
               image: image.data.url,
               lang: 'ar'
            })
            if (!json.status) return m.reply(Utils.jsonFormat(json))
            
            let caption = `${json.data.description}\n\n© DEV ABOODI OFFICIAL`
            client.sendFile(m.chat, json.data.image, '', caption, m)
         }
      } catch (e) {
         return client.reply(m.chat, Utils.jsonFormat(e), m)
      }
   },
   error: false,
   limit: true // تفعيل استهلاك النقاط لضمان الاستخدام العادل للسيرفر
}
