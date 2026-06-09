export const run = {
   usage: ['كتم'], // تعريب مصفوفة الأمر
   use: '0 / 1',
   category: 'أدوات المشرفين', // تعريب الفئة
   async: async (m, {
      client,
      args,
      Utils
   }) => {
      let gc = global.db.groups.find(v => v.jid == m.chat)
      let opt = [0, 1]
      
      // إذا لم يتم إدخال خيار أو تم إدخال رقم غير 0 أو 1
      if (!args || !args[0] || !opt.includes(parseInt(args[0]))) return client.reply(m.chat, `🚩 *الوضع الحالي للبوت* : [ ${gc.mute ? 'مكتوم 🔕' : 'نشط 🔔'} ]\n\nيرجى إدخال (*1* لتفعيل الكتم) أو (*0* لإلغاء الكتم).`, m)
      
      // تفعيل كتم البوت
      if (parseInt(args[0]) == 1) {
         if (gc.mute) return client.reply(m.chat, Utils.texted('bold', `🚩 البوت مكتوم بالفعل في هذه المجموعة سابقاً.`), m)
         gc.mute = true
         client.reply(m.chat, Utils.texted('bold', `✅ تم كتم البوت بنجاح في هذه المجموعة.\n\n© DEV ABOODI OFFICIAL`), m)
         
      // إلغاء كتم البوت
      } else if (parseInt(args[0]) == 0) {
         if (!gc.mute) return client.reply(m.chat, Utils.texted('bold', `🚩 البوت نشط بالفعل وغير مكتوم.`), m)
         gc.mute = false
         client.reply(m.chat, Utils.texted('bold', `✅ تم إلغاء كتم البوت وإعادته للعمل بنجاح.\n\n© DEV ABOODI OFFICIAL`), m)
      }
   },
   admin: true, // يتطلب أن يكون المستخدم مشرفاً لتنفيذ الأمر
   group: true // يعمل داخل المجموعات فقط
}
