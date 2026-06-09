export const run = {
   usage: ['رابط_القروب'], // الاسم العربي الرئيسي الذي سيظهر في القائمة (رابط_القروب)
   hidden: ['link', 'getlink', 'الرابط'], // الاختصارات المخفية لضمان عمل البوت إذا كُتبت بالإنجليزية أو العربية المبسطة
   category: 'المجموعات', // الفئة المعربة لتنظيم قائمة الأوامر
   async: async (m, {
      client
   }) => {
      // جلب رمز الدعوة من النظام ودمجه وصياغته مع النص العربي والحقوق
      const inviteCode = await client.groupInviteCode(m.chat)
      const replyMessage = `🔗 *رابط الدعوة للمجموعة:* \nhttps://chat.whatsapp.com/${inviteCode}\n\n© DEV ABOODI OFFICIAL`
      
      await client.reply(m.chat, replyMessage, m)
   },
   group: true, // الميزة تعمل حصرياً داخل المجموعات
   botAdmin: true // يشترط أن يكون البوت مشرفاً (Admin) ليتكمن من استخراج الرابط
}
