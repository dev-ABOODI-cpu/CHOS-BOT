export const run = {
   usage: ['تعطيل_امر', 'تفعيل_امر'], // الأوامر العربية الرئيسية المضافة للقائمة للتحكم بالأوامر الأخرى
   hidden: ['disable', 'enable', 'ايقاف_امر', 'تشغيل_امر'], // الاختصارات المخفية لضمان عمل البوت بالإنجليزية أو البدائل العربية
   use: 'اسم الأمر المراد التحكم به',
   category: 'المطور', // الفئة المعربة لتنظيم قائمة أوامر المالك
   async: async (m, {
      client,
      args,
      isPrefix,
      command,
      plugins,
      setting: cmd,
      Utils
   }) => {
      // التحقق من إدخال اسم الأمر المستهدف بعد كتابة دالة التحكم
      if (!args || !args[0]) return client.reply(m.chat, Utils.example(isPrefix, command, 'تيك_توك'), m)
      
      // جلب وفرز كافة الأوامر والوسوم الأساسية والمخفية المسجلة داخل ملفات البوت
      const parser = Utils.arrayJoin(Object.values(Object.fromEntries(Object.entries(plugins).filter(([name, prop]) => prop.run.usage))))
      const commands = Utils.arrayJoin(parser.map(v => v.run.usage).concat(parser.map(v => v.run.hidden)))
      
      // التحقق مما إذا كان الأمر المستهدف موجوداً بالفعل في النظام
      if (!commands.includes(args[0])) return client.reply(m.chat, Utils.texted('bold', `🚩 الأمر [ ${isPrefix + args[0]} ] غير موجود في سجلات البوت الحالية.`), m)
      
      // 1. قسم إيقاف وتعطيل الأمر (disable)
      if (command === 'تعطيل_امر' || command === 'disable') {
         if (cmd.error.includes(args[0])) return client.reply(m.chat, Utils.texted('bold', `🚩 الأمر [ ${isPrefix + args[0]} ] معطل بالفعل في قاعدة البيانات مسبقاً.`), m)
         
         cmd.error.push(args[0]) // إضافة الأمر لقائمة الإيقاف
         client.reply(m.chat, Utils.texted('bold', `🚩 تم تعطيل وإيقاف الأمر [ ${isPrefix + args[0]} ] بنجاح.\n\n© DEV ABOODI OFFICIAL`), m)
         
      // 2. قسم إعادة تشغيل وتفعيل الأمر (enable)
      } else if (command === 'تفعيل_امر' || command === 'enable') {
         if (!cmd.error.includes(args[0])) return client.reply(m.chat, Utils.texted('bold', `🚩 الأمر [ ${isPrefix + args[0]} ] نشط حالياً وليس في قائمة الأوامر المعطلة.`), m)
         
         // إزالة الأمر من مصفوفة الإيقاف لإعادة تفعيله
         cmd.error.forEach((data, index) => {
            if (data === args[0]) cmd.error.splice(index, 1)
         })
         client.reply(m.chat, Utils.texted('bold', `🚩 تم إعادة تفعيل وتشغيل الأمر [ ${isPrefix + args[0]} ] بنجاح.\n\n© DEV ABOODI OFFICIAL`), m)
      }
   },
   owner: true // الميزة محمية ومخصصة لمالك البوت فقط لتجنب التلاعب بالنظام
}
