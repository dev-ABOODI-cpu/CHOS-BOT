import baileys from '../../lib/engine.js'
const { S_WHATSAPP_NET } = baileys

export const run = {
   usage: ['تعيين_البروفايل'], // الاسم العربي الرئيسي الذي سيظهر في القائمة (تعيين_البروفايل)
   hidden: ['setpp', 'تغيير_البروفايل', 'صورة_البوت'], // الاختصارات المخفية لضمان عمل البوت كبدائل دائمًا
   use: 'الرد على صورة مستهدفة',
   category: 'المطور', // الفئة المعربة لتنظيم قائمة أوامر المالك
   async: async (m, {
      client,
      Utils
   }) => {
      try {
         let q = m.quoted ? m.quoted : m
         let mime = ((m.quoted ? m.quoted : m.msg).mimetype || '')
         
         // التحقق من أن المرفق عبارة عن صورة صالحة (JPEG أو PNG)
         if (/image\/(jpe?g|png)/.test(mime)) {
            client.sendReact(m.chat, '🕒', m.key)
            
            const buffer = await q.download()
            const { img } = await generate(buffer) // معالجة الصورة وقصها برمجياً لتبدو متناسقة
            
            // إرسال استعلام تحديث الصورة الشخصية إلى خوادم الواتساب مباشرة
            await client.query({
               tag: 'iq',
               attrs: {
                  to: S_WHATSAPP_NET,
                  type: 'set',
                  xmlns: 'w:profile:picture'
               },
               content: [
                  {
                     tag: 'picture',
                     attrs: {
                        type: 'image'
                     },
                     content: img
                  }
               ]
            })
            client.reply(m.chat, Utils.texted('bold', `🚩 تم تحديث وتغيير الصورة الشخصية للبوت بنجاح.\n\n© DEV ABOODI OFFICIAL`), m)
         } else {
            return client.reply(m.chat, Utils.texted('bold', `🚩 تعذر العثور على صورة. يرجى الرد على الصورة التي تريد جعلها بروفايل للبوت.`), m)
         }
      } catch (e) {
         client.reply(m.chat, Utils.jsonFormat(e), m)
      }
   },
   owner: true // الميزة محمية ومخصصة لمالك ومطور البوت فقط
}

/**
 * دالة معالجة وقص الصورة وتكبيرها/تصغيرها لتناسب مقاييس بروفايل الواتساب الرسمية
 * @param {Buffer} media - مصفوفة البيانات الخاصة بالصورة المدخلة
 */
async function generate(media) {
   const Jimp = (await import('jimp')).default
   const jimp = await Jimp.read(media)
   const min = jimp.getWidth()
   const max = jimp.getHeight()
   const cropped = jimp.crop(0, 0, min, max)
   return {
      img: await cropped.scaleToFit(720, 720).getBufferAsync(Jimp.MIME_JPEG),
      preview: await cropped.normalize().getBufferAsync(Jimp.MIME_JPEG)
   }
}
