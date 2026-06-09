export const run = {
   usage: ['إخفاء_فئة', 'إظهار_فئة'], // الأوامر العربية الرئيسية المضافة للقائمة للتحكم بظهور الفئات
   hidden: ['+hide', '-hide', 'اخفاء_قسم', 'اظهار_قسم'], // الاختصارات المخفية لضمان عمل البوت بالإنجليزية أو البدائل العربية
   use: 'اسم الفئة المستهدفة',
   category: 'المطور', // الفئة المعربة لتنظيم قائمة أوامر المالك
   async: async (m, {
      client,
      text,
      prefix,
      command,
      setting,
      ctx,
      Utils
   }) => {
      try {
         // جلب فرز تلقائي لجميع الفئات المسجلة في ملفات النظام لمنع الأخطاء البرمجية
         const categories = [...new Set(Object.values(Object.fromEntries(Object.entries(ctx.plugins).filter(([name, prop]) => prop.run.category))).map(v => v.run.category))]
         
         // التحقق من إدخال اسم الفئة المراد التحكم بها بعد كتابة الأمر
         if (!text) return client.reply(m.chat, Utils.example(prefix, command, 'ألعاب'), m)
         
         const targetCategory = text.toLowerCase().trim()
         if (!categories.includes(targetCategory)) return client.reply(m.chat, Utils.texted('bold', `🚩 الفئة [ ${text} ] غير موجودة في سجلات النظام الحالية.`), m)
         
         // 1. قسم إخفاء الفئة من القائمة (+hide)
         if (command === 'إخفاء_فئة' || command == '+hide') {
            if (setting.hidden.includes(targetCategory)) return client.reply(m.chat, Utils.texted('bold', `🚩 الفئة [ ${text} ] مخفية بالفعل مسبقاً في قاعدة البيانات.`), m)
            
            setting.hidden.push(targetCategory) // إضافة الفئة لقائمة الإخفاء
            client.reply(m.chat, Utils.texted('bold', `🚩 تم إخفاء الفئة [ ${text} ] من قائمة الأوامر بنجاح.\n\n© DEV ABOODI OFFICIAL`), m)
            
         // 2. قسم إلغاء إخفاء الفئة وإعادة إظهارها (-hide)
         } else if (command === 'إظهار_فئة' || command == '-hide') {
            if (!setting.hidden.includes(targetCategory)) return client.reply(m.chat, Utils.texted('bold', `🚩 الفئة [ ${text} ] ظاهرة حالياً وليست مدرجة في قائمة الإخفاء.`), m)
            
            // إزالة الفئة من مصفوفة الإخفاء لإعادة تفعيل ظهورها
            setting.hidden.forEach((data, index) => {
               if (data === targetCategory) setting.hidden.splice(index, 1)
            })
            client.reply(m.chat, Utils.texted('bold', `🚩 تم إزالة الفئة [ ${text} ] من قائمة الإخفاء وإعادتها للقائمة بنجاح.\n\n© DEV ABOODI OFFICIAL`), m)
         }
      } catch (e) {
         client.reply(m.chat, Utils.jsonFormat(e), m)
      }
   },
   owner: true // الأداة محمية ومخصصة لمالك البوت فقط لحماية هيكلة النظام
}
