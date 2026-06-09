export const run = {
   // قائمة الأوامر العربية الرئيسية المضافة للتحكم في خصائص النظام
   usage: [
      'نسخ_تلقائي', 
      'تحميل_تلقائي', 
      'مضاد_السبام', 
      'وضع_التصحيح', 
      'وضع_المجموعات', 
      'البادئات_المتعددة', 
      'بدون_بادئة', 
      'متصل_دائما', 
      'الوضع_الخاص', 
      'نظام_الإشعارات'
   ],
   // الاختصارات الإنجليزية لضمان عدم تعطل النظام الأساسي واستجابة البوت للجميع
   hidden: [
      'autobackup', 
      'autodownload', 
      'antispam', 
      'debug', 
      'groupmode', 
      'multiprefix', 
      'noprefix', 
      'online', 
      'self', 
      'notifier'
   ],
   use: 'تشغيل / إيقاف',
   category: 'المطور', // الفئة المعربة لتنظيم قائمة أوامر المالك
   async: async (m, {
      client,
      args,
      isPrefix,
      command,
      Utils
   }) => {
      let system = global.db.setting
      let type = command.toLowerCase()

      // خريطة برمجية لربط الأوامر العربية بالمتغيرات الإنجليزية الأصلية في قاعدة البيانات
      const commandMap = {
         'نسخ_تلقائي': 'autobackup',
         'تحميل_تلقائي': 'autodownload',
         'مضاد_السبام': 'antispam',
         'وضع_التصحيح': 'debug',
         'وضع_المجموعات': 'groupmode',
         'البادئات_المتعددة': 'multiprefix',
         'بدون_بادئة': 'noprefix',
         'متصل_دائما': 'online',
         'الوضع_الخاص': 'self',
         'نظام_الإشعارات': 'notifier'
      }

      // تحديد المفتاح البرمجي الصحيح سواء تم استخدام الأمر بالعربية أو بالإنجليزية
      let dbKey = commandMap[type] || type

      // التحقق من إدخال خيار التشغيل أو الإيقاف بعد الأمر
      if (!args || !args[0]) {
         return client.reply(m.chat, `🚩 *الحالة الحالية للميزة* : [ ${system[dbKey] ? 'مُفعّلة ✅' : 'مُعطّلة ❌'} ]\n\nيرجى كتابة ( *تشغيل* ) أو ( *إيقاف* ) بعد الأمر لتعديل الحالة.`, m)
      }

      let option = args[0].toLowerCase()
      let optionList = ['on', 'off', 'تشغيل', 'ايقاف', 'إيقاف']
      if (!optionList.includes(option)) {
         return client.reply(m.chat, `🚩 *الحالة الحالية للميزة* : [ ${system[dbKey] ? 'مُفعّلة ✅' : 'مُعطّلة ❌'} ]\n\nيرجى كتابة ( *تشغيل* ) أو ( *إيقاف* ) بعد الأمر لتعديل الحالة.`, m)
      }

      // تحديد الحالة المنطقية الجديدة بناءً على الإدخال
      let status = (option === 'on' || option === 'تشغيل')

      // التحقق مما إذا كانت الحالة المطلوبة مطابقة للحالة الحالية بالفعل من قبل
      if (system[dbKey] === status) {
         return client.reply(m.chat, Utils.texted('bold', `🚩 هذه الميزة [ ${command} ] مجهزة ومعدلة على هذه الحالة مسبقاً في قاعدة البيانات.`), m)
      }

      // تحديث الحالة في قاعدة البيانات وإرسال إشعار النجاح
      system[dbKey] = status
      let statusWord = status ? 'تفعيلها بنجاح 🟢' : 'إيقاف تشغيلها بنجاح 🔴'
      
      client.reply(m.chat, Utils.texted('bold', `🚩 تم تحديث الميزة [ ${command} ] وتغيير حالتها إلى: ${statusWord}\n\n© DEV ABOODI OFFICIAL`), m)
   },
   owner: true // الأداة إدارية بحتة ومخصصة لمالك السيرفر لحماية وظائف البوت
}
