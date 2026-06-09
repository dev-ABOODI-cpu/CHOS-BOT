export const run = {
   usage: ['توضيح_الصورة'], // الاسم العربي الرئيسي الذي سيظهر في القائمة (توضيح_الصورة)
   hidden: ['remini', 'تحسين_الجودة', 'رفع_الجودة'], // الاختصارات المخفية لضمان عمل البوت كبدائل دائماً
   use: 'الرد على صورة مستهدفة',
   category: 'أدوات مـساعدة', // الفئة المعربة لتنظيم قائمة الأوامر العامة
   async: async (m, {
      client,
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
            
            if (/image/.test(type)) {
               client.sendReact(m.chat, '🕒', m.key)
               let img = await client.downloadMediaMessage(q)
               let image = await Scraper.uploadImageV2(img)
               
               const json = await Api.neoxr('/remini', {
                  image: image.data.url
               })
               if (!json.status) return m.reply(Utils.jsonFormat(json))
               
               // إرسال الصورة المحسنة ذات الجودة العالية للمخدم
               client.sendFile(m.chat, json.data.url, 'enhanced.jpg', '✅ تم تحسين جودة الصورة بنجاح!\n\n© DEV ABOODI OFFICIAL', m)
            } else {
               client.reply(m.chat, Utils.texted('bold', `🚩 هذا الأمر مخصص لرفع جودة وتحسين الصور فقط.`), m)
            }
            
         // 2. التعامل مع الصور العادية المرفقة مباشرة في شاشة الدردشة
         } else {
            let q = m.quoted ? m.quoted : m
            let mime = (q.msg || q).mimetype || ''
            
            if (!mime) return client.reply(m.chat, Utils.texted('bold', `🚩 يرجى الرد على الصورة التي تريد تحسين جودتها.`), m)
            if (!/image\/(jpe?g|png)/.test(mime)) return client.reply(m.chat, Utils.texted('bold', `🚩 عذراً، الصيغة غير مدعومة. يرجى الرد على صورة صالحة من نوع (PNG أو JPEG).`), m)
            
            client.sendReact(m.chat, '🕒', m.key)
            let img = await q.download()
            let image = await Scraper.uploadImageV2(img)
            
            const json = await Api.neoxr('/remini', {
               image: image.data.url
            })
            if (!json.status) return m.reply(Utils.jsonFormat(json))
            
            // إرسال الصورة المحسنة ذات الجودة العالية للمخدم
            client.sendFile(m.chat, json.data.url, 'enhanced.jpg', '✅ تم تحسين جودة الصورة بنجاح!\n\n© DEV ABOODI OFFICIAL', m)
         }
      } catch (e) {
         return client.reply(m.chat, Utils.jsonFormat(e), m)
      }
   },
   error: false,
   limit: true, // تفعيل خصم نقاط الحد اليومي لحماية موارد النظام
   premium: true // الميزة مقفلة وحصرية للمشتركين في النظام المميز للبوت
}
