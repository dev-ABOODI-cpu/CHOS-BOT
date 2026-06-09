export const run = {
   usage: ['تيكتوك', 'صوت_تيك', 'تيك_حقوق'], // تعريب الأوامر الرئيسية (تيكتوك للفيديو/الصور، صوت_تيك للصوت، تيك_حقوق للفيديو بالعلامة المائية)
   hidden: ['tiktok', 'tikmp3', 'tikwm', 'tt'], // الاختصارات المخفية لضمان عمل البوت إذا كُتبت بالإنجليزية
   use: 'الرابط',
   category: 'التحميلات', // الفئة المعربة لتنظيم قائمة الأوامر
   async: async (m, {
      client,
      args,
      isPrefix,
      command,
      Utils
   }) => {
      try {
         // التحقق من وجود رابط في المدخلات
         if (!args || !args[0]) return client.reply(m.chat, Utils.example(isPrefix, command, 'https://vm.tiktok.com/...'), m)
         
         // التحقق من صحة رابط تيك توك
         if (!args[0].match('tiktok.com')) return client.reply(m.chat, global.status.invalid, m)
         
         // إرسال تفاعل (إيموجي الانتظار)
         client.sendReact(m.chat, '🕒', m.key)
         let old = new Date()
         
         // استدعاء واجهة برمجة التطبيقات لجلب الملفات من الرابط بعد إصلاحه تلقائياً
         const json = await Api.neoxr('/tiktok', {
            url: Utils.ttFixed(args[0])
         })
         
         if (!json.status) return m.reply(Utils.jsonFormat(json))
         
         // الحالة الأولى: تحميل الفيديو بدون علامة مائية أو الألبوم الصوري
         if (/تيكتوك|tiktok|tt/.test(command)) {
            // إذا كان الرابط يؤدي إلى مقطع فيديو
            if (json.data.video) return client.sendFile(m.chat, json.data.video, 'video.mp4', `🍟 *مدة الجلب* : ${((new Date - old) * 1)} م.ث\n\n© DEV ABOODI OFFICIAL`, m)
            
            // إذا كان الرابط يؤدي إلى ألبوم صور (Slideshow)
            if (json.data.photo) {
               for (let p of json.data.photo) {
                  client.sendFile(m.chat, p, 'image.jpg', `🍟 *مدة الجلب* : ${((new Date - old) * 1)} م.ث\n\n© DEV ABOODI OFFICIAL`, m)
                  await Utils.delay(1500) // تأخير زمني لتفادي الحظر
               }
            }
         }
         
         // الحالة الثانية: تحميل الفيديو بالعلامة المائية الأصلية (Watermark)
         if (/تيك_حقوق|tikwm/.test(command)) return client.sendFile(m.chat, json.data.videoWM, 'video.mp4', `🍟 *مدة الجلب* : ${((new Date - old) * 1)} م.ث\n\n© DEV ABOODI OFFICIAL`, m)
         
         // الحالة الثالثة: استخراج الصوت فقط وتحميله كملف MP3
         if (/صوت_تيك|tikmp3/.test(command)) return !json.data.audio ? client.reply(m.chat, global.status.fail, m) : client.sendFile(m.chat, json.data.audio, 'audio.mp3', '', m)
         
      } catch (e) {
         return client.reply(m.chat, Utils.jsonFormat(e), m)
      }
   },
   error: false,
   limit: true // الميزة تستهلك حداً من نقاط المستخدم
}
