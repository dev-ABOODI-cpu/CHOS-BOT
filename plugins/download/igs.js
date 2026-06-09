export const run = {
   usage: ['ستوري_انستا'], // الاسم العربي الرئيسي الذي سيظهر في القائمة
   hidden: ['igs', 'igstory'], // الاختصارات المخفية لضمان عمل البوت إذا كُتبت بالإنجليزية
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
         if (!args || !args[0]) return client.reply(m.chat, Utils.example(isPrefix, command, 'https://instagram.com/stories/...'), m)
         
         // إرسال تفاعل (إيموجي الانتظار)
         client.sendReact(m.chat, '🕒', m.key)
         let old = new Date()
         
         // استدعاء واجهة برمجة التطبيقات لجلب بيانات الستوري
         const json = await Api.neoxr('/ig-fetch', {
            url: args[0]
         })
         
         if (!json.status) return client.reply(m.chat, global.status.fail, m)
         
         // الدوران حول الملفات الناتجة وإرسالها (صور أو فيديو)
         for (let v of json.data) {
            const file = await Utils.getFile(v.url)
            
            // إرسال الملف مع حساب الوقت المستغرق وتثبيت حقوقك البرمجية
            client.sendFile(m.chat, v.url, Utils.filename(/mp4|bin/.test(file.extension) ? 'mp4' : 'jpg'), `🍟 *مدة الجلب* : ${((new Date - old) * 1)} م.ث\n\n© DEV ABOODI OFFICIAL`, m)
            
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
