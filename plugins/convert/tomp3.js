import { Converter } from '@neoxr/wb'
import { readFileSync as read, unlinkSync as remove, writeFileSync as create } from 'fs'
import { exec } from 'child_process'

export const run = {
   usage: ['إلى_صوت', 'إلى_بصمة'], // تم تعريب الأوامر (تومب3 -> إلى_صوت) و (توفن -> إلى_بصمة)
   hidden: ['toaudio', 'tomp3', 'tovn'],
   use: 'الرد على فيديو أو صوت',
   category: 'المحولات', // تم تعريب الفئة لتنظيم القائمة باللغة العربية
   async: async (m, {
      client,
      command,
      Utils
   }) => {
      try {
         // معالجة الفيديوهات التي تحتوي على أزرار تفاعلية (Buttons Video)
         if (m.quoted && typeof m.quoted.buttons != 'undefined' && typeof m.quoted.videoMessage != 'undefined') {
            client.sendReact(m.chat, '🕒', m.key)
            const media = await client.saveMediaMessage(m.quoted.videoMessage)
            const result = Utils.filename('mp3')
            
            exec(`ffmpeg -i ${media} ${result}`, async (err, stderr, stdout) => {
               remove(media)
               if (err) return client.reply(m.chat, Utils.texted('bold', `🚩 فشلت عملية تحويل الملف الصوتي.`), m)
               let buff = read(result)
               
               // في حال طلب تحويلها إلى ملف صوتي MP3 عادي
               if (/إلى_صوت|toaudio|tomp3/.test(command)) return client.sendFile(m.chat, buff, 'audio.mp3', '© DEV ABOODI OFFICIAL', m).then(() => {
                  remove(result)
               })
               // في حال طلب تحويلها إلى بصمة صوتية داخل الشات
               if (/إلى_بصمة|tovn/.test(command)) return client.sendFile(m.chat, buff, 'audio.mp3', '', m, {
                  ptt: true
               }).then(() => {
                  remove(result)
               })
            })
         } else {
            // معالجة الوسائط العادية المردود عليها (صوت أو فيديو)
            const q = m.quoted ? m.quoted : m
            const mime = ((m.quoted ? m.quoted : m.msg).mimetype || '')
            
            if (/audio|video/.test(mime)) {
               client.sendReact(m.chat, '🕒', m.key)
               
               // معالجة أمر تحويل الملف الصوتي المعتاد
               if (/إلى_صوت|toaudio|tomp3/.test(command)) {
                  const buff = await Converter.toAudio(await q.download())
                  return client.sendFile(m.chat, buff, 'audio.mp3', '© DEV ABOODI OFFICIAL', m)
                  
               // معالجة أمر تحويل الوسائط إلى بصمة صوتية (PTT)
               } else if (/إلى_بصمة|tovn/.test(command)) {
                  const buff = await Converter.toPTT(await q.download())
                  return client.sendFile(m.chat, buff, '', '', m, {
                     ptt: true
                  })
               }
            } else {
               client.reply(m.chat, Utils.texted('bold', `🚩 هذه الميزة مخصصة للملفات الصوتية ومقاطع الفيديو فقط.`), m)
            }
         }
      } catch (e) {
         return client.reply(m.chat, Utils.jsonFormat(e), m)
      }
   },
   error: false,
   limit: true // الميزة تستهلك حداً من نقاط المستخدم
}
