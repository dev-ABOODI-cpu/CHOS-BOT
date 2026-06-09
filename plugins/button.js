import fs from 'fs'

export const run = {
   usage: ['زر1', 'زر2', 'زر3', 'زر4', 'زر5', 'زر6', 'زر7'], // الأوامر المعربة لتجربة الأزرار
   hidden: ['button1', 'button2', 'button3', 'button4', 'button5', 'button6', 'button7'], // البدائل الأجنبية لضمان المرونة
   category: 'أمثـلة توضيحية', // الفئة المعربة لتنظيم قائمة الأوامر
   async: async (m, {
      client,
      isPrefix,
      command,
      setting,
      Utils
   }) => {
      try {
         switch (command) {
            case 'زر1':
            case 'button1':
               const buttons = [{
                  name: 'quick_reply',
                  buttonParamsJson: JSON.stringify({
                     display_text: 'وقت التشغيل',
                     id: `${isPrefix}run`
                  })
               }, {
                  name: 'single_select',
                  buttonParamsJson: JSON.stringify({
                     title: 'اضغط هنا! ⬇️',
                     sections: [{
                        rows: [{
                           title: 'خيار تجريبي 1',
                           id: `${isPrefix}run`
                        }, {
                           title: 'خيار تجريبي 2',
                           id: `${isPrefix}run`
                        }]
                     }]
                  })
               }]
               client.sendIAMessage(m.chat, buttons, m, {
                  header: global.header,
                  content: 'مرحباً بك! @0',
                  v2: true,
                  footer: `© DEV ABOODI OFFICIAL`,
                  media: Utils.isUrl(setting.cover) ? setting.cover : Buffer.from(setting.cover, 'base64'),
               })
               break

            case 'زر2':
            case 'button2': // أزرار نصية عادية فقط
               client.replyButton(m.chat, [{
                  text: 'وقت التشغيل',
                  command: '.runtime'
               }, {
                  text: 'الإحصائيات',
                  command: '.stat'
               }], m, {
                  text: 'مرحباً بك @0',
                  footer: `© DEV ABOODI OFFICIAL`
               })
               break

            case 'زر3':
            case 'button3': // أزرار مرفقة بصورة أو مقطع فيديو
               client.replyButton(m.chat, [{
                  text: 'وقت التشغيل',
                  command: '.runtime'
               }, {
                  text: 'الإحصائيات',
                  command: '.stat'
               }], m, {
                  text: 'مرحباً بك @0',
                  footer: `© DEV ABOODI OFFICIAL`,
                  media: fs.readFileSync('./media/image/default.jpg')
               })
               break

            case 'زر4':
            case 'button4': // أزرار تظهر تحت مستند وملف مرفق
               client.replyButton(m.chat, [{
                  text: 'وقت التشغيل',
                  command: '.runtime'
               }, {
                  text: 'الإحصائيات',
                  command: '.stat'
               }], m, {
                  text: 'مرحباً بك @0',
                  footer: `© DEV ABOODI OFFICIAL`,
                  media: Utils.isUrl(setting.cover) ? setting.cover : Buffer.from(setting.cover, 'base64'),
                  document: {
                     filename: 'neoxr-cover.jpg'
                  }
               })
               break

            case 'زر5':
            case 'button5': // الرسائل التناوبية المتنقلة (Carousel)
               const cards = [{
                  header: {
                     imageMessage: global.db.setting.cover,
                     hasMediaAttachment: true,
                  },
                  body: {
                     text: "رابط المجتمع الخاص بنا"
                  },
                  nativeFlowMessage: {
                     buttons: [{
                        name: "cta_url",
                        buttonParamsJson: JSON.stringify({
                           display_text: 'المجتمع',
                           url: global.db.setting.link,
                           webview_presentation: null
                        })
                     }]
                  }
               }, {
                  header: {
                     imageMessage: Utils.isUrl(setting.cover) ? setting.cover : Buffer.from(setting.cover, 'base64'),
                     hasMediaAttachment: true,
                  },
                  body: {
                     text: "رابط برمجية واجهة المطورين API"
                  },
                  nativeFlowMessage: {
                     buttons: [{
                        name: "cta_url",
                        buttonParamsJson: JSON.stringify({
                           display_text: 'رابط الـ API',
                           url: 'https://api.neoxr.eu',
                           webview_presentation: null
                        })
                     }]
                  }
               }]

               client.sendCarousel(m.chat, cards, m, {
                  content: 'مرحباً بك!'
               })
               break

            case 'زر6':
            case 'button6': // أزرار مدمجة بتعديل بيانات ومساحة الرسالة المرفقة
               client.replyButton(m.chat, [{
                  text: 'وقت التشغيل',
                  command: '.runtime'
               }, {
                  text: 'الإحصائيات',
                  command: '.stat'
               }], m, {
                  text: 'مرحباً بك @0',
                  footer: `© DEV ABOODI OFFICIAL`,
                  docs: {
                     name: 'التحكم التلقائي',
                     pages: 20,
                     size: '1GB',
                     extension: 'ppt'
                  },
                  body: 'أنظمة واتساب التلقائية والذكية',
                  thumbnail: Utils.isUrl(setting.cover) ? setting.cover : Buffer.from(setting.cover, 'base64')
               })
               break

            case 'زر7':
            case 'button7': { // القالب الشامل (رد سريع، رابط، نسخ، اتصال، قائمة منسدلة)
               const buttons = [{
                  name: "quick_reply",
                  buttonParamsJson: JSON.stringify({
                     display_text: "المطور",
                     id: `${isPrefix}owner`
                  }),
               }, {
                  name: "cta_url",
                  buttonParamsJson: JSON.stringify({
                     display_text: "موقع الـ API",
                     url: "https://api.neoxr.my.id",
                     merchant_url: "https://api.neoxr.my.id"
                  })
               }, {
                  name: "cta_copy",
                  buttonParamsJson: JSON.stringify({
                     display_text: "نسخ الكود المعرف",
                     copy_code: "123456"
                  })
               }, {
                  name: "cta_call",
                  buttonParamsJson: JSON.stringify({
                     display_text: "اتصال هاتي",
                     phone_number: "6285887776722"
                  })
               }, {
                  name: "single_select",
                  buttonParamsJson: JSON.stringify({
                     title: "الصفحة التالية ➡️",
                     sections: [{
                        rows: [{
                           title: "المطور الرئيسي",
                           description: `رقم المطور للاتصال المباشر`,
                           id: `${isPrefix}owner`
                        }, {
                           title: "وقت التشغيل",
                           description: `فحص مدة عمل الخادم الحالية`,
                           id: `${isPrefix}run`
                        }]
                     }]
                  })
               }]

               client.sendIAMessage(m.chat, buttons, m, {
                  header: global.header,
                  content: 'مرحباً بك! @0',
                  v2: true,
                  footer: `© DEV ABOODI OFFICIAL`,
                  media: Utils.isUrl(setting.cover) ? setting.cover : Buffer.from(setting.cover, 'base64'),
                  multiple: {
                     name: 'التحكم التلقائي والذكي',
                     code: 'neoxr-bot',
                     list_title: 'اختر من القائمة المتاحة',
                     button_title: 'اضغط هنا لعرض الخيارات ⬇️'
                  }
               })
               break
            }
         }
      } catch (e) {
         client.reply(m.chat, Utils.jsonFormat(e), m)
      }
   },
   error: false
}
