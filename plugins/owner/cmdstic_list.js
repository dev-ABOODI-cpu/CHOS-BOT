import { format } from 'date-fns'

export const run = {
   usage: ['قائمة_الملصقات'], // الاسم العربي الرئيسي الذي سيظهر في القائمة (قائمة_الملصقات)
   hidden: ['cmdstic', 'ملصقات_الاوامر', 'الاحصائيات_الملصقات'], // الاختصارات المخفية لضمان عمل البوت إذا كُتبت بالإنجليزية
   category: 'المطور', // الفئة المعربة لتنظيم قائمة أوامر المالك
   async: async (m, {
      client,
      Utils
   }) => {
      let cmdS = Object.keys(global.db.sticker)
      
      // التحقق مما إذا كانت قاعدة بيانات ملصقات الأوامر فارغة
      if (cmdS.length == 0) return client.reply(m.chat, Utils.texted('bold', `🚩 لا توجد أي ملصقات مرتبطة بأوامر برمجية حالياً.`), m)
      
      // بناء واجهة القائمة باللغة العربية
      let teks = `乂  *قـائـمـة أوا مـر ا لـمـلـصـقـا ت*\n\n`
      for (let i = 0; i < cmdS.length; i++) {
         teks += Utils.texted('bold', (i + 1) + '.') + ' ' + cmdS[i] + '\n'
         teks += '	◦  ' + Utils.texted('bold', 'الأمر المرتبط') + ' : ' + global.db.sticker[cmdS[i]].text + '\n'
         teks += '	◦  ' + Utils.texted('bold', 'تاريخ الإنشاء') + ' : ' + format(global.db.sticker[cmdS[i]].created, 'dd/MM/yy HH:mm:ss') + '\n\n'
      }
      
      // إرسال القائمة مع حفظ الحقوق المخصصة لك
      m.reply(teks + `© DEV ABOODI OFFICIAL`)
   },
   owner: true // الأداة محمية ومخصصة لمالك البوت فقط
}
