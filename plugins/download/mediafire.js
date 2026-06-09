import { decode } from 'html-entities'

export const run = {
   usage: ['تحميل_ميديافاير'], // الاسم العربي الرئيسي الذي سيظهر في القائمة
   hidden: ['mf', 'mediafire'], // الاختصارات المخفية لضمان عمل البوت إذا كُتبت بالإنجليزية
   use: 'الرابط',
   category: 'التحميلات', // الفئة المعربة لتنظيم قائمة الأوامر
   async: async (m, {
      client,
      args,
      isPrefix,
      command,
      users,
      Config,
      Scraper,
      Utils
   }) => {
      try {
         // التحقق من وجود رابط في المدخلات
         if (!args || !args[0]) return client.reply(m.chat, Utils.example(isPrefix, command, 'https://www.mediafire.com/file/...'), m)
         
         // التحقق من صحة رابط ميديا فاير باستخدام التعبير النمطي (Regex)
         if (!args[0].match(/(https:\/\/www.mediafire.com\/)/gi)) return client.reply(m.chat, global.status.invalid, m)
         
         // إرسال تفاعل (إيموجي الانتظار)
         client.sendReact(m.chat, '🕒', m.key)
         
         // استدعاء واجهة برمجة التطبيقات لجلب بيانات الملف
         const json = await Api.neoxr('/mediafire', {
            url: args[0]
         })
         
         if (!json.status) return client.reply(m.chat, Utils.jsonFormat(json), m)
         
         // صياغة نص تفاصيل الملف المكتشف باللغة العربية
         let text = `乂  *مـعـلـومـات الـمـلـف*\n\n`
         text += '	◦  *الاسم* : ' + unescape(decode(json.data.title)) + '\n'
         text += '	◦  *الحجم* : ' + json.data.size + '\n'
         text += '	◦  *الامتداد* : ' + json.data.extension + '\n'
         text += '	◦  *النوع (Mime)* : ' + json.data.mime + '\n\n'
         text += `© DEV ABOODI OFFICIAL`
         
         // التحقق من حجم الملف والقيود المسموحة
         const chSize = Utils.sizeLimit(json.data.size, users.premium ? Config.max_upload : Config.max_upload_free)
         
         // صياغة رسائل تجاوز الحد الأقصى للملفات بالعربية
         const isOver = users.premium ? 
            `💀 حجم الملف (${json.data.size}) يتجاوز الحد الأقصى المسموح به للبوت.` : 
            `⚠️ حجم الملف (${json.data.size}). الحد الأقصى المسموح به للمستخدمين العاديين هو ${Config.max_upload_free} ميجابايت، وللمشتركين المميزين هو ${Config.max_upload} ميجابايت.`;
         
         if (chSize.oversize) return client.reply(m.chat, isOver, m)
         
         // إرسال رسالة المعاينة والتفاصيل أولاً، ثم رفع الملف وإرساله
         client.sendMessageModify(m.chat, text, m, {
            largeThumb: true,
            type: 'preview-link',
            ratio: 'landscape',
            thumbnail: 'https://telegra.ph/file/fcf56d646aa059af84126.jpg'
         }).then(async () => {
            client.sendFile(m.chat, json.data.url, unescape(decode(json.data.title)), '', m)
         })
      } catch (e) {
         console.log(e)
         client.reply(m.chat, Utils.jsonFormat(e), m)
      }
   },
   error: false,
   limit: true // الميزة تستهلك حداً من نقاط المستخدم
}
