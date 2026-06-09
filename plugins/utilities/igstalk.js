export const run = {
   usage: ['معلومات_انستا'], // الاسم العربي الرئيسي الذي سيظهر في القائمة
   hidden: ['igstalk', 'انستا_فحص', 'بروفايل_انستا'], // الاختصارات المخفية لضمان عمل البوت كبدائل دائماً
   use: 'اسم المستخدم (Username)',
   category: 'أدوات مـساعدة', // الفئة المعربة لتنظيم قائمة الأوامر العامة
   async: async (m, {
      client,
      args,
      isPrefix,
      command,
      Utils
   }) => {
      try {
         // التحقق من كتابة اسم المستخدم بعد الأمر، وفي حال عدم إدخاله يتم عرض مثال توضيحي
         if (!args || !args[0]) return client.reply(m.chat, Utils.example(isPrefix, command, 'cristiano'), m)
         
         // إرسال تفاعل الانتظار لبدء جلب البيانات من الخادم
         client.sendReact(m.chat, '🕒', m.key)
         
         // استدعاء البيانات البرمجية للحساب المستهدف
         const json = await Api.neoxr('/igstalk', {
         	username: args[0]
         })
         
         // التحقق من وجود الحساب وصحة اسم المستخدم
         if (!json.status) return client.reply(m.chat, Utils.texted('bold', `🚩 عذراً، لم يتم العثور على هذا الحساب. تأكد من كتابة الاسم بشكل صحيح.`), m)
         
         // بناء واجهة تقرير بيانات حساب إنستغرام بالعربية
         let caption = `乂  *مـعـلـو مـا ت  حـسـا ب  إ نـسـتـغـر ا م*\n\n`
         caption += `	◦  *الاسم المكتوب* : ${json.data.name}\n`
         caption += `	◦  *اسم المستخدم* : @${json.data.username}\n`
         caption += `	◦  *عدد المنشورات* : ${json.data.post}\n`
         caption += `	◦  *المتابعون (Followers)* : ${json.data.follower}\n`
         caption += `	◦  *المتابَعون (Following)* : ${json.data.following}\n`
         caption += `	◦  *السيرة الذاتية (Bio)* : ${json.data.about || '-'}\n`
         caption += `	◦  *حساب خاص (Private)* : ${Utils.switcher(json.data.private, 'نعم  ✅', 'لا  ❌')}\n\n`
         caption += `© DEV ABOODI OFFICIAL`
         
         // إرسال البيانات مدمجة مع الصورة الشخصية للحساب المستهدف
         client.sendFile(m.chat, json.data.photo, 'profile.png', caption, m)
      } catch (e) {
         return client.reply(m.chat, Utils.jsonFormat(e), m)
      }
   },
   error: false,
   limit: true // تفعيل استهلاك النقاط لضمان الاستخدام العادل للسيرفر
}
