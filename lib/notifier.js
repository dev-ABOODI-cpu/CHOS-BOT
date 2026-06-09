import { Utils } from '@neoxr/wb'

export default class Notifier {
   /**
    * تهيئة فئة إرسال التنبيهات والتحقق من الاشتراكات.
    * @param {object} client - كائن العميل (المشغل) المستخدم لإرسال الرسائل والتفاعل مع المجموعات.
    * @param {boolean} [verbose=false] - خيار لتفعيل طباعة سجلات الأحداث التفصيلية في الكونسول.
    */
   constructor(client, verbose = false) {
      this.client = client
      this.verbose = verbose
      this.recurringIntervalId = null
      this._checkingPremium = false
   }

   /**
    * دالة غير متزامنة للتحقق من انتهاء اشتراكات المستخدمين المميزين وفترات إيجار المجموعات.
    * تقوم بإرسال تنبيهات للمستخدمين أو المجموعات المتأثرة بقرب الانتهاء، وتتخذ إجراءات آلية عند الانتهاء الفعلي.
    * تستخدم علامة حماية برمجية دقيقة (`_checkingPremium`) لمنع التداخل والتشغيل المتزامن المتكرر.
    * @private
    */
   async _checkPremiumAndRent() {
      if (this._checkingPremium) return
      this._checkingPremium = true

      try {
         const data = global.db
         const now = Date.now()
         const day = 86400000 // عدد الميليزاوند في اليوم الواحد لتسهيل العملية الحسابية

         // 1. فرز وفحص المستخدمين المميزين (Premium)
         const premiumUsers = (data.users || [])
            .filter(v => v.premium)
            .sort((a, b) => a.expired - b.expired)

         for (const user of premiumUsers) {
            const timeLeft = user.expired - now
            const daysLeft = Math.ceil(timeLeft / day)

            // إرسال تنبيه قبل الانتهاء بـ 3 أيام أو أقل
            if (daysLeft > 0 && daysLeft <= 3 && user.lastnotified !== daysLeft) {
               if (data.setting.notifier) {
                  await this.client.reply(
                     user.jid,
                     Utils.texted('italic', `⚠ تنبيه: ستنتهي صلاحية وصولك إلى الميزات المميزة (Premium) خلال ${daysLeft} يوم/أيام.`)
                  )
                  user.lastnotified = daysLeft
               }
            } else if (daysLeft <= 0) {
               // سحب الصلاحيات تلقائياً عند انتهاء المدة
               Object.assign(user, {
                  premium: false,
                  expired: 0,
                  limit: 0,
                  lastnotified: 0
               })
               if (data.setting.notifier) {
                  await this.client.reply(user.jid, Utils.texted('italic', `⚠ تنبيه: لقد انتهت باقة الاشتراك المميز الخاصة بك.`))
               }
            }
            await Utils.delay(1000)
         }

         // 2. فرز وفحص فترات إيجار وتفعيل المجموعات
         const rentedGroups = (data.groups || [])
            .filter(v => v.expired > 0)
            .sort((a, b) => a.expired - b.expired)

         for (const group of rentedGroups) {
            const timeLeft = group.expired - now
            const daysLeft = Math.ceil(timeLeft / day)

            // إرسال تنبيه لأعضاء المجموعة بقرب انتهاء فترة صلاحية البوت
            if (daysLeft > 0 && daysLeft <= 3 && group.lastnotified !== daysLeft) {
               const participants = (await this.client.groupMetadata(group.jid))?.participants || []
               if (data.setting.notifier) {
                  await this.client.reply(
                     group.jid,
                     Utils.texted('italic', `⚠ تنبيه للمجموعة: ستنتهي فترة تفعيل البوت النشطة داخل هذه المجموعة خلال ${daysLeft} يوم/أيام.`),
                     null,
                     { mentions: participants.map(p => p.id) }
                  )
                  group.lastnotified = daysLeft
               }
            } else if (daysLeft <= 0) {
               // إعلام الأعضاء ومغادرة المجموعة تلقائياً عند انتهاء الإيجار
               const participants = (await this.client.groupMetadata(group.jid))?.participants || []
               if (data.setting.notifier) {
                  await this.client.reply(
                     group.jid,
                     Utils.texted('italic', `⚠ تنبيه: لقد انتهت فترة تفعيل البوت داخل هذه المجموعة، سيقوم البوت بالمغادرة الآن تلقائياً.`),
                     null,
                     { mentions: participants.map(p => p.id) }
                  )
               }
               await this.client.groupLeave(group.jid)
               Utils.removeItem(data.groups, group)
            }
            await Utils.delay(1000)
         }
      } catch (e) {
         if (this.verbose) console.error('حدث خطأ أثناء فحص الاشتراكات وفترات الإيجار الداخلي:', e)
      } finally {
         this._checkingPremium = false
      }
   }

   /**
    * بدء تشغيل مهمة الفحص الدوري التلقائي لاشتراكات المميز وإيجار المجموعات.
    * يتم تنفيذ الفحص فوراً لمرة واحدة، ثم يتكرر بناءً على الفاصل الزمني المحدد.
    * @param {number} [recurringIntervalSec=15] - الفاصل الزمني بالثواني بين كل عملية فحص متتالية.
    */
   start(recurringIntervalSec = 15) {
      const runRecurringTasks = () => this._checkPremiumAndRent()

      runRecurringTasks()
      this.recurringIntervalId = setInterval(runRecurringTasks, recurringIntervalSec * 1000)
      if (this.verbose) console.log(`تم بدء نظام مراقبة الاشتراكات، الفحص يعمل دورياً كل ${recurringIntervalSec} ثانية.`)
   }

   /**
    * إيقاف عملية الفحص الدوري التلقائي للاشتراكات والإيجارات بشكل كامل.
    */
   stop() {
      if (this.recurringIntervalId) {
         clearInterval(this.recurringIntervalId)
         this.recurringIntervalId = null
      }
      if (this.verbose) console.log('تم إيقاف نظام مراقبة وفحص الاشتراكات.')
   }
}
