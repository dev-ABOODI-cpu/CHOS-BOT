export const run = {
   async: async (m, {
      client,
      body,
      groupSet,
      Utils
   }) => {
      try {
         // التحقق مما إذا كانت الرسالة ليست من البوت نفسه، وهناك نص برميجي تم إرساله
         // والتحقق مما إذا كانت ميزة مكافحة الفيروسات مفعلة، والنص يطابق رموز التعليق أو يتجاوز طوله 10,000 حرف
         if (!m.fromMe && body && (groupSet.antivirtex && body.match(/(Check|৭৭৭৭৭৭৭৭|๒๒๒๒๒๒๒๒|๑๑๑๑๑๑๑๑|ดุท้่เึางืผิดุท้่เึางื)/gi) || groupSet.antivirtex && body.length > 10000)) {
            
            // أولاً: حذف رسالة الفيروس المزعجة فوراً لحماية هواتف الأعضاء من التعليق
            return client.sendMessage(m.chat, {
               delete: {
                  remoteJid: m.chat,
                  fromMe: false,
                  id: m.key.id,
                  participant: m.sender
               }
            }).then(() => {
               // ثانياً: طرد العضو المخالف الذي أرسل نص التعليق من المجموعة
               client.groupParticipantsUpdate(m.chat, [m.sender], 'remove')
            })
         }
      } catch (e) {
         // إرسال تفاصيل الخطأ في حال حدوث مشكلة برمجية أثناء التنفيذ
         return client.reply(m.chat, Utils.jsonFormat(e), m)
      }
   },
   error: false,
   group: true, // الميزة مخصصة لحماية المجموعات فقط
   botAdmin: true // تتطلب الميزة أن يكون البوت مشرفاً لضمان صلاحية الحذف والطرد
}
