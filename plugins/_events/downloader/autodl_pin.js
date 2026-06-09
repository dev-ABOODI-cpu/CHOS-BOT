export const run = {
   regex: /pin(?:terest)?(?:\.it|\.com)/,
   async: async (m, {
      client,
      body,
      users,
      Utils
   }) => {
      try {
         const regex = /pin(?:terest)?(?:\.it|\.com)/;
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
               Utils.hitstat('pin', m.sender)
               links.map(async link => {
                  const json = await Api.neoxr('/pin', {
                     url: link
                  })
                  if (!json.status) return client.reply(m.chat, Utils.jsonFormat(json), m)
                  
                  // إذا كان المحتوى صورة ثابتة
                  if (/jpg/.test(json.data.type)) return client.sendFile(m.chat, json.data.url, '', `🍟 *مدة الاستجابة* : ${((new Date - old) * 1)} م.ث\n\n© DEV ABOODI OFFICIAL`, m)
                  
                  // إذا كان المحتوى فيديو أو صورة متحركة GIF
                  if (/mp4|gif/.test(json.data.type)) {
                     const buffer = await Converter.toVideo(json.data.url)
                     client.sendFile(m.chat, buffer, '', `🍟 *مدة الاستجابة* : ${((new Date - old) * 1)} م.ث\n\n© DEV ABOODI OFFICIAL`, m)
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
