export const run = {
   usage: ['دخول_قروب'], // الاسم العربي الرئيسي الذي سيظهر في القائمة (دخول_قروب)
   hidden: ['join', 'انضمام', 'ادخل'], // الاختصارات المخفية لضمان عمل البوت إذا كُتبت بالإنجليزية أو العربية البديلة
   use: 'رابط مجموعة الواتساب',
   category: 'المطور', // الفئة المعربة لتنظيم قائمة أوامر المالك
   async: async (m, {
      client,
      args,
      isPrefix,
      command,
      Utils
   }) => {
      try {
         // التحقق من إدخال رابط بعد الأمر، وفي حال عدم إدخاله يتم إرسال مثال توضيحي للمطور
         if (!args || !args[0]) return client.reply(m.chat, Utils.example(isPrefix, command, 'https://chat.whatsapp.com/codeInvite'), m)
         
         // فحص الرابط واستخراج كود الدعوة المكون من 20 إلى 24 رمزاً
         let link = /chat.whatsapp.com\/([0-9A-Za-z]{20,24})/i
         let [_, code] = args[0].match(link) || []
         if (!code) return client.reply(m.chat, global.status.invalid, m)
         
         // محاولة انضمام البوت للمجموعة عبر الكود المستخرج
         let id = await client.groupAcceptInvite(code)
         if (!id.endsWith('g.us')) return client.reply(m.chat, Utils.texted('bold', `🚩 عذراً، لا يمكنني الانضمام إلى هذه المجموعة.`), m)
         
         let member = await (await client.groupMetadata(id)).participants.map(v => v.id)
         return client.reply(m.chat, `🚩 تم الانضمام إلى المجموعة بنجاح!\n\n© DEV ABOODI OFFICIAL`, m)
      } catch {
         // التعامل مع الأخطاء في حال كان الرابط منتهياً أو تعرض البوت للطرد سابقاً
         return client.reply(m.chat, Utils.texted('bold', `🚩 عذراً، تعذر الانضمام للمجموعة. قد يكون الرابط غير صالح أو ممتلئ.`), m)
      }
   },
   owner: true // الميزة محمية ومخصصة لمالك ومطور البوت فقط لحمايته من السبام
}
