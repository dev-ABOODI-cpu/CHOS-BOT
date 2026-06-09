import { Converter } from '@neoxr/wb'
import fs from 'node:fs'
import { exec } from 'child_process'

export const run = {
   // تم تعريب جميع الأوامر لتناسب واجهة البوت العربية
   usage: [
      'تضخيم', 'مفجر', 'سنجاب', 'عميق', 'مزعج', 
      'سريع', 'ضخم', 'نايتكور', 'معكوس', 'روبوت', 
      'بطيء', 'ناعم'
   ],
   hidden: [
      'bass', 'blown', 'chipmunk', 'deep', 'earrape', 
      'fast', 'fat', 'nightcore', 'reverse', 'robot', 
      'slow', 'smooth'
   ],
   use: 'الرد على ملف صوتي',
   category: 'مغير الصوت', // تم تعريب الفئة لتنظيم القائمة باللغة العربية
   async: async (m, {
      client,
      command,
      Utils
   }) => {
      try {
         // التحقق مما إذا كان المستخدم قد قام بالرد على رسالة
         if (!m.quoted) return client.reply(m.chat, Utils.texted('bold', `🚩 يرجى الرد على ملف صوتي أو بصمة لتطبيق التأثير.`), m)
         
         let mime = ((m.quoted ? m.quoted : m.msg).mimetype || '')
         let set
         
         // إعداد فلاتر ffmpeg بناءً على الأمر المعرب المستخدم
         if (/تضخيم|bass/.test(command)) set = '-af equalizer=f=94:width_type=o:width=2:g=30'
         if (/مفجر|blown/.test(command)) set = '-af acrusher=.1:1:64:0:log'
         if (/عميق|deep/.test(command)) set = '-af atempo=4/4,asetrate=44500*2/3'
         if (/مزعج|earrape/.test(command)) set = '-af volume=12'
         if (/سريع|fast/.test(command)) set = '-filter:a "atempo=1.63,asetrate=44100"'
         if (/ضخم|fat/.test(command)) set = '-filter:a "atempo=1.6,asetrate=22100"'
         if (/نايتكور|nightcore/.test(command)) set = '-filter:a atempo=1.06,asetrate=44100*1.25'
         if (/معكوس|reverse/.test(command)) set = '-filter_complex "areverse"'
         if (/روبوت|robot/.test(command)) set = '-filter_complex "fftfilt=real=\'hypot(re,im)*sin(0)\':imag=\'hypot(re,im)*cos(0)\':win_size=512:overlap=0.75"'
         if (/بطيء|slow/.test(command)) set = '-filter:a "atempo=0.7,asetrate=44100"'
         if (/ناعم|smooth/.test(command)) set = '-filter:v "minterpolate=\'mi_mode=mci:mc_mode=aobmc:vsbmc=1:fps=120\'"'
         if (/سنجاب|chipmunk/.test(command)) set = '-filter:a "atempo=0.5,asetrate=65100"'
         
         if (/audio/.test(mime)) {
            // إرسال تفاعل (إيموجي الانتظار)
            client.sendReact(m.chat, '🕒', m.key)
            
            const buffer = await Converter.toAudio(await m.quoted.download(), 'mp3')
            const parse = await Utils.getFile(buffer)
            let ran = Utils.filename('mp3')
            
            // تنفيذ الأمر عبر ffmpeg لتطبيق الفلتر المختار
            exec(`ffmpeg -i ${parse.file} ${set} ${ran}`, async (err, stderr, stdout) => {
               fs.unlinkSync(parse.file)
               if (err) return client.reply(m.chat, Utils.texted('bold', `🚩 فشلت عملية معالجة وتغيير الصوت.`), m)
               let buff = fs.readFileSync(ran)
               
               // إذا كان الصوت الأصلي عبارة عن بصمة (PTT)، يتم إرساله كبصمة أيضاً
               if (m.quoted.ptt) return client.sendFile(m.chat, buff, 'audio.mp3', '', m, {
                  ptt: true
               }).then(() => {
                  fs.unlinkSync(ran)
               })
               
               // إرسال الملف الصوتي المعدل مع تثبيت الحقوق
               client.sendFile(m.chat, buff, 'audio.mp3', '© DEV ABOODI OFFICIAL', m).then(() => {
                  fs.unlinkSync(ran)
               })
            })
         } else {
            client.reply(m.chat, Utils.texted('bold', `🚩 يرجى الرد على ملف صوتي أو بصمة لتطبيق التأثير.`), m)
         }
      } catch (e) {
         console.log(e)
         return client.reply(m.chat, Utils.jsonFormat(e), m)
      }
   },
   error: false,
   limit: true // الميزة تستهلك حداً من نقاط المستخدم
}
