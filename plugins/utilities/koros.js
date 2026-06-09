export const run = {
   usage: ['تعديل_صورة'], // الاسم العربي الرئيسي الذي سيظهر في القائمة (تعديل_صورة)
   hidden: ['koros', 'معالجة_صورة', 'تأثير_صورة'], // الاختصارات المخفية لضمان عمل البوت كبدائل دائماً
   use: 'النص والأمر المستهدف + الرد على صورة',
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
         // 1. التعامل مع الصور المرسلة كعرض لمرة واحدة (View Once) أو المقتبسة
         if (m.quoted ? m.quoted.message : m.msg.viewOnce) {
            let type = m.quoted ? Object.keys(m.quoted.message)[0] : m.mtype
            let q = m.quoted ? m.quoted.message[type] : m.msg
            let img = await client.downloadMediaMessage(q)
            
            if (!/image/.test(type)) return client.reply(m.chat, Utils.texted('bold', `🚩 هذا الأمر يتطلب الرد على صورة أولاً.`), m)
            client.sendReact(m.chat, '🕒', m.key)
            
            const srv = await Scraper.uploadImageV2(img)
            if (!srv.status) return m.reply(Utils.jsonFormat(srv))
            
            const json = await Api.neoxr('/koros', {
               image: srv.data.url,
               q: text ? text : (m.quoted && m.quoted.text) ? m.quoted.text : 'وصف هذه الصورة'
            })
            if (!json.status) return m.reply(Utils.jsonFormat(json))
            
            let caption = `*الأمر النصي* : ${json.data.question}\n\n`
            caption += `—\n`
            caption += `${json.data.description}\n\n© DEV ABOODI OFFICIAL`
            client.sendFile(m.chat, json.data.image, '', caption, m)
            
         // 2. التعامل مع الصور العادية في شاشة الدردشة
         } else {
            let q = m.quoted ? m.quoted : m
            let mime = (q.msg || q).mimetype || ''
            
            if (!/image\/(jpe?g|png)/.test(mime)) return client.reply(m.chat, Utils.texted('bold', `🚩 يرجى الرد على صورة صالحة من نوع (PNG أو JPEG).`), m)
            let img = await q.download()
            if (!img) return client.reply(m.chat, global.status.wrong, m)
            
            client.sendReact(m.chat, '🕒', m.key)
            const srv = await Scraper.uploadImageV2(img)
            if (!srv.status) return m.reply(Utils.jsonFormat(srv))
            
            const json = await Api.neoxr('/koros', {
               image: srv.data.url,
               q: text ? text : (m.quoted && m.quoted.text) ? m.quoted.text : 'وصف هذه الصورة'
            })
            if (!json.status) return m.reply(Utils.jsonFormat(json))
            
            let caption = `*الأمر النصي* : ${json.data.question}\n\n`
            caption += `—\n`
            caption += `${json.data.description}\n\n© DEV ABOODI OFFICIAL`
            client.sendFile(m.chat, json.data.image, '', caption, m)
         }
      } catch (e) {
         console.log(e)
         return client.reply(m.chat, Utils.jsonFormat(e), m)
      }
   },
   error: false,
   limit: true // خصم نقاط الحد اليومي للحفاظ على موارد السيرفر
}
