export const run = {
   usage: ['إضافة_مطور', 'حذف_مطور', 'حذف_مميز', 'بلوك', 'إلغاء_البلوك', 'حظر', 'إلغاء_الحظر'], // الأوامر العربية الرئيسية المضافة للقائمة
   hidden: ['+owner', '-owner', '-prem', 'block', 'unblock', 'ban', 'unban', 'بان'], // الاختصارات المخفية لضمان عمل البوت كبدائل دائمًا
   use: 'إشارة (منشن) أو رد على المستخدم المستهدف',
   category: 'المطور', // الفئة المعربة لتنظيم قائمة أوامر المالك
   async: async (m, {
      client,
      text,
      command,
      Config,
      Utils
   }) => {
      try {
         // تحديد هوية المستخدم المستهدف سواء بالمنشن أو الرد أو كتابة الرقم نصياً
         const input = m?.mentionedJid?.[0] || m?.quoted?.sender || text
         if (!input) return client.reply(m.chat, Utils.texted('bold', `🚩 يرجى الإشارة (منشن) أو الرد على المستخدم المستهدف لتنفيذ الأمر.`), m)
         
         // التحقق من وجود الرقم على خوادم الواتساب
         const p = await client.onWhatsApp(input.trim())
         if (!p.length) return client.reply(m.chat, Utils.texted('bold', `🚩 هذا الرقم غير مسجل أو غير صالح على واتساب.`), m)
         
         const jid = client.decodeJid(p[0].jid)
         const number = jid.replace(/@.+/, '')

         // 1. قسم إضافة مطور جديد (+owner)
         if (command === 'إضافة_مطور' || command == '+owner') {
            let owners = global.db.setting.owners
            if (owners.includes(number)) return client.reply(m.chat, Utils.texted('bold', `🚩 المستهدف مضاف بالفعل كمالك/مطور في قائمة النظام مسبقاً.`), m)
            owners.push(number)
            client.reply(m.chat, Utils.texted('bold', `🚩 تم إضافة @${number} بنجاح إلى قائمة مطوري البوت.\n\n© DEV ABOODI OFFICIAL`), m)
            
         // 2. قسم حذف مطور (-owner)
         } else if (command === 'حذف_مطور' || command == '-owner') {
            let owners = global.db.setting.owners
            if (!owners.includes(number)) return client.reply(m.chat, Utils.texted('bold', `🚩 هذا الرقم غير موجود في قائمة المطورين بالأصل.`), m)
            owners.forEach((data, index) => {
               if (data === number) owners.splice(index, 1)
            })
            client.reply(m.chat, Utils.texted('bold', `🚩 تم إزالة @${number} من قائمة مطوري البوت بنجاح.`), m)
            
         // 3. قسم إلغاء التفعيل المميز (-prem)
         } else if (command === 'حذف_مميز' || command == '-prem') {
            let data = global.db.users.find(v => v.jid == jid)
            if (typeof data == 'undefined') return client.reply(m.chat, Utils.texted('bold', `🚩 تعذر العثور على بيانات هذا المستخدم في قاعدة البيانات.`), m)
            if (!data.premium) return client.reply(m.chat, Utils.texted('bold', `🚩 هذا الحساب ليس مشتركاً في النظام المميز حالياً.`), m)
            
            data.limit = Config.limit
            data.premium = false
            data.expired = 0
            client.reply(m.chat, Utils.texted('bold', `🚩 تم إلغاء الوضع المميز عن المستخدم @${jid.replace(/@.+/, '')} بنجاح وإعادته للوضع المجاني.`), m)
            
         // 4. قسم الحظر المباشر من رقم البوت (block)
         } else if (command === 'بلوك' || command == 'block') {
            if (jid == client.decodeJid(client.user.id)) return client.reply(m.chat, Utils.texted('bold', `🚩 لا يمكنك حظر رقم البوت نفسه!`), m)
            client.updateBlockStatus(jid, 'block').then(res => m.reply(Utils.jsonFormat(res)))
            
         // 5. قسم إلغاء الحظر المباشر (unblock)
         } else if (command === 'إلغاء_البلوك' || command == 'unblock') {
            client.updateBlockStatus(jid, 'unblock').then(res => m.reply(Utils.jsonFormat(res)))
            
         // 6. قسم الحظر البرمجي من استخدام البوت (ban)
         } else if (command === 'حظر' || command == 'ban' || command == 'بان') {
            let is_user = global.db.users
            let is_owner = [client.decodeJid(client.user.id).split`@`[0], Config.owner, ...global.db.setting.owners].map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net').includes(jid)
            
            if (!is_user.some(v => v.jid == jid)) return client.reply(m.chat, Utils.texted('bold', `🚩 لم يتم العثور على بيانات هذا المستخدم في السجلات لتنفيذ الحظر.`), m)
            if (is_owner) return client.reply(m.chat, Utils.texted('bold', `🚩 حماية النظام: لا يمكن حظر أرقام المطورين أو مالك البوت المعتمدين.`), m)
            if (jid == client.decodeJid(client.user.id)) return client.reply(m.chat, Utils.texted('bold', `🚩 لا يمكنك حظر البوت نفسه.`), m)
            if (is_user.find(v => v.jid == jid).banned) return client.reply(m.chat, Utils.texted('bold', `🚩 المستخدم محظور بالفعل من استخدام أوامر البوت.`), m)
            
            is_user.find(v => v.jid == jid).banned = true
            let banned = is_user.filter(v => v.banned).length
            client.reply(m.chat, `乂  *تـم ا لـحـظـر  بـنـجـا ح*\n\n*“تم إضافة العضو @${jid.split`@`[0]} بنجاح إلى قائمة المحظورين من استخدام البوت.”*\n\n*إجمالي المحظورين حالياً : ${banned}*\n\n© DEV ABOODI OFFICIAL`, m)
            
         // 7. قسم إلغاء الحظر البرمجي (unban)
         } else if (command === 'إلغاء_الحظر' || command == 'unban') {
            let is_user = global.db.users
            if (!is_user.some(v => v.jid == jid)) return client.reply(m.chat, Utils.texted('bold', `🚩 لم يتم العثور على بيانات هذا المستخدم في السجلات.`), m)
            if (!is_user.find(v => v.jid == jid).banned) return client.reply(m.chat, Utils.texted('bold', `🚩 هذا المستخدم نشط وليس محظوراً في الأصل.`), m)
            
            is_user.find(v => v.jid == jid).banned = false
            let banned = is_user.filter(v => v.banned).length
            client.reply(m.chat, `乂  *إ لـغـا ء  ا لـحـظـر*\n\n*“تم إزالة العضو @${jid.split`@`[0]} بنجاح من قائمة المحظورين وعاد لاستخدام البوت.”*\n\n*المتبقين في الحظر : ${banned}*\n\n© DEV ABOODI OFFICIAL`, m)
         }
      } catch (e) {
         client.reply(m.chat, Utils.jsonFormat(e), m)
      }
   },
   error: false,
   owner: true // الأداة إدارية ومغلقة للمطور فقط لحماية البوت ومستخدميه
}
