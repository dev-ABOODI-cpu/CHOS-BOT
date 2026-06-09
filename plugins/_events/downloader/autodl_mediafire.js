import { decode } from 'html-entities'

export const run = {
   regex: /^(?:https?:\/\/)?(?:www\.)?(?:mediafire\.com\/)(?:\S+)?$/,
   async: async (m, {
      client,
      body,
      users,
      Config,
      Utils
   }) => {
      try {
         const regex = /^(?:https?:\/\/)?(?:www\.)?(?:mediafire\.com\/)(?:\S+)?$/;
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
               Utils.hitstat('mediafire', m.sender)
               links.map(async link => {
                  const json = await Api.neoxr('/mediafire', {
                     url: link
                  })
                  if (!json.status) return client.reply(m.chat, Utils.jsonFormat(json), m)
                  
                  // تجهيز الرسالة التعريفية بالملف باللغة العربية
                  let text = `乂  *M E D I A F I R E*\n\n`
                  text += '	◦  *الاسم* : ' + unescape(decode(json.data.title)) + '\n'
                  text += '	◦  *الحجم* : ' + json.data.size + '\n'
                  text += '	◦  *الامتداد* : ' + json.data.extension + '\n'
                  text += '	◦  *النوع (Mime)* : ' + json.data.mime + '\n\n'
                  text += `© DEV ABOODI OFFICIAL`
                  
                  const chSize = Utils.sizeLimit(json.data.size, users.premium ? Config.max_upload : Config.max_upload_free)
                  const isOver = users.premium ? `❌ حجم الملف (${json.data.size}) يتخطى الحد الأقصى المسموح به للرفع حالياً.` : `⚠️ حجم الملف الحالي (${json.data.size}). الحد الأقصى للمستخدمين العاديين هو ${Config.max_upload_free} ميجابايت، وللمشتركين المميزين هو ${Config.max_upload} ميجابايت.`
                  if (chSize.oversize) return client.reply(m.chat, isOver, m)
                  
                  client.sendMessageModify(m.chat, text, m, {
                     largeThumb: true,
                     type: 'preview-link',
                     ratio: 'landscape',
                     thumbnail: 'https://telegra.ph/file/fcf56d646aa059af84126.jpg'
                  }).then(async () => {
                     // إرسال الملف الفعلي للمستخدم بعد إرسال رسالة المعاينة
                     client.sendFile(m.chat, json.data.url, unescape(decode(json.data.title)), '', m)
                  })
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
