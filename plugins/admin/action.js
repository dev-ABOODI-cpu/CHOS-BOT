export const run = {
   usage: ['اضف', 'ترقية', 'تنزيل', 'طرد'], // تم تعريب المصفوفة هنا لتتوافق مع الأوامر العربية
   use: 'إشارة أو رد',
   category: 'أدوات المشرفين', // تم تعريب الفئة هنا
   async: async (m, {
      client,
      text,
      command,
      Utils
   }) => {
      try {
         const args = (m?.mentionedJid?.[0] || m?.quoted?.sender || text)?.trim()
         if (!args) return client.reply(m.chat, Utils.texted('bold', `🚩 يرجى عمل إشارة (Tag) أو الرد على رسالة الشخص المستهدف.`), m)
         let jid = args.endsWith('lid') ? args : null
         if (!jid) {
            const result = await client.onWhatsApp(args)
            if (!result.length) throw new Error('رقم الهاتف هذا غير مسجل في الواتساب أو غير صحيح.')
            jid = client.decodeJid(result[0].jid)
         }
         const member = await client.getJidFromParticipants(m.chat, jid)
         
         // معالجة أوامر الطرد والترقية والتنزيل (بناءً على الأوامر المعربة الجديدة)
         if (['طرد', 'ترقية', 'تنزيل'].includes(command)) {
            if (!member) return client.reply(m.chat, Utils.texted('bold', `🚩 الشخص المستهدف غادر المجموعة بالفعل أو غير موجود بها.`), m)
            
            // تحويل الأمر المعرب إلى الإجراء المناسب في السيرفر
            let action = command === 'طرد' ? 'remove' : command === 'ترقية' ? 'promote' : 'demote'
            const [json] = await client.groupParticipantsUpdate(m.chat, [member.id], action)
            
            if (json.status === '200') {
               let actionText = command === 'طرد' ? 'طرده بنجاح 🚪' : command === 'ترقية' ? 'ترقيته إلى مشرف بنجاح ⭐' : 'تنزيل رتبته إلى عضو عادي بنجاح 📉'
               return m.reply(Utils.texted('bold', `✅ العضو @${member.id?.replace(/@.+/, '')} تم ${actionText}\n\n© DEV ABOODI OFFICIAL`))
            }
            throw new Error('فشلت العملية، تأكد من صلاحيات البوت.')
            
         // معالجة أمر الإضافة المباشرة للمجموعة
         } else if (command === 'اضف') {
            if (member) return client.reply(m.chat, Utils.texted('bold', `🚩 العضو @${member.id?.replace(/@.+/, '')} موجود بالفعل داخل هذه المجموعة.`), m)
            const [json] = await client.groupParticipantsUpdate(m.chat, [jid], 'add')
            if (json.status === '200') return m.reply(Utils.texted('bold', `✅ تم إضافة @${jid?.replace(/@.+/, '')} إلى المجموعة بنجاح.\n\n© DEV ABOODI OFFICIAL`))
            throw new Error('تعذر إضافة العضو، قد تكون إعدادات الخصوصية لديه تمنع الإضافة المباشرة.')
         }
      } catch (e) {
         m.reply(Utils.texted('bold', `❌ خطأ: ${e.message}`))
      }
   },
   group: true,
   admin: true,
   botAdmin: true
}
