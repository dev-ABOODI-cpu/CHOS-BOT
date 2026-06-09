import sharp from 'sharp'

export const run = {
   usage: ['إلى_صورة'], // تم تعريب الأمر ليظهر في قائمة البوت باسم (إلى_صورة)
   use: 'الرد على ملصق',
   category: 'المحولات', // تم تعريب الفئة لتنظيم القائمة باللغة العربية
   async: async (m, {
      client,
      Utils
   }) => {
      try {
         // التحقق مما إذا كان المستخدم قد قام بالرد على ملصق بالفعل
         if (!/sticker/gis.test(m?.quoted?.mtype)) return client.reply(m.chat, Utils.texted('bold', `🚩 يرجى الرد على الملصق الثابت الذي تريد تحويله إلى صورة (الملصقات المتحركة غير مدعومة).`), m)
         
         // استبعاد ملصقات متحركة من نوع Lottie لتجنب حدوث أخطاء برمجية
         if (/lottie/gis.test(m?.quoted?.mtype)) return client.reply(m.chat, Utils.texted('bold', `🚩 ملصقات Lottie المتحركة غير مدعومة في هذا الأمر.`), m)
         
         // إرسال تفاعل (إيموجي الانتظار)
         client.sendReact(m.chat, '🕒', m.key)
         
         // تحميل بيانات الملصق ومعالجتها عبر مكتبة sharp لتحويلها إلى امتداد png
         const buffer = await sharp(await m.quoted.download())
            .png()
            .toBuffer()
            
         // إرسال الملف الناتج كصورة داخل الشات مع تثبيت الحقوق
         client.sendFile(m.chat, buffer, 'image.png', '© DEV ABOODI OFFICIAL', m)
      } catch (e) {
         console.log(e)
         return client.reply(m.chat, Utils.jsonFormat(e), m)
      }
   },
   error: false,
   limit: true // الميزة تستهلك حداً من نقاط المستخدم
}
