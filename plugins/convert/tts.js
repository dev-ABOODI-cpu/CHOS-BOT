import gtts from 'node-gtts'
import { tmpdir } from 'node:os'
import fs from 'node:fs'
import path from 'path'

export const run = {
   usage: ['نطق'], // تم تعريب الأمر ليظهر في قائمة البوت باسم (نطق)
   use: 'رمز_اللغة النص',
   category: 'المحولات', // تم تعريب الفئة لتنظيم القائمة باللغة العربية
   async: async (m, {
      client,
      text,
      isPrefix,
      command,
      Utils
   }) => {
      // التحقق من وجود نص مدخل
      if (!text) return client.reply(m.chat, Utils.example(isPrefix, command, 'ar أهلاً بكم'), m)
      
      // الحالة الأولى: إذا قام المستخدم بالرد على رسالة نصية لتوليد صوت منها
      if (text && m.quoted && m.quoted.text) {
         let lang = text.slice(0, 2) // أخذ أول حرفين كرمز للغة
         try {
            let data = m.quoted.text
            let tts = gtts(lang)
            let filePath = path.join(tmpdir(), Utils.filename('mp3'))
            
            tts.save(filePath, data, async () => {
               // إرسال الملف الصوتي الناتج مع تثبيت الحقوق
               client.sendFile(m.chat, await Utils.fetchAsBuffer(filePath), 'audio.mp3', '© DEV ABOODI OFFICIAL', m)
               fs.unlinkSync(filePath) // حذف الملف المؤقت بعد الإرسال
            })
         } catch {
            return client.reply(m.chat, Utils.texted('bold', `🚩 رمز اللغة هذا غير مدعوم حالياً.`), m)
         }
         
      // الحالة الثانية: إذا كتب المستخدم النص مباشرة بعد الأمر
      } else if (text) {
         let lang = text.slice(0, 2) // أخذ أول حرفين كرمز للغة
         try {
            let data = text.substring(2).trim() // استخراج النص المراد نطقه واستبعاد رمز اللغة
            let tts = gtts(lang)
            let filePath = path.join(tmpdir(), Utils.filename('mp3'))
            
            tts.save(filePath, data, async () => {
               // إرسال الملف الصوتي الناتج مع تثبيت الحقوق
               client.sendFile(m.chat, await Utils.fetchAsBuffer(filePath), 'audio.mp3', '© DEV ABOODI OFFICIAL', m)
               fs.unlinkSync(filePath) // حذف الملف المؤقت بعد الإرسال
            })
         } catch (e) {
            console.log(e)
            return client.reply(m.chat, Utils.texted('bold', `🚩 رمز اللغة هذا غير مدعوم حالياً.`), m)
         }
      }
   },
   error: false,
   limit: true // الميزة تستهلك حداً من نقاط المستخدم
}
