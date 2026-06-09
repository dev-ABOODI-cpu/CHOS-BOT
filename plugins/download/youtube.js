export const run = {
   usage: ['صوت_يوتيوب', 'فيديو_يوتيوب'], // تعريب الأوامر الرئيسية في القائمة (صوت_يوتيوب للـ MP3 وفيديو_يوتيوب للـ MP4)
   hidden: ['ytmp3', 'ytmp4', 'yta', 'ytv'], // الاختصارات المخفية لضمان عمل البوت إذا كُتبت بالإنجليزية
   use: 'الرابط',
   category: 'التحميلات', // الفئة المعربة لتنظيم قائمة الأوامر
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
         // الحالة الأولى: تحميل المقطع الصوتي (Audio / MP3)
         if (/صوت_يوتيوب|yt?(a|mp3)/i.test(command)) {
            if (!args || !args[0]) return client.reply(m.chat, Utils.example(isPrefix, command, 'https://youtu.be/zaRFmdtLhQ8'), m)
            if (!/^(?:https?:\/\/)?(?:www\.|m\.|music\.)?youtu\.?be(?:\.com)?\/?.*(?:watch|embed)?(?:.*v=|v\/|\/)([\w\-_]+)\&?/.test(args[0])) return client.reply(m.chat, global.status.invalid, m)
            
            client.sendReact(m.chat, '🕒', m.key)
            var json = await Api.neoxr('/youtube', {
               url: args[0],
               type: 'audio',
               quality: '128kbps'
            })
            if (!json.status) return client.reply(m.chat, Utils.jsonFormat(json), m)
            
            // صياغة نص تفاصيل المقطع الصوتي باللغة العربية
            let caption = `乂  *تـشـغـيـل مـن الـيـوتـيـوب*\n\n`
            caption += `	◦  *العنوان* : ${json.title}\n`
            caption += `	◦  *الحجم* : ${json.data.size}\n`
            caption += `	◦  *المدة* : ${json.duration}\n`
            caption += `	◦  *الجودة (Bitrate)* : ${json.data.quality}\n\n`
            caption += `© DEV ABOODI OFFICIAL`
            
            // التحقق من حجم الملف والقيود المسموحة
            const chSize = Utils.sizeLimit(json.data.size, users.premium ? Config.max_upload : Config.max_upload_free)
            const isOver = users.premium ? 
               `💀 حجم الملف (${json.data.size}) يتجاوز الحد الأقصى المسموح به للبوت.` : 
               `⚠️ حجم الملف (${json.data.size}). الحد الأقصى المسموح به للمخدم العادي هو ${Config.max_upload_free} ميجابايت، وللمشتركين المميزين هو ${Config.max_upload} ميجابايت.`;
            if (chSize.oversize) return client.reply(m.chat, isOver, m)
            
            client.sendMessageModify(m.chat, caption, m, {
               largeThumb: true,
               type: 'preview-link',
               ratio: 'landscape',
               thumbnail: await Utils.fetchAsBuffer(json.thumbnail)
            }).then(async () => {
               client.sendFile(m.chat, json.data.url, json.data.filename, '', m, {
                  document: true,
                  APIC: await Utils.fetchAsBuffer(json.thumbnail) // دمج الغلاف داخل الملف الصوتي
               }, {
                  jpegThumbnail: await Utils.generateImageThumbnail(json.thumbnail)
               })
            })
            
         // الحالة الثانية: تحميل مقطع الفيديو (Video / MP4)
         } else if (/فيديو_يوتيوب|yt?(v|mp4)/i.test(command)) {
            if (!args || !args[0]) return client.reply(m.chat, Utils.example(isPrefix, command, 'https://youtu.be/zaRFmdtLhQ8'), m)
            if (!/^(?:https?:\/\/)?(?:www\.|m\.|music\.)?youtu\.?be(?:\.com)?\/?.*(?:watch|embed)?(?:.*v=|v\/|\/)([\w\-_]+)\&?/.test(args[0])) return client.reply(m.chat, global.status.invalid, m)
            
            client.sendReact(m.chat, '🕒', m.key)
            var json = await Api.neoxr('/youtube', {
               url: args[0],
               type: 'video',
               quality: '720p'
            })
            // محاولة جلب جودة 480p تلقائياً إذا فشلت الـ 720p
            if (!json.status) {
               var json = await Api.neoxr('/youtube', {
                  url: args[0],
                  type: 'video',
                  quality: '480p'
               })
            }
            if (!json.status) return client.reply(m.chat, Utils.jsonFormat(json), m)
            
            // صياغة نص تفاصيل مقطع الفيديو باللغة العربية
            let caption = `乂  *تـحـمـيـل مـن الـيـوتـيـوب*\n\n`
            caption += `	◦  *العنوان* : ${json.title}\n`
            caption += `	◦  *الحجم* : ${json.data.size}\n`
            caption += `	◦  *المدة* : ${json.duration}\n`
            caption += `	◦  *الجودة* : ${json.data.quality}\n\n`
            caption += `© DEV ABOODI OFFICIAL`
            
            // التحقق من حجم الفيديو والقيود المسموحة
            const chSize = Utils.sizeLimit(json.data.size, users.premium ? Config.max_upload : Config.max_upload_free)
            const isOver = users.premium ? 
               `💀 حجم الملف (${json.data.size}) يتجاوز الحد الأقصى المسموح به للبوت.` : 
               `⚠️ حجم الملف (${json.data.size}). الحد الأقصى المسموح به للمخدم العادي هو ${Config.max_upload_free} ميجابايت، وللمشتركين المميزين هو ${Config.max_upload} ميجابايت.`;
            if (chSize.oversize) return client.reply(m.chat, isOver, m)
            
            // إرسال الفيديو كمستند/ملف إذا تخطى حجمه 99 ميجابايت لتفادي مشاكل الرفع بالواتساب
            let isSize = (json.data.size).replace(/MB/g, '').trim()
            if (isSize > 99) return client.sendMessageModify(m.chat, caption, m, {
               largeThumb: true,
               type: 'preview-link',
               ratio: 'landscape',
               thumbnail: await Utils.fetchAsBuffer(json.thumbnail)
            }).then(async () => {
               await client.sendFile(m.chat, json.data.url, json.data.filename, caption, m, {
                  document: true
               }, {
                  jpegThumbnail: await Utils.generateImageThumbnail(json.thumbnail)
               })
            })
            
            // إرسال الفيديو بشكل طبيعي داخل المحادثة
            client.sendFile(m.chat, json.data.url, json.data.filename, caption, m)
         }
      } catch (e) {
         return client.reply(m.chat, Utils.jsonFormat(e), m)
      }
   },
   error: false,
   limit: true // الميزة تستهلك حداً من نقاط المستخدم
}
