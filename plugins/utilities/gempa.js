export const run = {
   usage: ['زلزال'], // الاسم العربي الرئيسي الذي سيظهر في القائمة (زلزال)
   hidden: ['gempa', 'رصد_الزلازل', 'هزة_ارضية'], // الاختصارات المخفية لضمان عمل البوت كبدائل دائماً
   category: 'أدوات مـساعدة', // الفئة المعربة لتنظيم قائمة الأوامر العامة
   async: async (m, {
      client,
      Utils
   }) => {
      try {
         // إرسال تفاعل تفاعلي يفيد ببدء جلب البيانات
         client.sendReact(m.chat, '🕒', m.key)
         
         // استدعاء البيانات البرمجية لآخر زلزال مرصود
         let json = await Api.neoxr('/gempa')
         if (!json.status) return client.reply(m.chat, Utils.jsonFormat(json), m)
         
         // بناء واجهة تقرير النشاط الزلزالي بالعربية
         let caption = `乂  *ر صـد  ا لـز ا لـز ا ل*\n\n`
         caption += `	◦  *خط العرض* : ${json.data.lintang}\n`
         caption += `	◦  *خط الطول* : ${json.data.bujur}\n`
         caption += `	◦  *القوة (مقياس ريختر)* : ${json.data.magnitudo}\n`
         caption += `	◦  *العمق* : ${json.data.kedalaman}\n`
         caption += `	◦  *التوقيت* : ${json.data.waktu}\n`
         caption += `	◦  *مركز الزلزال* : ${json.data.wilayah}\n\n`
         caption += `© DEV ABOODI OFFICIAL`
         
         // إرسال التقرير مدمجاً مع صورة الخريطة الجغرافية لمركز الزلزال
         client.sendMessageModify(m.chat, caption, m, {
            largeThumb: true,
            type: 'preview-link',
            ratio: 'square',
            thumbnail: await Utils.fetchAsBuffer(json.data.map)
         })
      } catch (e) {
         client.reply(m.chat, Utils.jsonFormat(e), m)
      }
   },
   error: false
}
