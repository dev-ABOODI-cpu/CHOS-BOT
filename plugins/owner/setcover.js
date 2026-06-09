export const run = {
   usage: ['تعيين_الغلاف'], // الاسم العربي الرئيسي الذي سيظهر في القائمة (تعيين_الغلاف)
   hidden: ['setcover', 'cover', 'تغيير_الغلاف', 'غلاف_البوت'], // الاختصارات المخفية لضمان عمل البوت كبدائل دائمًا
   use: 'الرد على صورة مستهدفة',
   category: 'المطور', // الفئة المعربة لتنظيم قائمة أوامر المالك
   async: async (m, {
      client,
      setting,
      Utils
   }) => {
      try {
         const q = m.quoted ? m.quoted : m
         const mime = (q.msg || q).mimetype || ''
         
         // التحقق من أن المرفق عبارة عن صورة صالحة
         if (!/image/.test(mime)) return client.reply(m.chat, Utils.texted('bold', `🚩 تعذر العثور على صورة. يرجى الرد على الصورة المراد جعلها غلافاً للبوت.`), m)
         
         client.sendReact(m.chat, '🕒', m.key)
         
         // تحميل الصورة وقصها لتتناسب مع أبعاد الغلاف العريض وضغط حجمها
         const buffer = await cropToLandscapeBuffer(await q.download())
         if (!buffer) throw new Error(global.status.wrong)
         
         // حفظ الصورة بعد تحويلها لـ base64 في قاعدة بيانات الإعدادات
         setting.cover = Buffer.from(buffer).toString('base64')
         client.reply(m.chat, Utils.texted('bold', `🚩 تم تعيين وتحديث صورة غلاف البوت بنجاح.\n\n© DEV ABOODI OFFICIAL`), m)
      } catch (e) {
         return client.reply(m.chat, Utils.jsonFormat(e), m)
      }
   },
   owner: true // الميزة محمية ومخصصة للمطور الرئيسي فقط
}

/**
 * دالة ذكية لقص وتعديل أبعاد الصورة برمجياً لتصبح متناسقة كغلاف عريض
 * @param {Buffer} inputBuffer - مصفوفة البيانات الخاصة بالصورة المدخلة
 * @param {number} aspectRatio - النسبة المئوية للأبعاد المطلوبة (الافتراضي 16:9)
 * @param {Buffer} quality - جودة ضغط الصورة (الافتراضي 50 لتقليل حجم البيانات)
 * @returns {Promise<Buffer>} - مصفوفة البيانات المعالجة للصورة الجديدة
 */
const cropToLandscapeBuffer = async (inputBuffer, aspectRatio = 16 / 9, quality = 50) => {
   try {
      const Jimp = (await import('jimp')).default
      const image = await Jimp.read(inputBuffer)
      const { width, height } = image.bitmap
      const currentAspectRatio = width / height

      let cropWidth, cropHeight

      if (currentAspectRatio > aspectRatio) {
         cropWidth = Math.floor(height * aspectRatio)
         cropHeight = height
      } else {
         cropWidth = width
         cropHeight = Math.floor(width / aspectRatio)
      }

      const x = Math.floor((width - cropWidth) / 2)
      const y = Math.floor((height - cropHeight) / 2)

      // تنفيذ عملية القص والمركزة
      image.crop(x, y, cropWidth, cropHeight)

      // ضغط جودة الصورة لتسريع عملية إرسال واستقبال الرسائل في البوت
      image.quality(quality)

      const outputBuffer = await image.getBufferAsync(Jimp.MIME_JPEG)
      return outputBuffer
   } catch (error) {
      console.error('Error cropping image:', error.message)
      throw error
   }
}
