export const run = {
   usage: ['تحميل_انستا'], // الاسم العربي الرئيسي الذي سيظهر في القائمة
   hidden: ['ig', 'igdl'], // الاختصارات المخفية لضمان عمل البوت إذا كُتبت بالإنجليزية
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
         if (!args || !args[0]) return client.reply(m.chat, Utils.example(isPrefix, command, 'https://www.instagram.com/p/CK0tLXyAzEI'), m)
         
         // التحقق من صحة رابط إنستغرام باستخدام التعبير النمطي (Regex)
         if (!args[0].match(/(https:\/\/www.instagram.com)/gi)) return client.reply(m.chat, global.status.invalid, m)
         
         // إرسال تفاعل (إيموجي الانتظار)
         client.sendReact(m.chat, '🕒', m.key)
         let old = new Date()
         
         // استدعاء واجهة برمجة التطبيقات لجلب الملفات من الرابط بعد إصلاحه
         const json = await Api.neoxr('/ig', {
            url: Utils.igFixed(args[0])
         })
         
         if (!json.status) return client.reply(m.chat, Utils.jsonFormat(json), m)
         
         // الدوران حول الملفات الناتجة وإرسالها بناءً على نوعها (فيديو أو صورة)
         for (let v of json.data) {
            // تحديد الامتداد بناءً على نوع الملف المسترجع من الـ API
            client.sendFile(m.chat, v.url, v.type == 'mp4' ? Utils.filename('mp4') : Utils.filename('jpg'), `🍟 *مدة الجلب* : ${((new Date - old) * 1)} م.ث\n\n© DEV ABOODI OFFICIAL`, m)
            
            // تأخير زمني بسيط بين إرسال الملفات لتجنب حظر البوت (Spam)
            await Utils.delay(1500)
         }
      } catch (e) {
         console.log(e)
         return client.reply(m.chat, Utils.jsonFormat(e), m)
      }
   },
   error: false,
   limit: true // الميزة تستهلك حداً من نقاط المستخدم
}
