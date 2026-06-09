/**
 * هذا نموذج لدمج 3 إضافات في ملف واحد: أمران رئيسيان وإضافة تفاعلية تلقائية.
 */

export const run = [{
   usage: ['فرع_1'], // تعريب الأمر الأول ليظهر في القائمة باسم (فرع_1)
   hidden: ['branch-1'], // الاختصار المخفي لضمان عمل البوت إذا كُتب بالإنجليزية
   category: 'أمثلة', // تعريب الفئة لتنظيم القائمة باللغة العربية
   async: async (m, {
      client,
      Utils
   }) => {
      try {
         client.reply(m.chat, 'مرحباً! هذه الرسالة صادرة من الفرع الأول (1).', m)
      } catch (e) {
         client.reply(m.chat, Utils.jsonFormat(e), m)
      }
   },
   error: false,
   group: true // الأمر يعمل داخل المجموعات فقط
}, {
   usage: ['فرع_2'], // تعريب الأمر الثاني ليظهر في القائمة باسم (فرع_2)
   hidden: ['branch-2'], // الاختصار المخفي لضمان عمل البوت إذا كُتب بالإنجليزية
   category: 'أمثلة', // تعريب الفئة لتنظيم القائمة باللغة العربية
   async: async (m, {
      client,
      Utils
   }) => {
      try {
         client.reply(m.chat, 'مرحباً! هذه الرسالة صادرة من الفرع الثاني (2).', m)
      } catch (e) {
         client.reply(m.chat, Utils.jsonFormat(e), m)
      }
   },
   error: false,
   private: true // الأمر يعمل داخل المحادثات الخاصة فقط
}, {
   // إضافة تلقائية (بدون أمر): للرد على كلمات الشكر بمختلف اللغات
   async: async (m, {
      client,
      body,
      Utils
   }) => {
      try {
         // فحص ما إذا كان نص الرسالة يحتوي على كلمات شكر (بالعربية، الإنجليزية، أو الإندونيسية)
         if (/^\s*(شكرا|شكراً|مشكور|تسلم|ثانكس|شكر|terima\s*kasih|terimakasih|makas[iyh]+|tr?im?s|thx|thanks?|ten[kc]yu)\s*$/i.test(body)) {
            m.reply('عفواً! على الرحب والسعة دائماً 😁\n\n© DEV ABOODI OFFICIAL')
         }
      } catch (e) {
         return client.reply(m.chat, Utils.jsonFormat(e), m)
      }
   },
   error: false
}]
