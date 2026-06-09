export const run = {
   regex: /^(?:https?:\/\/(web\.|www\.|m\.)?(facebook|fb)\.(com|watch)\S+)?$/,
   async: async (m, {
      client,
      body,
      users,
      Config,
      Utils,
      Scraper
   }) => {
      try {
         const regex = /^(?:https?:\/\/(web\.|www\.|m\.)?(facebook|fb)\.(com|watch)\S+)?$/;
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
               Utils.hitstat('fb', m.sender)
               links.map(async link => {
                  let json = await Api.neoxr('/fb', {
                     url: link
                  })
                  if (!json.status) return client.reply(m.chat, Utils.jsonFormat(json), m)
                  
                  // محاولة جلب الفيديو بجودة عالية HD
                  let result = json.data.find(v => v.quality == 'HD' && v.response == 200)
                  if (result) {
                     const size = await Utils.getSizeFromUrl(result.url)
                     const chSize = Utils.sizeLimit(size, users.premium ? Config.max_upload : Config.max_upload_free)
                     const isOver = users.premium ? `❌ حجم الملف (${size}) يتخطى الحد الأقصى للرفع المسموح به، يمكنك تحميله بنفسك مباشرة عبر هذا الرابط المختصر: ${await (await Scraper.shorten(result.url)).data.url}\n\n© DEV ABOODI OFFICIAL` : `⚠️ حجم الملف الحالي (${size}). الحد الأقصى للمستخدمين العاديين هو ${Config.max_upload_free} ميجابايت، وللمشتركين المميزين هو ${Config.max_upload} ميجابايت.\n\n© DEV ABOODI OFFICIAL`
                     if (chSize.oversize) return client.reply(m.chat, isOver, m)
                     client.sendFile(m.chat, result.url, Utils.filename('mp4'), `◦ *الجودة* : عالي الدقة HD`, m)
                  } else {
                     // في حال عدم توفر HD، يتم الجلب بالجودة العادية SD
                     let result = json.data.find(v => v.quality == 'SD' && v.response == 200)
                     if (!result) return client.reply(m.chat, global.status.fail, m)
                     const size = await Utils.getSizeFromUrl(result.url)
                     const chSize = Utils.sizeLimit(size, users.premium ? Config.max_upload : Config.max_upload_free)
                     const isOver = users.premium ? `❌ حجم الملف (${size}) يتخطى الحد الأقصى للرفع المسموح به، يمكنك تحميله بنفسك مباشرة عبر هذا الرابط المختصر: ${await (await Scraper.shorten(result.url)).data.url}\n\n© DEV ABOODI OFFICIAL` : `⚠️ حجم الملف الحالي (${size}). الحد الأقصى للمستخدمين العاديين هو ${Config.max_upload_free} ميجابايت، وللمشتركين المميزين هو ${Config.max_upload} ميجابايت.\n\n© DEV ABOODI OFFICIAL`
                     if (chSize.oversize) return client.reply(m.chat, isOver, m)
                     client.sendFile(m.chat, result.url, Utils.filename('mp4'), `◦ *الجودة* : جودة عادية SD`, m)
                  }
               })
            }
         }
      } catch (e) {
         return client.reply(m.chat, Utils.jsonFormat(e), m)
      }
   },
   limit: true,
   download: true
}
