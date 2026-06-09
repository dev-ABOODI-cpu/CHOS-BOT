export const run = {
   usage: ['بينتريست'], // الاسم العربي الرئيسي الذي سيظهر في القائمة (بينتريست)
   hidden: ['pinterest', 'صور_بينتريست', 'بنتريست'], // الاختصارات المخفية لضمان عمل البوت كبدائل دائماً
   use: 'كلمة البحث عن الصورة',
   category: 'أدوات مـساعدة', // الفئة المعربة لتنظيم قائمة الأوامر العامة
   async: async (m, {
      client,
      text,
      isPrefix,
      command,
      Utils
   }) => {
      try {
         // التحقق من كتابة نص بعد الأمر، وفي حال عدم إدخاله يتم عرض مثال توضيحي للمستخدم
         if (!text) return client.reply(m.chat, Utils.example(isPrefix, command, `طبيعة`), m)
         
         // إرسال تفاعل تفاعلي يفيد ببدء عملية الجلب
         client.sendReact(m.chat, '🕒', m.key)
         
         let old = new Date()
         
         // إرسال طلب البحث إلى خادم الصور برمجياً
         const json = await Api.neoxr('/pinterest', {
            q: text
         })
         if (!json.status) return client.reply(m.chat, global.status.fail, m)
         
         // حلقة تكرارية لاختيار وإرسال 3 صور عشوائية من نتائج البحث
         for (let i = 0; i < 3; i++) {
            var rand = Math.floor(json.data.length * Math.random())
            
            let caption = `🍟 *سرعة الجلب* : ${((new Date() - old) * 1)} م.ث\n\n© DEV ABOODI OFFICIAL`
            client.sendFile(m.chat, json.data[rand], 'pinterest.png', caption, m)
            
            // تأخير زمني بمقدار ثانيتين بين كل صورة لمنع حدوث سبام أو حظر الرقم
            await Utils.delay(2000)
         }
      } catch (e) {
         console.log(e)
         return client.reply(m.chat, Utils.jsonFormat(e), m)
      }
   },
   error: false,
   limit: true, // تفعيل استهلاك نقاط الحد اليومي لحماية موارد النظام
   restrict: true
}
