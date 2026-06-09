export const run = {
   usage: ['قلب_افقي', 'قلب_عمودي'], // الأسماء العربية للأوامر (قلب_افقي يعادل flip / قلب_عمودي يعادل flop)
   hidden: ['flip', 'flop', 'عكس_الملصق'], // الاختصارات المخفية لضمان عمل البوت كبدائل دائماً
   use: 'الرد على الملصق المستهدف',
   category: 'أدوات مـساعدة', // الفئة المعربة لتنظيم قائمة الأوامر العامة
   async: async (m, {
      client,
      command,
      Utils,
      Scraper
   }) => {
      try {
         let exif = global.db.setting
         
         // التحقق مما إذا كان المستخدم قد قام بالرد على رسالة
         if (!m.quoted) return client.reply(m.chat, Utils.texted('bold', `🚩 يرجى الرد على الملصق الذي تريد تعديله باستخدام أمر (${command}).`), m)
         
         let q = m.quoted ? m.quoted : m
         let mime = (q.msg || q).mimetype || ''
         
         // التحقق من أن الوسائط المقتبسة هي ملصق بصيغة webp فعلياً
         if (!/webp/.test(mime)) return client.reply(m.chat, Utils.texted('bold', `🚩 عذراً، هذا الأمر مخصص للملصقات فقط. يرجى الرد على ملصق صالح.`), m)
         
         let buffer = await q.download()
         const file = await Scraper.uploadImageV2(buffer)
         if (!file.status) return m.reply(Utils.jsonFormat(file))
         
         // إرسال تفاعل تفاعلي يفيد ببدء معالجة الملصق
         client.sendReact(m.chat, '🕒', m.key)
         
         // تحديد المسار البرمجي بناءً على نوع الأمر المستخدم (تحويل الاسم العربي داخلياً للـ API)
         let apiPath = (command === 'قلب_افقي' || command === 'flip') ? '/flip' : '/flop'
         
         const json = await Api.neoxr(apiPath, {
            url: file.data.url
         })
         
         // جلب الملصق الجديد المعالج على هيئة بافر (Buffer)
         const result = await Utils.fetchAsBuffer(json.data.url)
         
         // إرسال الملصق النهائي المعكوس للمستخدم مع تذييله بحقوق المطور والمعلومات الخاصة بك
         client.sendSticker(m.chat, result, m, {
            packname: exif.sk_pack,
            author: '© DEV ABOODI OFFICIAL'
         })
      } catch (e) {
         return client.reply(m.chat, global.status.error, m)
      }
   },
   error: false,
   limit: true // تفعيل استهلاك نقاط الحد اليومي للحفاظ على استقرار السيرفر ومنع السبام
}
