import axios from 'axios'

export const run = {
   usage: ['اقتباس'], // تم تعريب الأمر ليظهر في قائمة البوت باسم (اقتباس)
   use: 'النص',
   category: 'المحولات', // تم تعريب الفئة لتنظيم القائمة باللغة العربية
   async: async (m, {
      client,
      text,
      isPrefix,
      command,
      setting: exif,
      Utils
   }) => {
      try {
         if (!text) return client.reply(m.chat, Utils.example(isPrefix, command, 'مرحباً!'), m)
         if (text.length > 30) return client.reply(m.chat, Utils.texted('bold', `🚩 الحد الأقصى المسموح به هو 30 حرفاً فقط.`), m)
         
         // إرسال تفاعل (إيموجي الانتظار)
         client.sendReact(m.chat, '🕒', m.key)
         
         // جلب صورة الحساب الشخصي للمستخدم الحالي أو العضو المقتبس منه في الرد
         let avatar = await client.profilePicture(m.quoted ? m.quoted.sender : m.sender)
         if (Buffer.isBuffer(avatar)) {
            avatar = 'https://qu.ax/mnUAl.jpg' // صورة افتراضية في حال تعذر جلب الصورة الحقيقية
         }
         
         // بناء هيكل البيانات لإرسالها إلى الـ API
         const json = {
            "type": "quote",
            "format": "png",
            "backgroundColor": "#252525",
            "width": 512,
            "height": 768,
            "scale": 2,
            "messages": [{
               "entities": [],
               "avatar": true,
               "from": {
                  "id": 1,
                  "name": m.quoted ? global.db.users.find(v => v.jid == m.quoted.sender).name : m.pushName,
                  "photo": {
                     "url": avatar
                  }
               },
               "text": text,
               "replyMessage": {}
            }]
         }
         
         // طلب توليد الصورة من خادم neoxr
         const result = await (await axios.post('https://s.neoxr.eu/api/generate', json, {
            headers: {
               'Content-Type': 'application/json'
            }
         })).data
         
         // تحويل الصورة المستلمة إلى كائن Buffer وإرسالها كملصق بالحقوق الخاصة بك
         const buffer = Buffer.from(result.data.image, 'base64')
         client.sendSticker(m.chat, buffer, m, {
            packname: exif.sk_pack,
            author: exif.sk_author
         })
      } catch (e) {
         console.log(e)
         client.reply(m.chat, Utils.texted('bold', `🚩 تعذر توليد ملصق الاقتباس، يرجى المحاولة لاحقاً.`), m)
      }
   },
   error: false,
   limit: true // الميزة تستهلك حداً (Limit) من نقاط المستخدم
}
