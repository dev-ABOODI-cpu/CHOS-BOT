import { format } from 'date-fns'

export const run = {
   usage: ['معلومات_القروب'], // الاسم العربي الرئيسي الذي سيظهر في القائمة
   hidden: ['groupinfo', 'gcinfo', 'معلومات'], // الاختصارات المخفية لضمان عمل البوت إذا كُتبت بالإنجليزية أو العربية المختصرة
   category: 'المجموعات', // الفئة المعربة لتنظيم قائمة الأوامر
   async: async (m, {
      client,
      participants,
      groupSet: setting,
      Utils
   }) => {
      try {
         // جلب البيانات الوصفية والأساسية للمجموعة من خوادم واتساب
         const meta = await (await client.groupMetadata(m.chat))
         const creator = (meta?.owner?.endsWith('lid') ? (meta?.ownerJid ?? meta?.ownerPn) : meta.owner)?.replace(/@.+/, '')
         const admin = client.getAdmin(meta.participants)
         const member = participants.map(u => u.id)
         const picture = await client.profilePicture(m.chat)
         
         // صياغة تفاصيل ومعلومات المجموعة بالعربية
         let caption = `乂  *مـعـلـومـات الـمـجـمـوعـة*\n\n`
         caption += `	◦  *الاسم* : ${meta.subject}\n`
         caption += `	◦  *الأعضاء* : ${member.length}\n`
         caption += `	◦  *المشرفين* : ${admin.length}\n`
         caption += `	◦  *تاريخ الإنشاء* : ${format(meta.creation * 1000, 'dd/MM/yy HH:mm:ss')}\n`
         caption += `	◦  *المالك المستضيف* : ${creator ? '@' + creator : '-'}\n\n`
         
         // صياغة واجهة ميزات الحماية والإشراف التلقائي (Moderation)
         caption += `乂  *إعـدادات الـحـمـايـة والـتـحـكـم*\n\n`
         caption += `	◦  ${Utils.switcher(setting.antidelete, '[ √ ]', '[ × ]')} مضاد الحذف (Anti-Delete)\n`
         caption += `	◦  ${Utils.switcher(setting.antilink, '[ √ ]', '[ × ]')} مضاد الروابط (Anti-Link)\n`
         caption += `	◦  ${Utils.switcher(setting.antivirtex, '[ √ ]', '[ × ]')} مضاد الفيروسات (Anti-Virtex)\n`
         caption += `	◦  ${Utils.switcher(setting.filter, '[ √ ]', '[ × ]')} تصفية الكلمات والنصوص\n`
         caption += `	◦  ${Utils.switcher(setting.antitagsw, '[ √ ]', '[ × ]')} مضاد تاغات الحالات\n`
         caption += `	◦  ${Utils.switcher(setting.autosticker, '[ √ ]', '[ × ]')} الملصقات التلقائية\n`
         caption += `	◦  ${Utils.switcher(setting.left, '[ √ ]', '[ × ]')} رسائل المغادرة\n`
         caption += `	◦  ${Utils.switcher(setting.localonly, '[ √ ]', '[ × ]')} الأرقام المحلية فقط\n`
         caption += `	◦  ${Utils.switcher(setting.viewonce, '[ √ ]', '[ × ]')} كاشف رسائل المرة الواحدة\n`
         caption += `	◦  ${Utils.switcher(setting.welcome, '[ √ ]', '[ × ]')} رسائل الترحيب بالأعضاء\n\n`
         
         // صياغة واجهة حالة البوت الحالية داخل المجموعة
         caption += `乂  *حـالـة الـبـوت فـي الـمـجـمـوعـة*\n\n`
         caption += `	◦  *الوضع الصامت (Muted)* : ${Utils.switcher(setting.mute, 'تفعيل √', 'تعطيل ×')}\n`
         caption += `	◦  *البقاء الدائم (Stay)* : ${Utils.switcher(setting.stay, 'تفعيل √', 'تعطيل ×')}\n`
         caption += `	◦  *تاريخ الانتهاء* : ${setting.expired == 0 ? 'غير محدد (دائم)' : Utils.timeReverse(setting.expired - new Date * 1)}\n\n`
         caption += `© DEV ABOODI OFFICIAL`
         
         // إرسال بطاقة المعلومات كاملة ومربعة مدمجة بصورة المجموعة الشخصية
         client.sendMessageModify(m.chat, caption, m, {
            largeThumb: true,
            type: 'preview-link',
            ratio: 'square',
            thumbnail: picture
         })
      } catch (e) {
         client.reply(m.chat, Utils.jsonFormat(e), m)
      }
   },
   group: true // الميزة تعمل حصرياً داخل المجموعات
}
