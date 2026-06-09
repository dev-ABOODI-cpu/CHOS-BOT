export const run = {
   usage: ['إضافة_كلمة', 'حذف_كلمة'], // الأوامر العربية الرئيسية لإدارة قائمة الكلمات
   hidden: ['+toxic', '-toxic', 'حظر_كلمة', 'الغاء_حظر_كلمة'], // الاختصارات المخفية لضمان عمل البوت كبدائل دائماً
   use: 'الكلمة المراد التحكم بها',
   category: 'المطور', // الفئة المعربة لتنظيم قائمة أوامر المالك
   async: async (m, {
      client,
      args,
      isPrefix,
      command,
      Utils
   }) => {
      try {
         // 1. قسم إضافة كلمة جديدة إلى قائمة المحظورات (+toxic)
         if (command === 'إضافة_كلمة' || command == '+toxic') {
            if (!args || !args[0]) return client.reply(m.chat, Utils.example(isPrefix, command, 'كلمة_سيئة'), m)
            
            if (global.db.setting.toxic.includes(args[0])) return client.reply(m.chat, Utils.texted('bold', `🚩 الكلمة [ ${args[0]} ] موجودة بالفعل في قائمة المحظورات مسبقاً.`), m)
            
            global.db.setting.toxic.push(args[0])
            // إعادة ترتيب الكلمات أبجدياً لتسريع عمليات الفحص البرمجي
            global.db.setting.toxic.sort(function(a, b) {
               if (a < b) return -1;
               if (a > b) return 1;
               return 0
            })
            client.reply(m.chat, Utils.texted('bold', `🚩 تم إضافة الكلمة [ ${args[0]} ] بنجاح إلى قائمة الكلمات المحظورة في البوت.\n\n© DEV ABOODI OFFICIAL`), m)
            
         // 2. قسم إزالة كلمة من قائمة المحظورات (-toxic)
         } else if (command === 'حذف_كلمة' || command == '-toxic') {
            if (!args || !args[0]) return client.reply(m.chat, Utils.example(isPrefix, command, 'كلمة_سيئة'), m)
            
            // حماية النظام من تفريغ المصفوفة بالكامل
            if (global.db.setting.toxic.length < 2) return client.reply(m.chat, Utils.texted('bold', `🚩 حماية: لا يمكن حذف المزيد من الكلمات، يجب الإبقاء على كلمة واحدة على الأقل في قاعدة البيانات لضمان عمل نظام الفلترة.`), m)
            if (!global.db.setting.toxic.includes(args[0])) return client.reply(m.chat, Utils.texted('bold', `🚩 الكلمة [ ${args[0]} ] غير موجودة في قائمة المحظورات بالأصل.`), m)
            
            // البحث عن الكلمة وحذفها من المصفوفة
            global.db.setting.toxic.forEach((data, index) => {
               if (data === args[0]) global.db.setting.toxic.splice(index, 1)
            })
            client.reply(m.chat, Utils.texted('bold', `🚩 تم إزالة الكلمة [ ${args[0]} ] من قائمة المحظورات بنجاح، وأصبحت مسموحة الآن.`), m)
         }
      } catch (e) {
         console.log(e)
         return client.reply(m.chat, global.status.error, m)
      }
   },
   error: false,
   owner: true // الميزة مغلقة وصالحة للمطور الرئيسي فقط للحفاظ على معايير الرقابة داخل المجموعات
}
