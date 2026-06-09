export const run = {
   async: async (m, {
      client,
      isAdmin,
      isOwner,
      Utils
   }) => {
      try {
         // التحقق مما إذا كان المرسل ليس المالك وليس مشرفاً
         // وإذا تجاوز عدد الإشارات (Mentions) في الرسالة الواحدة 10 أعضاء، أو تم استخدام إشارات وهمية/مخفية
         if (!isOwner && !isAdmin && (m.mentionedJid.length > 10 || m.message?.[m.mtype || 'none']?.contextInfo?.nonJidMentions)) {
            
            // طرد العضو المخالف فوراً من المجموعة لمنع الإزعاج والسبام
            return client.groupParticipantsUpdate(m.chat, [m.sender], 'remove')
         }
      } catch (e) {
         // في حال حدوث أي خطأ برميجي يتم إرساله للمطور لتصحيحه
         return client.reply(m.chat, Utils.jsonFormat(e), m)
      }
   },
   error: false,
   group: true, // ميزة مخصصة للعمل داخل المجموعات فقط
   botAdmin: true // تتطلب الميزة أن يكون البوت مشرفاً ليتمكن من تنفيذ أمر الطرد
}
