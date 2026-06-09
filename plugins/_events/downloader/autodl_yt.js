export const run = {
   regex: /^(?:https?:\/\/)?(?:www\.|m\.|music\.)?youtu\.?be(?:\.com)?\/?.*(?:watch|embed)?(?:.*v=|v\/|\/)([\w\-_]+)\&?/,
   async: async (m, {
      client,
      body,
      users,
      Config,
      Utils
   }) => {
      try {
         const regex = /^(?:https?:\/\/)?(?:www\.|m\.|music\.)?youtu\.?be(?:\.com)?\/?.*(?:watch|embed)?(?:.*v=|v\/|\/)([\w\-_]+)\&?/;
         const extract = body ? Utils.generateLink(body) : null
         if (extract) {
            const links = extract.filter(v => v.match(regex))
            if (links.length != 0) {
               if (users.limit > 0) {
                  let limit = 1
                  if (users.limit >= limit) {
                     users.limit -= limit
                  } else return client.reply(m.chat, Utils.texted('bold', `🚩 عذراً، رصيد نقاطك الحالي لا يكفي لاستخدام هذه الميزة.`), m)
               }
               client.sendReact(m.chat, '🕒', m.key)
               let old = new Date()
               Utils.hitstat('ytmp4', m.sender)
               links.map(async link => {
                  // محاولة جلب الفيديو بجودة 720p
                  var json = await Api.neoxr('/youtube', {
                     url: link,
                     type: 'video',
                     quality: '720p'
                  })
                  // إذا فشل الجلب، يتم التحويل تلقائياً لجودة 480p
                  if (!json.status) {
                     var json = await Api.neoxr('/youtube', {
                        url: link,
                        type: 'video',
                        quality: '480p'
                     })
                  }
                  if (!json.status) return client.reply(m.chat, Utils.jsonFormat(json), m)
                  
                  // تجهيز كابشن الفيديو باللغة العربية مع حقوقك
                  let caption = `乂  *Y T - M P 4*\n\n`
                  caption += `	◦  *العنوان* : ${json.title}\n`
                  caption += `	◦  *الحجم* : ${json.data.size}\n`
                  caption += `	◦  *المدة* : ${json.duration}\n`
                  caption += `	◦  *الجودة* : ${json.data.quality}\n\n`
                  caption += `© DEV ABOODI OFFICIAL`
                  
                  const chSize = Utils.sizeLimit(json.data.size, users.premium ? Config.max_upload : Config.max_upload_free)
                  const isOver = users.premium ? `❌ حجم الملف (${json.data.size}) يتخطى الحد الأقصى المسموح به للرفع حالياً.` : `⚠️ حجم الملف الحالي (${json.data.size}). الحد الأقصى للمستخدمين العاديين هو ${Config.max_upload_free} ميجابايت، وللمشتركين المميزين هو ${Config.max_upload} ميجابايت.`
                  if (chSize.oversize) return client.reply(m.chat, isOver, m)
                  
                  let isSize = (json.data.size).replace(/MB/g, '').trim()
                  // إذا كان حجم الملف أكبر من 99 ميجابايت يتم إرساله كمستند لتفادي مشاكل واتساب
                  if (isSize > 99) return client.sendMessageModify(m.chat, caption, m, {
                     largeThumb: true,
                     type: 'preview-link',
                     ratio: 'landscape',
                     thumbnail: await Utils.fetchAsBuffer(json.thumbnail)
                  }).then(async () => {
                     await client.sendFile(m.chat, json.data.buffer, json.data.filename, caption, m, {
                        document: true
                     })
                  })
                  client.sendFile(m.chat, json.data.buffer, json.data.filename, caption, m)
               })
            }
         }
      } catch (e) {
         console.log(e)
         return client.reply(m.chat, global.status.error, m)
      }
   },
   limit: true,
   download: true
}
