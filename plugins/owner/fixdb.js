import { models } from '../../lib/models.js'

export const run = {
   usage: ['إصلاح_القاعدة'], // الاسم العربي الرئيسي الذي سيظهر في القائمة (إصلاح_القاعدة)
   hidden: ['fixdb', 'اصلاح_الداتا', 'تحديث_البيانات'], // الاختصارات المخفية لضمان عمل البوت إذا كُتبت بالإنجليزية أو العربية البديلة
   category: 'المطور', // الفئة المعربة لتنظيم قائمة أوامر المالك
   async: async (m, {
      Utils
   }) => {
      try {
         // دالة فحص ما إذا كان العنصر كائنًا (Object) وليس مصفوفة
         const isObject = (item) => (item && typeof item === 'object' && !Array.isArray(item))

         // الدالة التكرارية العميقة لمقارنة البيانات الحالية بالنماذج الافتراضية وسد النقص
         const validate = (target, source) => {
            if (!target || !source) return
            for (const key in source) {
               if (isObject(source[key])) {
                  if (!target[key] || !isObject(target[key])) {
                     target[key] = JSON.parse(JSON.stringify(source[key]))
                  } else {
                     validate(target[key], source[key])
                  }
               } else {
                  if (typeof target[key] === 'undefined' || target[key] === null) {
                     target[key] = source[key]
                  }
               }
            }
         }

         // بدء فحص ومزامنة كافة جداول قاعدة البيانات (مستخدمين، ألعاب، مجموعات، شات، إعدادات)
         if (Array.isArray(global.db.users)) global.db.users.forEach(u => validate(u, models.users))
         if (Array.isArray(global.db.players)) global.db.players.forEach(p => validate(p, models.players))
         if (Array.isArray(global.db.groups)) global.db.groups.forEach(g => validate(g, models.groups))
         if (Array.isArray(global.db.chats)) global.db.chats.forEach(c => validate(c, models.chats))
         if (global.db.setting) validate(global.db.setting, models.setting)

         // صياغة رسالة تأكيد المزامنة باللغة العربية
         let pr = `✅ *تمت مزامنة وإصلاح قاعدة البيانات بنجاح* :\n\n`
         pr += `┌  ◦  المستخدمين المعالجين : ${global.db.users?.length || 0}\n`
         pr += `│  ◦  المجموعات المحدثة : ${global.db.groups?.length || 0}\n`
         pr += `│  ◦  المحادثات الخاصة : ${global.db.chats?.length || 0}\n`
         pr += `└  ◦  إعدادات النظام : تم التحديث والترميم\n\n`
         pr += `© DEV ABOODI OFFICIAL`

         m.reply(pr)
      } catch (e) {
         console.error(e)
         return m.reply(Utils.jsonFormat(e))
      }
   },
   owner: true // الميزة محمية ومخصصة لمالك البوت فقط لحماية البيانات الحساسة
}
