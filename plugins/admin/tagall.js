export const run = {
   usage: ['الجميع'], // تم تعريب الأمر ليظهر في قائمة البوت باسم (الجميع)
   hidden: ['tagall'],
   use: 'النص (اختياري)',
   category: 'أدوات المشرفين', // تم تعريب الفئة لتنظيم القائمة باللغة العربية
   async: async (m, {
      client,
      text,
      participants,
      Utils
   }) => {
      try {
         // جلب جميع معرفات الأعضاء المتواجدين في المجموعة حالياً
         let member = participants.map(v => v.id)
         
         // كود مخصص لإنشاء خاصية "قراءة المزيد" وفصل قائمة الأسماء عن نص الرسالة الأساسي
         let readmore = String.fromCharCode(8206).repeat(4001)
         
         // صياغة الرسالة الافتراضية في حال لم يكتب المشرف نصاً معيناً بعد الأمر
         let groupName = await (await client.groupMetadata(m.chat)).subject
         let message = (!text) ? `مرحباً بالجميع، قام أحد المشرفين بالإشارة إليكم في مجموعة [ ${groupName} ]` : text
         
         // إرسال الإشارة الجماعية لجميع الأعضاء مع دمج الحقوق البرمجية الخاصة بك
         client.reply(m.chat, `乂  *إشـارة جـمـاعـيـة إلـى الـجـمـيـع*\n\n*“${message}”*\n\n© DEV ABOODI OFFICIAL${readmore}\n${member.map(v => '◦  @' + v.replace(/@.+/, '')).join('\n')}`, m)
      } catch (e) {
         console.log(e)
         return client.reply(m.chat, Utils.jsonFormat(e), m)
      }
   },
   admin: true, // يتطلب أن يكون المستخدم مشرفاً لتنفيذ الإشارة الجماعية
   group: true // يعمل داخل المجموعات فقط
}
