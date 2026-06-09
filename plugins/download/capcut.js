export const run = {
   usage: ['تحميل_كابكات'], // تم تعريب الأمر ليظهر في قائمة البوت باسم (تحميل_كابكات)
   hidden: ['cc', 'capcut'],
   use: 'الرابط',
   category: 'التحميلات', // تم تعريب الفئة لتنظيم القائمة باللغة العربية
   async: async (m, {
      client,
      args,
      isPrefix,
      command,
      Utils
   }) => {
      try {
         // التحقق من إدخال الرابط
         if (!args || !args[0]) return client.reply(m.chat, Utils.example(isPrefix, command, 'https://www.capcut.com/watch/...'), m)
         
         // إرسال تفاعل (إيموجي الانتظار)
         client.sendReact(m.chat, '🕒', m.key)
         
         // استدعاء واجهة برمجة التطبيقات لتحميل مقطع كاب كات
         const json = await Api.neoxr('/capcut', {
            url: args[0]
         })
         
         if (!json.status) return client.reply(m.chat, Utils.jsonFormat(json), m)
         
         // إرسال ملف الفيديو مع الوصف الخاص به وتثبيت حقوقك البرمجية
         client.sendFile(m.chat, json.data.url, 'capcut.mp4', `${json.data.caption || ''}\n\n© DEV ABOODI OFFICIAL`, m)
      } catch (e) {
         console.log(e)
         return client.reply(m.chat, Utils.jsonFormat(e), m)
      }
   },
   error: false,
   limit: true // الميزة تستهلك حداً من نقاط المستخدم
}
