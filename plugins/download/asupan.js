export const run = {
   usage: ['فيديو_تيك'], // تم تعريب الأمر ليظهر في قائمة البوت باسم (فيديو_تيك)
   use: 'اسم المستخدم (اختياري)',
   category: 'التحميلات', // تم تعريب الفئة لتنظيم القائمة باللغة العربية
   async: async (m, {
      client,
      args,
      Utils
   }) => {
      try {
         // إرسال تفاعل (إيموجي الانتظار)
         client.sendReact(m.chat, '🕒', m.key)
         
         // استدعاء واجهة برمجة التطبيقات لجلب بيانات الفيديو من تيك توك
         // في حال لم يتم إدخال اسم مستخدم، يتم اختيار حساب عشوائي من القائمة الافتراضية
         const json = await Api.neoxr('/asupan', {
            username: args[0] || Utils.random([
               'itsbellefirst',
               'hosico_cat'
            ])
         })
         
         if (!json.status) return client.reply(m.chat, Utils.jsonFormat(json), m)
         
         // صياغة نص الوصف المرفق مع الفيديو باللغة العربية
         let caption = `乂  *مـعـلـومـات الـمـقـطـع*\n\n`
         caption += `	◦  *صاحب الحساب* : ${json.data.author.nickname} (@${json.data.author.username})\n`
         caption += `	◦  *المشاهدات* : ${Utils.h2k(json.data.stats.play_count)}\n`
         caption += `	◦  *الإعجابات* : ${Utils.h2k(json.data.stats.digg_count)}\n`
         caption += `	◦  *المشاركات* : ${Utils.h2k(json.data.stats.share_count)}\n`
         caption += `	◦  *التعليقات* : ${Utils.h2k(json.data.stats.comment_count)}\n`
         caption += `	◦  *الصوت* : ${json.data.music.title} - ${json.data.music.authorName}\n`
         caption += `	◦  *الوصف* : ${json.data.caption || '-'}\n\n`
         caption += `© DEV ABOODI OFFICIAL`
         
         // إرسال ملف الفيديو والـ Caption التوضيحي
         client.sendFile(m.chat, json.data.video.url, 'video.mp4', caption, m)
      } catch (e) {
         return client.reply(m.chat, Utils.jsonFormat(e), m)
      }
   },
   error: false,
   limit: true // الميزة تستهلك حداً من نقاط المستخدم
}
