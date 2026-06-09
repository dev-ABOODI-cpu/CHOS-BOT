export const run = {
   usage: ['تحميل_درايف'], // الاسم العربي الرئيسي الذي سيظهر في القائمة
   hidden: ['gdrive', 'gd'], // الاختصارات المخفية لضمان عمل البوت إذا كُتبت بالإنجليزية دون تشويه القائمة
   use: 'الرابط',
   category: 'التحميلات', // الفئة المعربة لتنظيم قائمة الأوامر
   async: async (m, {
      client,
      args,
      isPrefix,
      command,
      users,
      Config,
      Utils,
      Scraper
   }) => {
      try {
         // التحقق من وجود الرابط في المدخلات
         if (!args || !args[0]) return client.reply(m.chat, Utils.example(isPrefix, command, 'https://drive.google.com/file/d/...'), m)
         
         // إرسال تفاعل (إيموجي الانتظار)
         client.sendReact(m.chat, '🕒', m.key)
         
         // استدعاء واجهة برمجة التطبيقات لجلب رابط التحميل المباشر
         const json = await Api.neoxr('/gdrive', {
            url: args[0]
         })
         
         if (!json.status) return client.reply(m.chat, Utils.jsonFormat(json), m)
         
         // التحقق من حجم الملف والقيود المسموحة
         const size = await Utils.getSizeFromUrl(json.data.url)
         const chSize = Utils.sizeLimit(size, users.premium ? Config.max_upload : Config.max_upload_free)
         
         // صياغة رسائل تجاوز الحد الأقصى للملفات بالعربية
         const isOver = users.premium ? 
            `💀 حجم الملف (${size}) يتجاوز الحد الأقصى المسموح به للبوت، يمكنك تحميله بنفسك مباشرة عبر هذا الرابط المختصر: ${await (await Scraper.shorten(json.data.url)).data.url}` : 
            `⚠️ حجم الملف (${size}). الحد الأقصى المسموح به للمستخدمين العاديين هو ${Config.max_upload_free} ميجابايت، وللمشتركين المميزين هو ${Config.max_upload} ميجابايت.`;
         
         if (chSize.oversize) return client.reply(m.chat, isOver, m)
         
         // إرسال الملف المستخرج للمستخدم مع الحقوق
         client.sendFile(m.chat, json.data.url, '', '', m)
      } catch (e) {
         console.log(e)
         return client.reply(m.chat, Utils.jsonFormat(e), m)
      }
   },
   error: false,
   limit: true // الميزة تستهلك حداً من نقاط المستخدم
}
