export const run = {
   usage: ['الاصنام'], // تم تعريب الأمر ليظهر في قائمة البوت باسم (الاصنام)
   use: '(خيارات)',
   category: 'أدوات المشرفين', // تم تعريب الفئة لتنظيم القائمة باللغة العربية
   async: async (m, {
      client,
      args,
      isPrefix,
      command,
      participants,
      isBotAdmin,
      Utils
   }) => {
      try {
         const member = participants.filter(v => !v.admin).map(v => v.id)
         const day = 86400000 * 7 // تعيين مهلة الغياب (7 أيام بالمللي ثانية)
         const now = new Date() * 1
         let sider1 = [], sider2 = []
         const group = global.db.groups.find(x => x.jid === m.chat)
         
         member.filter(v => group.member[v]).map(v => sider1.push({
            jid: v,
            ...group.member[v]
         }))
         member.filter(v => !group.member[v]).map(v => sider2.push(v))
         
         const lastseen = sider1.filter(v => v.lastseen).sort((a, b) => a.lastseen - b.lastseen).filter(x => x.lastseen > 0).filter(x => now - x.lastseen > day).filter(x => x.jid != client.decodeJid(client.user.id))
         
         // [الحالة الأولى]: تفعيل أمر الطرد الجماعي للأعضاء غير النشطين عند كتابة الخيار -y
         if (args && args[0] == '-y') {
            if (!isBotAdmin) return client.reply(m.chat, global.status.botAdmin, m)
            let arr = lastseen.map(v => v.jid).concat(sider2)
            if (arr.length == 0) return client.reply(m.chat, Utils.texted('bold', `🚩 لا يوجد أعضاء غير متفاعلين (أصنام) في هذه المجموعة حالياً.`), m)
            
            for (let jid of arr) {
               await Utils.delay(2000) // فاصل زمني ثانبيتن لحماية حساب البوت من الحظر
               await client.groupParticipantsUpdate(m.chat, [jid], 'remove')
            }
            await client.reply(m.chat, Utils.texted('bold', `✅ تم الأمر بنجاح، تم تنظيف المجموعة وطرد ${arr.length} من الأعضاء غير النشطين.\n\n© DEV ABOODI OFFICIAL`), m)
            
         // [الحالة الثانية]: استعراض قائمة الأعضاء الأصنام وتفاصيل غيابهم دون طرد
         } else {
            if (sider2.length == 0 && lastseen.length == 0) return client.reply(m.chat, Utils.texted('bold', `🚩 لا يوجد أعضاء غير متفاعلين (أصنام) في هذه المجموعة حالياً.`), m)
            
            let teks = `乂  *كـشـف الأصـنـام و الـغـائـبـيـن*\n\n`
            teks += sider2.length == 0 ? '' : `« قائمة الأعضاء عديمي التفاعل والنشاط تماماً (*${sider2.length}*) »\n\n`
            teks += sider2.length == 0 ? '' : sider2.map(v => '	◦  @' + v.replace(/@.+/, '')).join('\n') + '\n\n'
            
            teks += lastseen.length == 0 ? '' : `« قائمة الأعضاء المنقطعين عن التفاعل منذ أسبوع (*${lastseen.length}*) »\n\n`
            teks += lastseen.length == 0 ? '' : lastseen.map(v => '	◦  @' + v.jid.replace(/@.+/, '') + '\n	     *آخر ظهور وتفاعل* : منذ ' + Utils.toDate(now - v.lastseen).split('D')[0] + ' أيام').join('\n') + '\n\n'
            
            teks += `⚠️ *ملاحظة* : تكون هذه الميزة دقيقة تماماً عندما يقضي البوت أسبوعاً كاملاً داخل المجموعة برصد البيانات.\n\n`
            teks += `💡 لطرد جميع هؤلاء الأعضاء دفعة واحدة أرسل: *${isPrefix + command} -y*`
            teks += `\n\n© DEV ABOODI OFFICIAL`
            client.reply(m.chat, teks, m)
         }
      } catch (e){
         client.reply(m.chat, Utils.jsonFormat(e), m)
      }
   },
   error: false,
   admin: true, // يتطلب أن يكون المستخدم مشرفاً لتشغيل الفحص
   group: true // يعمل داخل المجموعات فقط
}
