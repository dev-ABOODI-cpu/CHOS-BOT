export const run = {
   usage: ['بروفايلي'], // الاسم العربي الرئيسي الذي سيظهر في القائمة (بروفايلي)
   hidden: ['me', 'حسابي', 'ملفي', 'بروفايل'], // الاختصارات المخفية لضمان عمل البوت كبدائل دائماً
   category: 'معلومات المستخدم', // الفئة المعربة لتنظيم قائمة أوامر الأعضاء
   async: async (m, {
      client,
      blockList,
      Config,
      users,
      Utils
   }) => {
      // جلب الصورة الشخصية لحساب المستخدم من خوادم واتساب
      const avatar = await client.profilePicture(m.sender)
      let blocked = blockList.includes(m.sender) ? true : false
      let now = new Date() * 1
      
      // جلب عدد التحذيرات الحالية للمستخدم سواء داخل المجموعة أو في الخاص
      let groupWarning = m.isGroup ? (typeof global.db.groups.find(v => v.jid == m.chat).member[m.sender] != 'undefined' ? global.db.groups.find(v => v.jid == m.chat).member[m.sender].warning : 0) : users.warning

      // بناء نص الواجهة الترحيبية والبيانات الشخصية للمستخدم
      let caption = `乂  *ا لـمـلـف  ا لـشـخـصـي*\n\n`
      caption += `	◦  *الاسم* : ${m.pushName}\n`
      caption += `	◦  *الحد اليومي* : ${Utils.formatNumber(users.limit)}\n`
      caption += `	◦  *عدد الاستخدامات* : ${Utils.formatNumber(users.hit)}\n`
      caption += `	◦  *التحذيرات* : ${groupWarning} / 5\n\n`
      
      caption += `乂  *حـا لـة  ا لـحـسـا ب*\n\n`
      caption += `	◦  *محظور من رقم البوت* : ${(blocked ? 'نعم  ✅' : 'لا  ❌')}\n`
      caption += `	◦  *محظور برمجياً (بان)* : ${(users.ban_temporary > 0 && (Date.now() - users.ban_temporary < Config.timeout))
         ? 'مؤقت لـ ' + Utils.toTime((users.ban_temporary + Config.timeout) - Date.now())
         : users.banned ? 'نعم  ✅' : 'لا  ❌'}\n`
      caption += `	◦  *استخدم الخاص* : ${(global.db.chats.map(v => v.jid).includes(m.sender) ? 'نعم  ✅' : 'لا  ❌')}\n`
      caption += `	◦  *الحساب المميز (Premium)* : ${(users.premium ? 'نعم  ⭐' : 'لا  ❌')}\n`
      caption += `	◦  *انتهاء الاشتراك المميز* : ${users.expired == 0 ? '-' : Utils.timeReverse(users.expired - new Date() * 1)}\n\n`
      
      caption += `© DEV ABOODI OFFICIAL`
      
      // إرسال الرسالة المعدلة مدمجة مع الصورة الشخصية للمستخدم بشكل مربع متناسق
      client.sendMessageModify(m.chat, caption, m, {
         largeThumb: true,
         type: 'preview-link',
         ratio: 'square', // أبعاد الصورة مربعة متساوية الطرفين
         thumbnail: avatar
      })
   },
   error: false
}
