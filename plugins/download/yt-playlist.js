export const run = {
   usage: ['قائمة_يوتيوب', 'جلب_صوت', 'جلب_فيديو'], // تعريب الأوامر في القائمة (قائمة_يوتيوب لعرض القائمة، جلب_صوت للملف الصوتي، جلب_فيديو للـ MP4)
   hidden: ['ytlist', 'ytplaylist', 'playlist', 'getmp3', 'getmp4'], // الاختصارات المخفية لضمان عمل البوت إذا كُتبت بالإنجليزية
   use: 'الرابط أو الرقم',
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
         client.ytplaylist = client.ytplaylist ? client.ytplaylist : []
         
         // التحقق من المدخلات عند طلب عرض قائمة تشغيل جديدة
         if (!args[0] && ['قائمة_يوتيوب', 'ytlist', 'ytplaylist', 'playlist'].includes(command)) {
            return client.reply(m.chat, Utils.example(isPrefix, command, 'https://www.youtube.com/playlist?list=...'), m)
         }
         
         const check = client.ytplaylist.find(v => v.jid == m.sender)
         
         // 1. التحقق في حال انتهاء صلاحية الجلسة أو عدم اختيار رقم صحيح
         if (/جلب_(فيديو|صوت)|get?(mp4|mp3)/.test(command) && !check && !isNaN(args[0])) {
            return m.reply(Utils.texted('bold', `🚩 انتهت صلاحية جلستك أو أنها غير موجودة بالأساس، يرجى القيام ببحث جديد عن القائمة أولاً.`))
         }
         
         // 2. معالجة طلب جلب مقطع محدد من القائمة المخزنة مؤقتاً
         if (/جلب_(فيديو|صوت)|get?(mp4|mp3)/.test(command) && check && !isNaN(args[0])) {
            if (Number(args[0]) > check.results.length) return m.reply(Utils.texted('bold', `🚩 الرقم المدخل يتجاوز عدد المقاطع المتوفرة في القائمة.`))
            
            client.sendReact(m.chat, '🕒', m.key)
            
            // حالة طلب الملف الصوتي (Audio / MP3)
            if (command === 'جلب_صوت' || command === 'getmp3') {
               var json = await Api.neoxr('/youtube', {
                  url: check.results[Number(args[0]) - 1],
                  type: 'audio',
                  quality: '128kbps'
               })
               if (!json.status) return client.reply(m.chat, Utils.jsonFormat(json), m)
               
               let caption = `乂  *تـشـغـيـل مـن الـيـوتـيـوب*\n\n`
               caption += `	◦  *العنوان* : ${json.title}\n`
               caption += `	◦  *الحجم* : ${json.data.size}\n`
               caption += `	◦  *المدة* : ${json.duration}\n`
               caption += `	◦  *الجودة (Bitrate)* : ${json.data.quality}\n\n`
               caption += `© DEV ABOODI OFFICIAL`
               
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
                     APIC: await Utils.fetchAsBuffer(json.thumbnail)
                  }, {
                     jpegThumbnail: await Utils.generateImageThumbnail(json.thumbnail)
                  })
               })
               
            // حالة طلب مقطع الفيديو (Video / MP4)
            } else if (command === 'جلب_فيديو' || command === 'getmp4') {
               var json = await Api.neoxr('/youtube', {
                  url: check.results[Number(args[0]) - 1],
                  type: 'video',
                  quality: '720p'
               })
               if (!json.status) {
                  var json = await Api.neoxr('/youtube', {
                     url: check.results[Number(args[0]) - 1],
                     type: 'video',
                     quality: '480p'
                  })
               }
               if (!json.status) return client.reply(m.chat, Utils.jsonFormat(json), m)
               
               let caption = `乂  *تـحـمـيـل مـن الـيـوتـيـوب*\n\n`
               caption += `	◦  *العنوان* : ${json.title}\n`
               caption += `	◦  *الحجم* : ${json.data.size}\n`
               caption += `	◦  *المدة* : ${json.duration}\n`
               caption += `	◦  *الجودة* : ${json.data.quality}\n\n`
               caption += `© DEV ABOODI OFFICIAL`
               
               const chSize = Utils.sizeLimit(json.data.size, users.premium ? Config.max_upload : Config.max_upload_free)
               const isOver = users.premium ? 
                  `💀 حجم الملف (${json.data.size}) يتجاوز الحد الأقصى المسموح به للبوت.` : 
                  `⚠️ حجم الملف (${json.data.size}). الحد الأقصى المسموح به للمخدم العادي هو ${Config.max_upload_free} ميجابايت، وللمشتركين المميزين هو ${Config.max_upload} ميجابايت.`;
               if (chSize.oversize) return client.reply(m.chat, isOver, m)
               
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
               client.sendFile(m.chat, json.data.url, json.data.filename, caption, m)
            }
            
         // 3. معالجة طلب عرض القائمة لأول مرة وتخزينها في الجلسة
         } else if (['قائمة_يوتيوب', 'ytplaylist', 'playlist', 'ytlist'].includes(command)) {
            client.sendReact(m.chat, '🕒', m.key)
            const json = await Api.neoxr('/yt-playlist', {
               url: args[0]
            })
            if (!json.status) return client.reply(m.chat, Utils.jsonFormat(json), m)
            
            if (!check) {
               client.ytplaylist.push({
                  jid: m.sender,
                  results: json.data.map(v => v.url),
                  created_at: new Date * 1
               })
            } else check.results = json.data.map(v => v.url)
            
            // صياغة رسالة التعليمات وقائمة التشغيل المعربة للمستخدم
            let p = `📥 لتحميل فيديو أرسل: *${isPrefix}جلب_فيديو [رقم المقطع]* ولتحميل صوت أرسل: *${isPrefix}جلب_صوت [رقم المقطع]*\n`
            p += `💡 *مثال* : ${isPrefix}جلب_فيديو 1\n\n`
            
            json.data.map((v, i) => {
               p += `*${i + 1}*. ${v.title}\n`
               p += `◦ *الرابط* : ${v.url}\n\n`
            }).join('\n\n')
            
            p += `© DEV ABOODI OFFICIAL`
            client.reply(m.chat, p, m)
         }
         
         // مؤقت لتنظيف الذاكرة وحذف الجلسات المنتهية تلقائياً لتوفير رام السيرفر
         setInterval(async () => {
            const session = client.ytplaylist.find(v => v.jid == m.sender)
            if (session && new Date - session.created_at > Config.timeout) {
               Utils.removeItem(client.ytplaylist, session)
            }
         }, 60_000)
         
      } catch (e) {
         client.reply(m.chat, Utils.jsonFormat(e), m)
      }
   },
   error: false,
   limit: true // الميزة تستهلك حداً من نقاط المستخدم
}
