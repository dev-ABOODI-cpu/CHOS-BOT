import path from 'path'

export const run = {
   usage: ['تفعيل_ملف', 'تعطيل_ملف'], // الأوامر العربية الرئيسية للتحكم في الملفات البرمجية بالكامل
   hidden: ['plugen', 'plugdis', 'تشغيل_ملف', 'ايقاف_ملف'], // الاختصارات المخفية لضمان عمل البوت كبدائل دائمًا
   use: 'اسم ملف الإضافة (بدون .js)',
   category: 'المطور', // الفئة المعربة لتنظيم قائمة أوامر المالك
   async: async (m, {
      client,
      args,
      isPrefix,
      command,
      ctx,
      setting,
      Utils
   }) => {
      const [pluginName] = args
      // التحقق من إدخال اسم الملف المستهدف، وفي حال عدم إدخاله يتم عرض مثال توضيحي للمطور
      if (!pluginName) return client.reply(m.chat, Utils.example(isPrefix, command, 'tiktok'), m)

      // جلب وفرز أسماء كافة ملفات الإضافات الحالية من النظام
      let plugins = Object.keys(ctx.plugins).map(dir => path.basename(dir, '.js'))
      const regex = new RegExp(pluginName, 'i')

      // 1. قسم إيقاف وتعطيل ملف الإضافة بالكامل (plugdis)
      if (command === 'تعطيل_ملف' || command === 'plugdis') {
         const matched = plugins.filter(p => regex.test(p))

         if (matched.length === 0) return client.reply(m.chat, Utils.texted('bold', `🚩 لم يتم العثور على ملف الإضافة [ ${pluginName}.js ] في النظام.`), m)

         let disabledCount = 0
         for (const name of matched) {
            if (!setting.pluginDisable.includes(name)) {
               setting.pluginDisable.push(name)
               disabledCount++
            }
         }

         if (disabledCount === 0) return client.reply(m.chat, Utils.texted('bold', `🚩 جميع الملفات المطابقة معطلة بالفعل في قاعدة البيانات.`), m)

         client.reply(m.chat, Utils.texted('bold', `🚩 تم تعطيل وإيقاف [ ${disabledCount} ] ملف إضافة بنجاح.\n\n© DEV ABOODI OFFICIAL`), m)
         
      // 2. قسم إعادة تشغيل وتفعيل ملف الإضافة (plugen)
      } else if (command === 'تفعيل_ملف' || command === 'plugen') {
         const before = setting.pluginDisable.length

         setting.pluginDisable = setting.pluginDisable.filter(p => !regex.test(p))

         const after = setting.pluginDisable.length
         const enabledCount = before - after

         if (enabledCount === 0) return client.reply(m.chat, Utils.texted('bold', `🚩 لم يتم العثور على أي ملف مطابق داخل قائمة الملفات المعطلة.`), m)

         client.reply(m.chat, Utils.texted('bold', `🚩 تم إعادة تفعيل وتشغيل [ ${enabledCount} ] ملف إضافة بنجاح.\n\n© DEV ABOODI OFFICIAL`), m)
      }
   },
   owner: true // الميزة محمية ومخصصة لمالك ومطور البوت فقط لحماية ملفات السيرفر
}
