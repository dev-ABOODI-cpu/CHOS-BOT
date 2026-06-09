export const run = {
   usage: ['فيديو'], // الاسم العربي الرئيسي الذي سيظهر في القائمة (فيديو)
   hidden: ['video', 'playvid', 'playvideo'], // الاختصارات المخفية لضمان عمل البوت إذا كُتبت بالإنجليزية
   use: 'اسم المقطع أو الرابط',
   category: 'التحميلات', // الفئة المعربة لتنظيم قائمة الأوامر
   async: async (m, {
      client,
      text,
      isPrefix,
      command,
      Config,
      users,
      Utils
   }) => {
      try {
         // التحقق من إدخال نص للبحث بعد الأمر
         if (!text) return client.reply(m.chat, Utils.example(isPrefix, command, 'قرآن كريم أو اسم المقطع'), m)
         
         // إرسال تفاعل (إيموجي الانتظار)
         client.sendReact(m.chat, '🕒', m.key)
         
         // استدعاء واجهة برمجة التطبيقات للبحث وجلب بيانات مقطع الفيديو
         var json = await Api.neoxr('/video', {
            q: text
         })
         
         if (!json.status) return client.reply(m.chat, Utils.jsonFormat(json), m)
         
         // صياغة نص تفاصيل مقطع الفيديو باللغة العربية
         let caption = `乂  *تـحـمـيـل مـن الـيـوتـيـوب*\n\n`
         caption += `	◦  *العنوان* : ${json.title}\n`
         caption += `	◦  *الحجم* : ${json.data.size}\n`
         caption += `	◦  *المدة* : ${json.duration}\n`
         caption += `	◦  *الجودة* : ${json.data.quality}\n\n`
         caption += `© DEV ABOODI OFFICIAL`
         
         // التحقق من حجم الملف والقيود المسموحة للبوت
         const chSize = Utils.sizeLimit(json.data.size, users.premium ? Config.max_upload : Config.max_upload_free)
         
         // صياغة رسائل تجاوز الحد الأقصى للملفات بالعربية
         const isOver = users.premium ? 
            `💀 حجم الملف (${json.data.size}) يتجاوز الحد الأقصى المسموح به للبوت.` : 
            `⚠️ حجم الملف (${json.data.size}). الحد الأقصى المسموح به للمخدم العادي هو ${Config.max_upload_free} ميجابايت، وللمشتركين المميزين هو ${Config.max_upload} ميجابايت.`;
            
         if (chSize.oversize) return client.reply(m.chat, isOver, m)
         
         // التحقق من حجم الفيديو وإرساله كمستند في حال تخطي الـ 99 ميجابايت
         let isSize = (json.data.size).replace(/MB/g, '').trim()
         if (isSize > 99) return client.sendFile(m.chat, json.data.url, json.data.filename, caption, m, {
            document: true
         }, {
            jpegThumbnail: await Utils.generateImageThumbnail(json.thumbnail)
         })
         
         // إرسال الفيديو بشكل طبيعي كفيديو مباشر في الواتساب
         client.sendFile(m.chat, json.data.url, json.data.filename, caption, m)
      } catch (e) {
         client.reply(m.chat, Utils.jsonFormat(e), m)
      }
   },
   error: false,
   restrict: true,
   limit: true // الميزة تستهلك حداً من نقاط المستخدم
}
