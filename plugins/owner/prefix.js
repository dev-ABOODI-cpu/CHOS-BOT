export const run = {
   usage: ['البادئة', 'إضافة_بادئة', 'حذف_بادئة'], // الأوامر العربية الرئيسية للتحكم في بادئات الأوامر
   hidden: ['prefix', '+prefix', '-prefix', 'بريفكس'], // الاختصارات المخفية لضمان عمل البوت كبدائل دائمًا
   use: 'الرمز (مثل: # أو .)',
   category: 'المطور', // الفئة المعربة لتنظيم قائمة أوامر المالك
   async: async (m, {
      client,
      args,
      isPrefix,
      command,
      Utils,
      Config
   }) => {
      let system = global.db.setting
      
      // 1. قسم تعيين البادئة الأساسية (prefix)
      if (command === 'البادئة' || command === 'prefix') {
         if (!args || !args[0]) return client.reply(m.chat, Utils.example(isPrefix, command, '#'), m)
         
         // حماية النظام: منع استخدام الرموز البرمجية الحساسة المسببة للأخطاء
         if (Config.evaluate_chars.includes(args[0])) return client.reply(m.chat, Utils.texted('bold', `🚩 لا يمكن استخدام الرمز [ ${args[0]} ] كبادئة لتجنب حدوث أخطاء برمجية في النظام.`), m)
         if (args[0] == system.prefix) return client.reply(m.chat, Utils.texted('bold', `🚩 الرمز [ ${args[0]} ] هو البادئة المستخدمة حالياً بالفعل.`), m)
         
         system.onlyprefix = args[0]
         client.reply(m.chat, Utils.texted('bold', `🚩 تم تغيير بادئة البوت الأساسية بنجاح إلى : ${args[0]}\n\n© DEV ABOODI OFFICIAL`), m)
         
      // 2. قسم إضافة بادئة إضافية (+prefix)
      } else if (command === 'إضافة_بادئة' || command === '+prefix') {
         if (!args || !args[0]) return client.reply(m.chat, Utils.example(isPrefix, command, '#'), m)
         
         if (Config.evaluate_chars.includes(args[0])) return client.reply(m.chat, Utils.texted('bold', `🚩 لا يمكن إضافة الرمز [ ${args[0]} ] كبادئة بسبب قيود حماية النظام.`), m)
         if (system.prefix.includes(args[0])) return client.reply(m.chat, Utils.texted('bold', `🚩 الرمز [ ${args[0]} ] موجود بالفعل في قائمة البادئات المسجلة مسبقاً.`), m)
         
         system.prefix.push(args[0]) // إضافة الرمز للمصفوفة
         client.reply(m.chat, Utils.texted('bold', `🚩 تم إضافة البادئة الجديدة [ ${args[0]} ] بنجاح لتفعيل الأوامر.\n\n© DEV ABOODI OFFICIAL`), m)
         
      // 3. قسم حذف بادئة مسجلة (-prefix)
      } else if (command === 'حذف_بادئة' || command === '-prefix') {
         if (!args || !args[0]) return client.reply(m.chat, Utils.example(isPrefix, command, '#'), m)
         
         // التحقق من عدم تفريغ كافة البادئات لضمان استجابة البوت للأوامر مستقبلاً
         if (system.prefix.length < 2) return client.reply(m.chat, Utils.texted('bold', `🚩 حماية: لا يمكن حذف المزيد من البادئات، يجب الإبقاء على بادئة واحدة على الأقل تعمل بالنظام.`), m)
         if (!system.prefix.includes(args[0])) return client.reply(m.chat, Utils.texted('bold', `🚩 الرمز [ ${args[0]} ] غير موجود في قائمة بادئات قاعدة البيانات بالأصل.`), m)
         
         // إزالة الرمز المستهدف من المصفوفة
         system.prefix.forEach((data, index) => {
            if (data === args[0]) system.prefix.splice(index, 1)
         })
         client.reply(m.chat, Utils.texted('bold', `🚩 تم حذف وإلغاء البادئة [ ${args[0]} ] من النظام بنجاح.\n\n© DEV ABOODI OFFICIAL`), m)
      }
   },
   owner: true // الأداة إدارية ومغلقة للمطور فقط لحماية واجهة استدعاء البوت
}
