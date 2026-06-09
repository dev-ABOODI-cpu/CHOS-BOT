export const run = {
   usage: ['تحميل_ثريدز'], // الاسم العربي الرئيسي الذي سيظهر في القائمة
   hidden: ['threads'], // الاختصار المخفي لضمان عمل البوت إذا كُتب بالإنجليزية
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
         if (!args || !args[0]) return client.reply(m.chat, Utils.example(isPrefix, command, 'https://www.threads.net/...'), m)
         
         // إرسال تفاعل (إيموجي الانتظار)
         client.sendReact(m.chat, '🕒', m.key)
         let old = new Date()
         
         // استدعاء واجهة برمجة التطبيقات لجلب الملفات من الرابط
         const json = await Api.neoxr('/threads', {
            url: args[0]
         })
         
         if (!json.status) return client.reply(m.chat, Utils.jsonFormat(json), m)
         
         // الدوران حول الملفات الناتجة وإرسالها بناءً على نوعها (فيديو أو صورة)
         for (let v of json.data) {
            // تحديد الامتداد تلقائياً بناءً على نوع الملف المسترجع (mp4 للفيديو أو jpg للصورة)
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
