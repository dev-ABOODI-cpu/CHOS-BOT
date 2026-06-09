import { Utils, NeoxrApi } from '@neoxr/wb'
import { createRequire } from 'module'

const require = createRequire(import.meta.url)

// API
global.Api = new NeoxrApi(
   'https://api.neoxr.my.id/api',
   process.env.API_KEY || ''
)

// 📦 Pairing (حل مشكلة الخطأ الأساسي)
global.Config = global.Config || {}

global.Config.pairing = {
   version: [2, 3000, 1015901307],
   browser: ['Chrome', 'Windows', '10']
}

// 🧾 Header / Footer
global.header = `© 𝐂𝐇𝐎𝐒𝐎 | 𝐈𝐍 v${require('../package.json').version || '1.0.0'}`
global.footer = `✦ 𝐃𝐄𝐕 𝐀𝐁𝐎𝐎𝐃𝐈 𝐎𝐅𝐅𝐈𝐂𝐈𝐀𝐋 ッ ✦`

// 🌍 رسائل النظام (تعريب كامل)
global.status = Object.freeze({
   invalid: Utils.Styles('الرابط غير صالح أو غير مدعوم.'),
   wrong: Utils.Styles('الصيغة خاطئة! يرجى التأكد من الأمر.'),
   fail: Utils.Styles('فشل جلب البيانات.'),
   error: Utils.Styles('حدث خطأ غير متوقع أثناء المعالجة.'),
   errorF: Utils.Styles('هذه الميزة تحتوي على مشكلة حالياً.'),
   premium: Utils.Styles('هذه الميزة للمشتركين فقط (Premium).'),
   auth: Utils.Styles('لا تملك الصلاحية لاستخدام هذا الأمر.'),
   owner: Utils.Styles('هذا الأمر مخصص للمطور فقط.'),
   group: Utils.Styles('هذا الأمر يعمل داخل المجموعات فقط.'),
   botAdmin: Utils.Styles('يجب رفع البوت كـ Admin أولاً.'),
   admin: Utils.Styles('هذا الأمر للمشرفين فقط.'),
   private: Utils.Styles('يعمل داخل الخاص فقط.'),
   gameSystem: Utils.Styles('الألعاب معطلة حالياً.'),
   gameInGroup: Utils.Styles('الألعاب غير مفعلة في هذه المجموعة.'),
   gameLevel: Utils.Styles('وصلت للحد الأقصى من المستوى.')
})
