import { Converter } from '@neoxr/wb'
const mediaCache = new Set()

export const run = {
   usage: ['إذاعة', 'إذاعة_جروبات', 'إذاعة_جروبات_مخفي', 'إذاعة_مخفي', 'إذاعة_للمميزين', 'إذاعة_مستلمين'], // الأوامر العربية الرئيسية المضافة للقائمة
   hidden: ['bcr', 'bc', 'bcgc', 'bcv', 'bcgcv', 'bcprem'], // الاختصارات الإنجليزية المخفية لضمان عملها كبدائل دائمًا
   use: 'النص أو الرد على وسائط (صورة، فيديو، صوت، ملصق)',
   category: 'المطور', // الفئة المعربة لتنظيم قائمة أوامر المالك
   async: async (m, {
      client,
      text,
      command,
      setting,
      Utils
   }) => {
      try {
         const { users, chats } = global.db
         const chatJid = chats.filter(v => v.jid.endsWith('.net')).map(v => v.jid)
         const premiumJid = users.filter(v => v.premium).map(v => v.jid) || []
         const groupJid = Object.values(await client.groupFetchAllParticipating())
         const receiverJid = setting.receiver.length ? setting.receiver.map(v => v + '@c.us') : []

         // فرز وتحديد قائمة المعرفات المستهدفة بناءً على الأمر المستخدم
         const id = ['إذاعة', 'إذاعة_مخفي', 'bc', 'bcv'].includes(command)
            ? chatJid
            : (command === 'إذاعة_مستلمين' || command === 'bcr')
               ? receiverJid
               : (command === 'إذاعة_للمميزين' || command === 'bcprem')
                  ? premiumJid
                  : groupJid

         if (!id?.length) return client.reply(m.chat, Utils.texted('bold', `🚩 خطأ: قائمة الأهداف المستهدفة فارغة أو غير موجودة حالياً.`), m)

         const q = m.quoted ? m.quoted : m
         const mime = (q.msg || q).mimetype || ''
         const group = ['إذاعة_جروبات', 'إذاعة_جروبات_مخفي', 'bcgc', 'bcgcv'].includes(command)

         // 1. التعامل مع الملصقات وإرسالها جماعياً
         if (/image\/(webp)/.test(mime)) {
            client.sendReact(m.chat, '🕒', m.key)
            const keyId = q.key?.id
            let media

            if (!mediaCache.has(keyId)) {
               media = await q.download()
               if (!media) return client.reply(m.chat, '🚩 فشل تحميل الملصق من خوادم واتساب.', m)
               mediaCache.add(keyId)
            }

            for (let jid of id) {
               const member = group ? client.lidParser(jid?.participants)?.map(v => v.id) : []
               await client.sendSticker(group ? jid.id : jid, media, null, {
                  packname: setting.sk_pack,
                  author: setting.sk_author,
                  mentions: (command == 'إذاعة_جروبات' || command == 'bcgc') ? member : []
               })
               await Utils.delay(1500) // تأخير زمني بمقدار ثانية ونصف لتفادي الحظر وحماية الرقم
            }
            return client.reply(m.chat, Utils.texted('bold', `🚩 تم إرسال الإذاعة بنجاح إلى ${id.length} جهة.`), m).then(() => {
               if (mediaCache.has(keyId)) mediaCache.delete(keyId)
            })
         }

         // 2. التعامل مع الصور ومقاطع الفيديو وإرسالها جماعياً
         if (/video|image\/(jpe?g|png)/.test(mime)) {
            client.sendReact(m.chat, '🕒', m.key)
            const keyId = q.key?.id
            let media

            if (!mediaCache.has(keyId)) {
               media = await q.download()
               if (!media) return client.reply(m.chat, '🚩 فشل تحميل الوسائط المطلوبة.', m)
               mediaCache.add(keyId)
            }

            for (let jid of id) {
               const room = group ? jid.id : jid
               let caption = ''
               if (q?.text || text) {
                  caption += `乂  *إ ذ ا عـة  عـا مـة*\n\n`
                  caption += q.text || text
                  caption += `\n\n© DEV ABOODI OFFICIAL`
               }

               const member = group ? client.lidParser(jid?.participants)?.map(v => v.id) : []
               const properties = (command === 'إذاعة_جروبات' || command === 'bcgc')
                  ? { contextInfo: { mentionedJid: member } }
                  : (command == 'إذاعة_جروبات_مخفي' || command == 'bcgcv')
                     ? { viewOnce: true, contextInfo: { mentionedJid: member } }
                     : (command == 'إذاعة_مخفي' || command == 'bcv')
                        ? { viewOnce: true }
                        : {}

               await client.sendFile(room, media, '', caption, null, {}, properties)
               await Utils.delay(1500)
            }

            return client.reply(m.chat, Utils.texted('bold', `🚩 تم إرسال الإذاعة بنجاح إلى ${id.length} جهة.`), m).then(() => {
               if (mediaCache.has(keyId)) mediaCache.delete(keyId)
            })
         }

         // 3. التعامل مع المقاطع الصوتية (Voice Notes / Audio) وإرسالها جماعياً
         if (/audio/.test(mime)) {
            client.sendReact(m.chat, '🕒', m.key)
            const keyId = q.key?.id
            let media

            if (!mediaCache.has(keyId)) {
               media = q.ptt ? await Converter.toPTT(await q.download()) : await q.download()
               if (!media) return client.reply(m.chat, '🚩 فشل تحميل المقطع الصوتي.', m)
               mediaCache.add(keyId)
            }

            for (let jid of id) {
               const room = group ? jid.id : jid
               const member = group ? client.lidParser(jid?.participants)?.map(v => v.id) : []
               const properties = (command === 'إذاعة_جروبات' || command === 'bcgc')
                  ? { contextInfo: { mentionedJid: member } }
                  : (command == 'إذاعة_جروبات_مخفي' || command == 'bcgcv')
                     ? { viewOnce: true, contextInfo: { mentionedJid: member } }
                     : {}

               await client.sendFile(room, media, '', '', null, {
                  ptt: q.ptt
               }, properties)
               await Utils.delay(1500)
            }
            return client.reply(m.chat, Utils.texted('bold', `🚩 تم إرسال الإذاعة الصوتية بنجاح إلى ${id.length} جهة.`), m).then(() => {
               if (mediaCache.has(keyId)) mediaCache.delete(keyId)
            })
         }

         // 4. التعامل مع الرسائل النصية النقية وإرسالها بلوحة منسقة مدمجة بالرابط والغلاف الرسمي لقناتك
         if (text) {
            client.sendReact(m.chat, '🕒', m.key)
            for (let jid of id) {
               const room = group ? jid.id : jid
               const member = group ? client.lidParser(jid?.participants)?.map(v => v.id) : []
               await client.sendMessageModify(room, text + `\n\n© DEV ABOODI OFFICIAL`, null, {
                  netral: true,
                  title: global.botname,
                  thumbnail: await Utils.fetchAsBuffer('https://telegra.ph/file/aa76cce9a61dc6f91f55a.jpg'),
                  largeThumb: true,
                  type: 'preview-link',
                  ratio: 'landscape',
                  url: setting.link,
                  mentions: (command == 'إذاعة_جروبات' || command == 'bcgc') ? member : []
               })
               await Utils.delay(1500)
            }
            return client.reply(m.chat, Utils.texted('bold', `🚩 تم إرسال الرسالة الجماعية النصية بنجاح إلى ${id.length} جهة.`), m)
         }

         client.reply(m.chat, Utils.texted('bold', `🚩 يرجى كتابة نص مع الأمر أو الرد على (صورة، مقطع فيديو، ملصق، أو صوت) لتشغيل الإذاعة.`), m)
      } catch (e) {
         client.reply(m.chat, Utils.jsonFormat(e), m)
      }
   },
   owner: true // حماية الأداة الحساسة لتعمل فقط لصاحب البوت الأساسي لضمان عدم السبام
}
