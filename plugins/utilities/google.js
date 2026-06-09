export const run = {
   usage: ['جوجل', 'بحث_صور'], // الأوامر العربية الرئيسية التي ستظهر في قائمة البوت
   hidden: ['google', 'goimg', 'بحث', 'صورة_جوجل'], // الاختصارات المخفية لضمان استجابة البوت باللغتين
   use: 'كلمة البحث المستهدفة',
   category: 'أدوات مـساعدة', // الفئة المعربة لتنظيم قائمة الأوامر العامة
   async: async (m, {
      client,
      text,
      isPrefix,
      command,
      Utils
   }) => {
      try {
         // التحقق من كتابة نص أو كلمة بحث بعد الأمر، وفي حال عدم إدخاله يتم عرض مثال توضيحي للمستخدم
         if (!text) return client.reply(m.chat, Utils.example(isPrefix, command, 'الذكاء الاصطناعي'), m)
         
         // إرسال تفاعل تفاعلي يفيد ببدء عملية البحث المعقدة
         client.sendReact(m.chat, '🕒', m.key)
         
         // 1. قسم البحث النصي العادي في جوجل (google)
         if (command == 'جوجل' || command == 'google') {
            const json = await Api.neoxr('/google', {
               q: text
            })
            if (!json.status) return client.reply(m.chat, global.status.fail, m)
            
            let teks = `乂  *بـحـث  جـو جـل  ا لـنـصـي*\n\n`
            json.data.map((v, i) => {
               teks += '*' + (i + 1) + '. ' + v.title + '*\n'
               teks += '	◦  *نبذة* : ' + v.description + '\n'
               teks += '	◦  *الرابط* : ' + v.url + '\n\n'
            })
            client.reply(m.chat, teks + `\n© DEV ABOODI OFFICIAL`, m)
            
         // 2. قسم جلب وإرسال الصور من محرك بحث جوجل (goimg)
         } else if (command == 'بحث_صور' || command == 'goimg') {
            const json = await Api.neoxr('/goimg', {
               q: text
            })
            if (!json.status) return client.reply(m.chat, global.status.fail, m)
            
            // حلقة تكرارية لاختيار وإرسال 5 صور عشوائية متوافقة مع شروط النظام
            for (let i = 0; i < 5; i++) {
               const index = Math.floor(json.data.length * Math.random())
               const url = json.data[index].url
               const fn = await Utils.getFile(url)
               
               // التحقق من سلامة رابط الصورة وتوافق صيغتها وامتدادها برمجياً
               if (!fn?.status || (fn?.status && !/image\/(png|jpe?g)/i.test(fn.mime))) continue
               
               let caption = `乂  *صـو ر  مـن  جـو جـل*\n\n`
               caption += `	◦ *العنوان* : ${json.data[index].origin.title}\n`
               caption += `	◦ *الأبعاد* : ${json.data[index].width} × ${json.data[index].height}\n\n`
               caption += `© DEV ABOODI OFFICIAL`
               
               client.sendFile(m.chat, url, '', caption, m)
               
               // تأخير زمني بمقدار 2.5 ثانية بين كل صورة لمنع حدوث سبام أو حظر للسيرفر
               await Utils.delay(2500)
            }
         }
      } catch (e) {
         client.reply(m.chat, Utils.jsonFormat(e), m)
      }
   },
   error: false,
   restrict: true,
   limit: true // تفعيل استهلاك نقاط الحد اليومي عند استخدام هذا الأمر
}
