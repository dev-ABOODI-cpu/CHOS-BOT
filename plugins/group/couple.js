import { format } from 'date-fns'

export const run = {
   usage: ['ثنائي'], // تعريب الأمر ليظهر في قائمة البوت باسم (ثنائي)
   hidden: ['couple'], // الاختصار المخفي لضمان عمل البوت إذا كُتب بالإنجليزية
   category: 'المجموعات', // تعريب الفئة لتنظيم قائمة الأوامر
   async: async (m, {
      client,
      participants
   }) => {
      // جلب جميع معرفات الأعضاء المتواجدين في المجموعة
      let member = participants.map(u => u.id)
      let now = new Date * 1
      
      // اختيار عضوين عشوائيين من القائمة
      var tag1 = member[Math.floor(member.length * Math.random())]
      var tag2 = member[Math.floor(member.length * Math.random())]
      
      // تجنب اختيار نفس الشخص مرتين كزوج لنفسه بعمل حلقة تكرارية قصيرة
      if (tag1 == tag2) {
         for (let i = 0; i < 5; i++) {
            var tag1 = member[Math.floor(member.length * Math.random())]
            var tag2 = member[Math.floor(member.length * Math.random())]
            if (tag1 != tag2) {
               break
            }
         }
      }
      
      // إرسال النتيجة الترفيهية باللغة العربية مع عمل المنشن وتثبيت حقوقك
      client.reply(m.chat, `💞 *أفضل ثنائي عشوائي لليوم:* \n\n@${tag1.replace(/@.+/, '')}  &  @${tag2.replace(/@.+/, '')}\n\nقد يتم اختيار ثنائي جديد في: _${format(now, 'dd/MM/yy HH:mm')}_\n\n© DEV ABOODI OFFICIAL`)
   },
   group: true // الميزة تعمل حصرياً داخل المجموعات
}
