export const run = {
   async: async (m, {
      client,
      body,
      isOwner,
      groupSet,
      setting,
      Utils
   }) => {
      try {
         // التحقق مما إذا كانت ميزة الملصق التلقائي مفعلة في المجموعة، والرسالة المرسلة هي فيديو أو صورة
         if (groupSet.autosticker && /video|image/.test(m.mtype)) {
            let mime = m.msg.mimetype
            
            // [أولاً] معالجة الصور الثابتة وتحويلها إلى ملصق
            if (/image\/(jpe?g|png)/.test(mime)) {
               let img = await m.download()
               if (!img) return
               client.sendSticker(m.chat, img, m, {
                  packname: setting.sk_pack,
                  author: setting.sk_author
               })
               
            // [ثانياً] معالجة مقاطع الفيديو القصيرة وتحويلها إلى ملصق متحرك
            } else if (/video/.test(mime)) {
               // إذا تجاوزت مدة الفيديو 10 ثوانٍ يتم إلغاء العملية منعاً لاستهلاك موارد السيرفر
               if (m.msg.seconds > 10) return
               let img = await m.download()
               if (!img) return
               client.sendSticker(m.chat, img, m, {
                  packname: setting.sk_pack,
                  author: setting.sk_author
               })
            }
         }
      } catch (e) {
         // طباعة الخطأ في وحدة التحكم وإرسال تقرير برميجي في حال حدوث مشكلة
         console.log(e)
         return client.reply(m.chat, Utils.jsonFormat(e), m)
      }
   },
   error: false,
   group: true // الميزة مخصصة للعمل داخل المجموعات فقط
}
