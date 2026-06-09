export const run = {
   usage: ['الأجانب'], // تم تعريب الأمر ليظهر في قائمة البوت باسم (الأجانب)
   use: '(خيارات)',
   category: 'أدوات المشرفين', // تم تعريب الفئة لتنظيم القائمة باللغة العربية
   async: async (m, {
      client,
      args,
      isPrefix,
      command,
      participants,
      Utils
   }) => {
      try {
         // فحص الأعضاء غير المشرفين واستبعاد الأرقام المحلية (مثل التي تبدأ بـ 62) واستبعاد البوت نفسه
         let member = participants.filter(v => !v.admin).map(v => v.id).filter(v => !v.startsWith('62') && v != client.decodeJid(client.user.id))
         
         // الحالة الأولى: استعراض قائمة الأرقام الأجنبية الموجودة دون طردها
         if (!args || !args[0]) {
            if (member.length == 0) return client.reply(m.chat, Utils.texted('bold', `🚩 هذه المجموعة نظيفة تماماً ولا تحتوي على أرقام أجنبية غريبة.`), m)
            
            let teks = `🔍 تم العثور على (*${member.length}*) عضو بأرقام أجنبية، لتصفيتهم وطردهم أرسل الأمر التالي: *${isPrefix + command} -y*\n\n`
            teks += member.map(v => '◦  @' + v.replace(/@.+/, '')).join('\n')
            teks += `\n\n© DEV ABOODI OFFICIAL`
            client.reply(m.chat, teks, m)
            
         // الحالة الثانية: تفعيل أمر الطرد الجماعي للأرقام التي تم رصدها عند كتابة الخيار -y
         } else if (args[0] == '-y') {
            for (let jid of member) {
               await Utils.delay(2000) // وضع فاصل زمني ثانبيتن بين كل عملية طرد لتجنب حظر البوت
               await client.groupParticipantsUpdate(m.chat, [jid], 'remove')
            }
            await client.reply(m.chat, Utils.texted('bold', `✅ تم الأمر بنجاح، تم طرد ${member.length} من الأعضاء الأجانب خارج المجموعة.\n\n© DEV ABOODI OFFICIAL`), m)
         }
      } catch (e) {
         client.reply(m.chat, Utils.jsonFormat(e), m)
      }
   },
   admin: true, // يتطلب أن يكون المستخدم مشرفاً لتنفيذ الأمر
   group: true, // يعمل داخل المجموعات فقط
   botAdmin: true // يتطلب أن يكون البوت مشرفاً ليتمكن من تنفيذ الطرد الجماعي
}
