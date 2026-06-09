export const run = {
   usage: ['تحميل_فيس'], // تم تعريب الأمر ليظهر في قائمة البوت باسم (تحميل_فيس)
   hidden: ['fbdl', 'fbvid', 'fb'],
   use: 'الرابط',
   category: 'التحميلات', // تم تعريب الفئة لتنظيم القائمة باللغة العربية
   async: async (m, {
      client,
      args,
      isPrefix,
      command,
      users,
      Config,
      Utils
   }) => {
      try {
         // التحقق من وجود رابط في المدخلات
         if (!args || !args[0]) return client.reply(m.chat, Utils.example(isPrefix, command, 'https://fb.watch/7B5KBCgdO3'), m)
         
         // التحقق من صحة رابط الفيسبوك باستخدام التعبير النمطي (Regex)
         if (!args[0].match(/(?:https?:\/\/(web\.|www\.|m\.)?(facebook|fb)\.(com|watch)\S+)?$/)) return client.reply(m.chat, global.status.invalid, m)
         
         // إرسال تفاعل (إيموجي الانتظار)
         client.sendReact(m.chat, '🕒', m.key)
         
         // استدعاء واجهة برمجة التطبيقات لجلب روابط التحميل
         const json = await Api.neoxr('/fb', {
            url: args[0]
         })
         
         if (!json.status) return client.reply(m.chat, Utils.jsonFormat(json), m)
         
         // المحاولة الأولى: البحث عن جودة عالية HD
         let result = json.data.find(v => v.quality == 'HD' && v.response == 200)
         if (result) {
            const size = await Utils.getSizeFromUrl(result.url)
            const chSize = Utils.sizeLimit(size, users.premium ? Config.max_upload : Config.max_upload_free)
            
            // صياغة رسائل تجاوز الحجم الأقصى للملفات بالعربية
            const isOver = users.premium ? 
               `💀 حجم الملف (${size}) يتجاوز الحد الأقصى المسموح به للبوت، يمكنك تحميله بنفسك مباشرة عبر هذا الرابط المختصر: ${await (await Scraper.shorten(result.url)).data.url}` : 
               `⚠️ حجم الملف (${size}). الحد الأقصى المسموح به للمستخدمين العاديين هو ${Config.max_upload_free} ميجابايت، وللمشتركين المميزين هو ${Config.max_upload} ميجابايت.`;
            
            if (chSize.oversize) return client.reply(m.chat, isOver, m)
            
            // إرسال الفيديو بجودة عالية
            client.sendFile(m.chat, result.url, Utils.filename('mp4'), `◦ *الجودة* : HD\n\n© DEV ABOODI OFFICIAL`, m)
         } else {
            // المحاولة الثانية: البحث عن الجودة العادية SD في حال عدم توفر الـ HD
            let result = json.data.find(v => v.quality == 'SD' && v.response == 200)
            if (!result) return client.reply(m.chat, global.status.fail, m)
            
            const size = await Utils.getSizeFromUrl(result.url)
            const chSize = Utils.sizeLimit(size, users.premium ? Config.max_upload : Config.max_upload_free)
            
            const isOver = users.premium ? 
               `💀 حجم الملف (${size}) يتجاوز الحد الأقصى المسموح به للبوت، يمكنك تحميله بنفسك مباشرة عبر هذا الرابط المختصر: ${await (await Scraper.shorten(result.url)).data.url}` : 
               `⚠️ حجم الملف (${size}). الحد الأقصى المسموح به للمستخدمين العاديين هو ${Config.max_upload_free} ميجابايت، وللمشتركين المميزين هو ${Config.max_upload} ميجابايت.`;
            
            if (chSize.oversize) return client.reply(m.chat, isOver, m)
            
            // إرسال الفيديو بالجودة العادية
            client.sendFile(m.chat, result.url, Utils.filename('mp4'), `◦ *الجودة* : SD\n\n© DEV ABOODI OFFICIAL`, m)
         }
      } catch (e) {
         console.log(e)
         return client.reply(m.chat, Utils.jsonFormat(e), m)
      }
   },
   error: false,
   limit: true // الميزة تستهلك حداً من نقاط المستخدم
}
