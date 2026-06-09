export const run = {
   regex: /^(?:https?:\/\/)?(?:www\.)?(?:instagram\.com\/)(?:stories\/)(?:\S+)?$/,
   async: async (m, {
      client,
      body,
      users,
      Utils
   }) => {
      try {
         const regex = /^(?:https?:\/\/)?(?:www\.)?(?:instagram\.com\/)(?:stories\/)(?:\S+)?$/;
         const extract =  (m.quoted && m.quoted.text) ? Utils.generateLink(m.quoted.text) : body ? Utils.generateLink(body) : null
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
               Utils.hitstat('igs', m.sender)
               links.map(async link => {
                  const json = await Api.neoxr('/ig-fetch', {
                  	url: link
                  })
                  if (!json.status) return client.reply(m.chat, `❌ فشل الجلب أو انتهت صلاحية القصة للحساب: [ @${link.split('/')[4]} ]`, m)
                  for (let v of json.data) {
                     const file = await Utils.getFile(v.url)
                     // إرسال الملف بناءً على نوعه (فيديو أو صورة) مع طباعة سرعة الجلب وحقوقك
                     client.sendFile(m.chat, v.url, Utils.filename(/mp4|bin/.test(file.extension) ? 'mp4' : 'jpg'), `🍟 *مدة الاستجابة* : ${((new Date - old) * 1)} م.ث\n\n© DEV ABOODI OFFICIAL`, m)
                     await Utils.delay(1500)
                  }
               })
            }
         }
      } catch (e) {
         return client.reply(m.chat, Utils.jsonFormat(e), m)
      }
   },
   limit: true,
   download: true,
}
