import { format } from 'date-fns'
import { models } from '../../lib/models.js'

export const run = {
   usage: ['المجموعات'], // الاسم العربي الرئيسي الذي سيظهر في القائمة (المجموعات)
   hidden: ['groups', 'القروبات', 'قائمة_القروبات'], // الاختصارات المخفية لضمان عمل البوت بالإنجليزية أو العربية البديلة
   category: 'إحصائيات', // الفئة المعربة لتنظيم قائمة الأوامر
   async: async (m, {
      client,
      isPrefix,
      Utils
   }) => {
      let group = global.db.groups
      if (!group) group = []

      // جلب جميع المجموعات المشتركة من خوادم واتساب
      const participatingGroups = Object.values(await client.groupFetchAllParticipating())

      const groupDetails = participatingGroups.map((_group, i) => {
         const { id, subject, participants } = _group
         let entry = group.find(g => g.jid === id)

         if (entry) {
            // صياغة حالة الصلاحية باللغة العربية
            const expiryStatus = entry.stay ? 'دائم (FOREVER)' : (entry.expired == 0 ? 'غير محدد' : '' + Utils.timeReverse(entry.expired - new Date() * 1))
            const memberCount = `${participants.length} عضو`
            const muteStatus = entry.mute ? 'مكتوم 🔕' : 'نشط 🔔'
            const lastActivity = format(Date.now(), 'dd/MM/yy HH:mm:ss')

            return (
               `›  *${i + 1}.* ${subject}\n` +
               `   *ID القروب* : ${id.split('@')[0]}\n` +
               `   الحالة: ${expiryStatus} | العدد: ${memberCount} | الوضع: ${muteStatus} | تحديث: ${lastActivity}`
            )
         } else {
            // إضافة المجموعة تلقائياً لقاعدة البيانات إذا كانت جديدة
            const newEntry = {
               jid: id,
               ...models.groups
            }
            group.push(newEntry)

            return (
               `›  *${i + 1}.* ${subject}\n` +
               `   *ID القروب* : ${id.split('@')[0]}\n` +
               `   *✅ مجموعة جديدة - تم إضافتها لقاعدة البيانات، ستظهر تفاصيلها في الفحص القادم.*`
            )
         }
      }).join('\n\n')

      // بناء نص الواجهة الإحصائية الكاملة بالعربية مع حقوقك
      let caption = `乂  *قـائـمـة الـمـجـمـوعـات ا لـمـشـتـركـة*\n\n`
      caption += `*“يشترك البوت حالياً في ${participatingGroups.length} مجموعة، أرسل _${isPrefix}إعدادات_القروب_ لعرض خيارات التحكم المتاحة.”*\n\n`
      caption += groupDetails
      caption += `\n\n© DEV ABOODI OFFICIAL`

      m.reply(caption)
   },
   error: false
}
