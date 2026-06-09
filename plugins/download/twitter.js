export const run = {
   usage: ['تحميل_تويتر'], // الاسم العربي الرئيسي الذي سيظهر في القائمة
   hidden: ['twitter', 'tw', 'twdl'], // الاختصارات المخفية لضمان عمل البوت إذا كُتبت بالإنجليزية
   use: 'الرابط',
   category: 'التحميلات', // الفئة المعربة لتنظيم قائمة الأوامر
   async: async (m, {
      client,
      args,
      isPrefix,
      command,
      Utils
   }) => {
      try {
         // التحقق من وجود رابط في المدخلات
         if (!args || !args[0]) return client.reply(m.chat, Utils.example(isPrefix, command, 'https://x.com/...'), m)
         
         // التحقق من صحة رابط منصة إكس/تويتر باستخدام التعبير النمطي (Regex)
         if (!args[0].match(/(x.com|twitter.com)/gi)) return client.reply(m.chat, global.status.invalid, m)
         
         // إرسال تفاعل (إيموجي الانتظار)
         client.sendReact(m.chat, '🕒', m.key)
         
         // استدعاء واجهة برمجة التطبيقات لجلب الملفات من الرابط
         const json = await Api.neoxr('/twitter', {
            url: args[0]
         })
         let old = new Date()
         
         if (!json.status) return client.reply(m.chat, Utils.jsonFormat(json), m)
         
         // الدوران حول الملفات الناتجة وإرسالها بناءً على نوعها
         for (let v of json.data) {
            // إذا كان الملف صورة (jpg) أو مقطع فيديو (mp4)
            if (/jpg|mp4/.test(v.type)) {
               client.sendFile(m.chat, v.url, `file.${v.type}`, '© DEV ABOODI OFFICIAL', m)
               
            // إذا كان الملف عبارة عن صيغة متحركة (gif) يتم إرساله كفيديو متحرك داخل الواتساب
            } else if (/gif/.test(v.type)) {
               client.sendFile(m.chat, v.url, 'file.mp4', '© DEV ABOODI OFFICIAL', m, {
                  gif: true
               })
            }
         }
      } catch (e) {
         console.log(e)
         return client.reply(m.chat, Utils.jsonFormat(e), m)
      }
   },
   error: false,
   limit: true // M الميزة تستهلك حداً من نقاط المستخدم
}
