import { models } from './models.js'
import init from './init.js'

export default (m, Config) => {
   // 1. التحقق من وجود المستخدم في قاعدة البيانات وتحديثه أو إنشائه
   let user = global.db.users.find(v => v.jid === m.sender)
   if (user) {
      // إذا كان المستخدم موجوداً، يتم دمج وتحديث خصائصه بالقيم الجديدة بأمان
      init.execute(user, models.users, {
         lid: m.isGroup ? m?.key?.participant : m.chat,
         name: m.pushName,
         limit: Config.limit
      })
   } else {
      // إذا كان مستخدماً جديداً، يتم إنشائه وإضافته لقاعدة البيانات بالنموذج الافتراضي
      global.db.users.push({
         jid: m.sender,
         lid: m.isGroup ? m?.key?.participant : m.chat,
         name: m.pushName,
         limit: Config.limit,
         ...(init.getModel(models?.users || {}))
      })
   }

   // 2. إذا كانت الرسالة قادمة من مجموعة، يتم التحقق من وجود المجموعة في قاعدة البيانات
   if (m.isGroup) {
      let group = global.db.groups.find(v => v.jid === m.chat)
      if (group) {
         init.execute(group, models.groups)
      } else {
         // تسجيل المجموعة الجديدة تلقائياً بخصائص الـ models الافتراضية (مثل منع الحذف وغيره)
         global.db.groups.push({
            jid: m.chat,
            ...(init.getModel(models?.groups || {}))
         })
      }
   }

   // 3. التحقق من الشات (المحادثة الحالية) لتحديث سجل آخر ظهور ونشاط
   let chat = global.db.chats.find(v => v.jid === m.chat)
   if (chat) {
      init.execute(chat, models.chats)
   } else {
      global.db.chats.push({
         jid: m.chat,
         ...(init.getModel(models?.chats || {}))
      })
   }

   // 4. التحقق من الإعدادات العامة للبوت (Settings) وضمان عدم تلفها
   if (!global.db.setting || Object.keys(global.db.setting).length === 0) {
      global.db.setting = init.getModel(models?.setting || {})
   } else {
      init.execute(global.db.setting, models.setting)
   }
}
