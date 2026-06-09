import { Utils } from '@neoxr/wb'
import fs from 'node:fs'

export default client => {
   /**
    * جلب الاسم المرتبط برقم المستخدم (JID) من قاعدة البيانات العالمية.
    * @param {string} jid - معرف الواتساب الخاص بالمستخدم.
    * @returns {string|null} - اسم المستخدم، أو null إذا لم يتم العثور عليه.
    */
   client.getName = jid => {
      const isFound = global.db.users.find(v => v.jid === client.decodeJid(jid))
      if (!isFound) return null
      return isFound.name
   }

   /**
    * جلب معرفات جميع المشرفين والمشرفين المتميزين (Admins & Superadmins) من قائمة أعضاء المجموعة.
    *
    * @param {Array} participants - مصفوفة تحتوي على بيانات الأعضاء المستخرجة من بيانات المجموعة.
    * @returns {Array<string>} قائمة بمعرفات الأعضاء الذين يمتلكون صلاحية مشرف.
    */
   client.getAdmin = participants => participants
      ?.filter(i => i.admin === 'admin' || i.admin === 'superadmin')
      ?.map(i => i.id) || []

   /**
    * جلب الصورة الشخصية (البروفايل) لمعرف واتساب معين.
    *
    * في حال لم يضع المستخدم صورة شخصية أو حدث خطأ أثناء جلبها،
    * ستُرجع الدالة الصورة الافتراضية المخزنة في الملفات بدلاً منها.
    *
    * @param {string} jid - معرف الواتساب المراد جلب صورته الشخصية.
    * @returns {Promise<string|Buffer>} - رابط الصورة الشخصية إذا وُجدت، أو الصورة الافتراضية كـ Buffer.
    */
   client.profilePicture = async jid => {
      const defaults = fs.readFileSync('./media/image/default.jpg')
      try {
         const picture = await client.profilePictureUrl(jid, 'image')
         return picture ?? defaults
      } catch (e) {
         return defaults
      }
   }
}
