import { format } from 'date-fns'

export const run = {
   usage: ['حالة_البوت'], // الاسم العربي الرئيسي الذي سيظهر في القائمة (حالة_البوت)
   hidden: ['botstat', 'stat', 'الحالة'], // الاختصارات المخفية لضمان عمل البوت إذا كُتبت بالإنجليزية أو العربية المبسطة
   category: 'إحصائيات', // الفئة المعربة لتنظيم قائمة الأوامر
   async: async (m, {
      client,
      blockList,
      setting,
      Utils
   }) => {
      try {
         const db = global.db
         const users = db.users.length
         const chats = db.chats.filter(v => v.jid?.endsWith('.net')).length
         const groups = Object.keys(await client.groupFetchAllParticipating()).length

         const banned = db.users.filter(v => v.banned).length
         const premium = db.users.filter(v => v.premium).length

         class Hit extends Array {
            total(key) {
               return this.reduce((sum, item) => sum + (item[key] || 0), 0)
            }
         }

         const hitData = new Hit(...Object.values(db.statistic))
         const hitstat = hitData.total('hitstat') || 0
         const stats = { users, chats, groups, banned, blocked: blockList.length, premium, hitstat, temp: await Utils.getFolderSize(`${process.cwd()}/temp`), uptime: Utils.toTime(process.uptime() * 1000) }
         const system = db.setting

         // إرسال رسالة الإحصائيات المدمجة بغلاف البوت الشخصي المعين في الإعدادات
         await client.sendMessageModify(m.chat, buildStatisticMessage(Utils, stats, system), m, {
            largeThumb: true,
            type: 'preview-link',
            ratio: 'landscape',
            thumbnail: Utils.isUrl(setting.cover) ? setting.cover : Buffer.from(setting.cover, 'base64')
         })
      } catch (error) {
         client.reply(m.chat, Utils.jsonFormat(error), m)
      }
   },
   error: false
}

// دالة بناء وتنسيق رسالة الإحصائيات باللغة العربية
const buildStatisticMessage = (Utils, stats, system) => {
   const formatCheck = val => Utils.texted('bold', val ? '[ √ ]' : '[ × ]')
   const formatNum = num => Utils.texted('bold', Utils.formatNumber(num))
   const formatSize = size => Utils.texted('bold', Utils.formatSize(size))
   const bold = text => Utils.texted('bold', text)

   const prefixText = system.multiprefix
      ? `( ${system.prefix.join(' ')} )`
      : `( ${system.onlyprefix} )`

   const resetAt = format(Date.now(), 'dd/MM/yy HH:mm')

   // ────── إحصائيات البوت (BOT STATS) ──────
   let botStats = ''
   botStats += `المجموعات المشتركة: ${formatNum(stats.groups)}\n`
   botStats += `المحادثات الخاصة: ${formatNum(stats.chats)}\n`
   botStats += `المستخدمين في القاعدة: ${formatNum(stats.users)}\n`
   botStats += `المستخدمين المحظورين: ${formatNum(stats.banned)}\n`
   botStats += `المستخدمين الممتنعين (بلوك): ${formatNum(stats.blocked)}\n`
   botStats += `الأعضاء المميزين (Premium): ${formatNum(stats.premium)}\n`
   botStats += `إجمالي الأوامر المستخدمة: ${formatNum(stats.hitstat)}\n`
   botStats += `حجم المجلد المؤقت (./temp): ${formatSize(stats.temp)}`
   if (system.style !== 2) botStats += `\nمدة التشغيل المستمر: ${bold(stats.uptime)}`

   // ────── إحصائيات النظام (SYSTEM STATS) ──────
   let systemStats = ''
   systemStats += `${formatCheck(system.autobackup)}  النسخ الاحتياطي التلقائي\n`
   systemStats += `${formatCheck(system.autodownload)}  التحميل التلقائي للميديا\n`
   systemStats += `${formatCheck(system.antispam)}  مضاد السبام (Anti-Spam)\n`
   systemStats += `${formatCheck(system.debug)}  وضع تصحيح الأخطاء (Debug)\n`
   systemStats += `${formatCheck(system.groupmode)}  وضع المجموعات فقط\n`
   systemStats += `${formatCheck(system.online)}  متصل دائماً (Always Online)\n`
   systemStats += `${formatCheck(system.notifier)}  إشعارات انتهاء الصلاحية\n`
   systemStats += `${formatCheck(system.self)}  الوضع الخاص (Self Mode)\n`
   systemStats += `${formatCheck(system.noprefix)}  التشغيل بدون بادئة\n`
   systemStats += `رموز البادئة الحالية (Prefix): ${bold(prefixText)}`
   if (system.style !== 2) systemStats += `\nتاريخ الفحص الحاضر: ${resetAt}`

   // ────── النمط المتقدم الثاني (Frame Boxed Style) ──────
   if (system.style === 2) {
      let result = ''
      result += `–  *إ حـصـا ئـيـا ت  ا لـبـو ت*\n\n`
      result += `┌  ◦  ${botStats.replace(/\n/g, '\n│  ◦  ')}\n`
      result += `└  ◦  مدة التشغيل المستمر: ${bold(stats.uptime)}\n\n`
      result += `–  *نـظـا م  ا لـتـشـغـيـل*\n\n`
      result += `┌  ◦  ${systemStats.replace(/\n/g, '\n│  ◦  ')}\n`
      result += `└  ◦  تاريخ الفحص الحاضر: ${resetAt}\n\n`
      result += `© DEV ABOODI OFFICIAL`
      return result.trim()
   }

   // ────── النمط الافتراضي البسيط (Default Style) ──────
   let result = ''
   result += `乂  *إ حـصـا ئـيـا ت  ا لـبـو ت*\n\n`
   result += `\t◦  ${botStats.replace(/\n/g, '\n\t◦  ')}\n\n`
   result += `乂  *نـظـا م  ا لـتـشـغـيـل*\n\n`
   result += `\t◦  ${systemStats.replace(/\n/g, '\n\t◦  ')}\n\n`
   result += `© DEV ABOODI OFFICIAL`
   return result.trim()
}
