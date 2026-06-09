export const run = {
   usage: ['المطور'], // الاسم العربي الرئيسي الذي سيظهر في القائمة (المطور)
   hidden: ['owner', 'المالك'], // الاختصارات المخفية لضمان عمل البوت إذا كُتبت بالإنجليزية أو العربية البديلة
   category: 'إحصائيات', // الفئة المعربة لتنظيم قائمة الأوامر
   async: async (m, {
      client,
      Config
   }) => {
      // إرسال كرت جهة اتصال المطور برمجياً مع البيانات المرفقة بك
      client.sendContact(m.chat, [{
         name: Config.owner_name,
         number: Config.owner,
         about: 'المالك والمطور الرسمي للبوت' // تعريب وصف جهة الاتصال
      }], m, {
         org: 'DEV ABOODI OFFICIAL',
         website: 'https://api.neoxr.my.id',
         email: 'contact@neoxr.my.id'
      })
   },
   error: false
}
