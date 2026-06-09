import { readFileSync as read, unlinkSync as remove, writeFileSync as create } from 'fs'
import path from 'path'
import { exec } from 'child_process'
import { tmpdir } from 'os'

export const run = {
   usage: ['كشف_المرة_الواحدة'], // الاسم العربي الرئيسي الذي سيظهر في القائمة
   hidden: ['rvo', 'viewonce', 'كشف'], // الاختصارات المخفية لضمان عمل البوت إذا كُتبت بالإنجليزية أو العربية المبسطة
   use: 'الرد على رسالة العرض لمرة واحدة',
   category: 'المجموعات', // الفئة المعربة لتنظيم قائمة الأوامر
   async: async (m, {
      client,
      Utils
   }) => {
      try {
         // التحقق من وجود رد على رسالة المرة الواحدة
         if (!m.quoted) return client.reply(m.chat, Utils.texted('bold', `🚩 يرجى الرد على رسالة "عرض لمرة واحدة" لاستخراجها.`), m)
         
         await client.sendReact(m.chat, '🕒', m.key)
         const type = m.quoted?.message ? Object.keys(m.quoted.message)?.[0] : m.quoted?.mimetype
         
         if (m.quoted && m.quoted?.message) {
            let q = m.quoted?.message?.[type] || m.quoted
            let buffer = await client.downloadMediaMessage(q)
            
            // التعامل مع الصور ومقاطع الفيديو
            if (/(image|video)/.test(type)) {
               client.sendFile(m.chat, buffer, '', (q.caption || '') + '\n\n© DEV ABOODI OFFICIAL', m)
               
            // التعامل مع الرسائل الصوتية وتحويلها عبر ffmpeg
            } else if (/audio/.test(type)) {
               const media = path.join(tmpdir(), Utils.filename('mp3'))
               create(media, buffer)
               const result = Utils.filename('mp3')
               
               exec(`ffmpeg -i ${media} -vn -ar 44100 -ac 2 -b:a 128k ${result}`, async (err, stderr, stdout) => {
                  remove(media)
                  if (err) return client.reply(m.chat, Utils.texted('bold', `🚩 فشلت عملية تحويل الملف الصوتي.`), m)
                  let buff = read(result)
                  client.sendFile(m.chat, buff, 'audio.mp3', '', m).then(() => {
                     remove(result)
                  })
               })
            } else client.reply(m.chat, Utils.texted('bold', `🚩 نوع الملف غير مدعوم أو غير معروف.`), m)
            
         } else if (m.quoted && !m.quoted?.message) {
            let buffer = await m.quoted.download()
            
            if (/(image|video)/.test(type)) {
               client.sendFile(m.chat, buffer, '', (m.quoted?.caption || '') + '\n\n© DEV ABOODI OFFICIAL', m)
            } else if (/audio/.test(type)) {
               const media = path.join(tmpdir(), Utils.filename('mp3'))
               create(media, buffer)
               const result = Utils.filename('mp3')
               
               exec(`ffmpeg -i ${media} -vn -ar 44100 -ac 2 -b:a 128k ${result}`, async (err, stderr, stdout) => {
                  remove(media)
                  if (err) return client.reply(m.chat, Utils.texted('bold', `🚩 فشلت عملية تحويل الملف الصوتي.`), m)
                  let buff = read(result)
                  client.sendFile(m.chat, buff, 'audio.mp3', '', m).then(() => {
                     remove(result)
                  })
               })
            } else client.reply(m.chat, Utils.texted('bold', `🚩 نوع الملف غير مدعوم أو غير معروف.`), m)
         } else client.reply(m.chat, Utils.texted('bold', `🚩 حدث خطأ أثناء معالجة الرسالة.`), m)
      } catch (e) {
         client.reply(m.chat, Utils.jsonFormat(e), m)
      }
   },
   error: false
}
