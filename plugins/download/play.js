export const run = {
   usage: ['شغل'], // الاسم العربي الرئيسي الذي سيظهر في القائمة (شغل)
   hidden: ['play'], // الاختصارات المخفية لضمان عمل البوت إذا كُتبت بالإنجليزية
   use: 'اسم المقطع أو الرابط',
   category: 'التحميلات', // الفئة المعربة لتنظيم قائمة الأوامر
   async: async (m, {
      client,
      text,
      isPrefix,
      command,
      users,
      Config,
      Utils
   }) => {
      try {
         // التحقق من إدخال نص للبحث بعد الأمر
         if (!text) return client.reply(m.chat, Utils.example(isPrefix, command, 'قرآن كريم أو اسم الأغنية'), m)
         
         // إرسال تفاعل (إيموجي الانتظار)
         client.sendReact(m.chat, '🕒', m.key)
         
         // استدعاء واجهة برمجة التطبيقات للبحث وجلب بيانات المقطع
         var json = await Api.neoxr('/play', {
            q: text
         })
         
         if (!json.status) return client.reply(m.chat, Utils.jsonFormat(json), m)
         
         // صياغة نص تفاصيل المقطع الصوتي باللغة العربية
         let caption = `乂  *تـشـغـيـل مـن الـيـوتـيـوب*\n\n`
         caption += `	◦  *العنوان* : ${json.title}\n`
         caption += `	◦  *الحجم* : ${json.data.size}\n`
         caption += `	◦  *المدة* : ${json.duration}\n`
         caption += `	◦  *الجودة (Bitrate)* : ${json.data.quality}\n\n`
         caption += `© DEV ABOODI OFFICIAL`
         
         // التحقق من حجم الملف والقيود المسموحة للبوت
         const chSize = Utils.sizeLimit(json.data.size, users.premium ? Config.max_upload : Config.max_upload_free)
         
         // صياغة رسائل تجاوز الحد الأقصى للملفات بالعربية
         const isOver = users.premium ? 
            `💀 حجم الملف (${json.data.size}) يتجاوز الحد الأقصى المسموح به للبوت.` : 
            `⚠️ حجم الملف (${json.data.size}). الحد الأقصى المسموح به للمخدم العادي هو ${Config.max_upload_free} ميجابايت، وللمشتركين المميزين هو ${Config.max_upload} ميجابايت.`;
            
         if (chSize.oversize) return client.reply(m.chat, isOver, m)
         
         // إرسال بطاقة المعاينة أولاً، ثم رفع وإرسال الملف الصوتي مع صورة الغلاف المدمجة
         client.sendMessageModify(m.chat, caption, m, {
            largeThumb: true,
            type: 'preview-link',
            ratio: 'landscape',
            thumbnail: json.thumbnail
         }).then(async () => {
            client.sendFile(m.chat, json.data.url, json.data.filename, '', m, {
               document: true, // إرسالها كمستند للحفاظ على جودة الصوت بالكامل
               APIC: await Utils.fetchAsBuffer(json.thumbnail) // دمج الغلاف داخل الملف الصوتي
            }, {
               jpegThumbnail: await Utils.generateImageThumbnail(json.thumbnail)
            })
         })
      } catch (e) {
         client.reply(m.chat, Utils.jsonFormat(e), m)
      }
   },
   error: false,
   restrict: true,
   limit: true // الميزة تستهلك حداً من نقاط المستخدم
}
