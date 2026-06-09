export const run = {
   // تعريب مصفوفة الأوامر لتظهر بالكامل في قائمة البوت بالعربية
   usage: ['حذف_مضاد', 'روابط_مضاد', 'فيروسات_مضاد', 'تاق_مضاد', 'ملصق_تلقائي', 'عرض_مرة', 'المغادرة', 'التصفية', 'محلي_فقط', 'الترحيب'],
   use: 'تشغيل / ايقاف',
   category: 'أدوات المشرفين', // تعريب الفئة لتنظيم القائمة
   async: async (m, {
      client,
      args,
      isPrefix,
      command,
      isBotAdmin,
      Utils
   }) => {
      try {
         let setting = global.db.groups.find(v => v.jid == m.chat)
         
         // قاموس داخلي لربط الأمر العربي بالمفتاح البرمجي المناسب في قاعدة البيانات
         const commandMap = {
            'حذف_مضاد': 'antidelete',
            'روابط_مضاد': 'antilink',
            'فيروسات_مضاد': 'antivirtex',
            'تاق_مضاد': 'antitagsw',
            'ملصق_تلقائي': 'autosticker',
            'عرض_مرة': 'viewonce',
            'المغادرة': 'left',
            'التصفية': 'filter',
            'محلي_فقط': 'localonly',
            'الترحيب': 'welcome'
         }
         
         let type = commandMap[command.toLowerCase()]
         if (!type) return
         
         // التحقق من صلاحيات المشرف للبوت عند تشغيل ميزات الحماية الحساسة
         if (!isBotAdmin && /antilink|antivirtex|filter|localonly|antitagsw/.test(type)) return client.reply(m.chat, global.status.botAdmin, m)
         
         // التحقق من إدخال وسيط التشغيل أو الإيقاف
         if (!args || !args[0]) return client.reply(m.chat, `🚩 *الوضعية الحالية للميزة* [ ${command} ] هي : [ ${setting[type] ? 'مفعلة ✅' : 'معطلة ❌'} ]\n\nيرجى كتابة (تشغيل) أو (ايقاف) بعد الأمر.`, m)
         
         let option = args[0].toLowerCase()
         let optionList = ['تشغيل', 'ايقاف']
         if (!optionList.includes(option)) return client.reply(m.chat, `🚩 *الوضعية الحالية للميزة* [ ${command} ] هي : [ ${setting[type] ? 'مفعلة ✅' : 'معطلة ❌'} ]\n\nيرجى كتابة (تشغيل) أو (ايقاف) بعد الأمر.`, m)
         
         let status = option != 'تشغيل' ? false : true
         
         // إذا كانت الحالة المطلوبة مطابقة للحالة الحالية بالفعل
         if (setting[type] == status) return client.reply(m.chat, Utils.texted('bold', `🚩 ميزة [ ${command} ] تم ${option == 'تشغيل' ? 'تفعيلها' : 'تعطيلها'} مسبقاً بالفعل في هذه المجموعة.`), m)
         
         // حفظ الإعداد الجديد في قاعدة البيانات
         setting[type] = status
         client.reply(m.chat, Utils.texted('bold', `✅ تم ${option == 'تشغيل' ? 'تفعيل' : 'تعطيل'} ميزة [ ${command} ] بنجاح للمجموعة.\n\n© DEV ABOODI OFFICIAL`), m)
      } catch (e) {
         return client.reply(m.chat, Utils.jsonFormat(e), m)
      }
   },
   admin: true, // يتطلب أن يكون المستخدم مشرفاً لتعديل الإعدادات
   group: true // يعمل داخل المجموعات فقط
}
