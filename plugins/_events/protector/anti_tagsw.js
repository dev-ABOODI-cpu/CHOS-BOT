export const run = {
   async: async (m, {
      client,
      groupSet,
      isAdmin,
      Utils
   }) => {
      try {
         // التحقق مما إذا كانت ميزة مكافحة الإشارة الشاملة مفعلة، والمرسل ليس مشرفاً، والرسالة تستهدف الإشارة للجميع
         if (groupSet.antitagsw && !isAdmin && /groupStatusMentionMessage/.test(m.mtype)) {
            
            // أولاً: طرد العضو المخالف من المجموعة مباشرة
            return client.groupParticipantsUpdate(m.chat, [m.sender], 'remove').then(() => {
               
               // ثانياً: حذف رسالة الإشارة المزعجة من الشات لحماية الأعضاء
               client.sendMessage(m.chat, {
                  delete: {
                     remoteJid: m.chat,
                     fromMe: false,
                     id: m.key.id,
                     participant: m.sender
                  }
               })
            })
         }
      } catch (e) {
         // إرسال تقرير الخطأ البرمجي في حال حدوث مشكلة أثناء التنفيذ
         return client.reply(m.chat, Utils.jsonFormat(e), m)
      }
   },
   error: false,
   group: true, // الميزة مخصصة للعمل داخل المجموعات فقط
   botAdmin: true // تتطلب الميزة صلاحية المشرف للبوت لضمان القدرة على الطرد والحذف
}
