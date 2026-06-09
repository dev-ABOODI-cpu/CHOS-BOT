import os from 'node:os'

export const run = {
   usage: ['السيرفر'], // الاسم العربي الرئيسي الذي سيظهر في القائمة (السيرفر)
   hidden: ['server', 'سيرفر', 'المواصفات'], // الاختصارات المخفية لضمان عمل البوت إذا كُتبت بالإنجليزية أو العربية البديلة
   category: 'إحصائيات', // الفئة المعربة لتنظيم قائمة الأوامر
   async: async (m, {
      client,
      setting,
      Utils
   }) => {
      try {
         // جلب معلومات الشبكة والموقع الجغرافي الخاص بالسيرفر
         const json = await Utils.fetchAsJSON('http://ip-api.com/json')
         delete json.status
         delete json.query
         
         // صياغة تفاصيل مواصفات الخادم باللغة العربية
         let caption = `乂  *مـوا صـفـا ت  ا لـسـيـر فـر*\n\n`
         caption += `┌  ◦  نظام التشغيل: ${os.type()} (${os.arch()} / ${os.release()})\n`
         caption += `│  ◦  الذاكرة العشوائية (RAM): ${Utils.formatSize(process.memoryUsage().rss)} / ${Utils.formatSize(os.totalmem())}\n`
         
         // حلقة تكرارية لطباعة تفاصيل الموقع ومزود الخدمة المرتجعة
         for (let key in json) {
            caption += `│  ◦  ${Utils.ucword(key)} : ${json[key]}\n`
         }
         
         caption += `│  ◦  مدة تشغيل الجهاز: ${Utils.toTime(os.uptime() * 1000)}\n` // تم تصحيح الاستدعاء بإضافة أقواس الدالة ()
         caption += `└  ◦  المعالج (Processor): ${os.cpus()[0].model}\n\n`
         caption += `© DEV ABOODI OFFICIAL`
         
         // إرسال بطاقة مواصفات السيرفر مدمجة بغلاف البوت الشخصي المعين في الإعدادات
         client.sendMessageModify(m.chat, caption, m, {
            largeThumb: true,
            type: 'preview-link',
            ratio: 'landscape',
            thumbnail: Utils.isUrl(setting.cover) ? setting.cover : Buffer.from(setting.cover, 'base64')
         })
      } catch (e) {
         client.reply(m.chat, Utils.jsonFormat(e), m)
      }
   },
   error: false
}
