import { Utils, NeoxrApi } from '@neoxr/wb'
global.Api = new NeoxrApi('https://api.neoxr.my.id/api', process.env.API_KEY)

import { createRequire } from 'module'
const require = createRequire(import.meta.url)

// تخصيص الهيدر والفوتر بحقوق بوتك وقناتك
global.header = `© 𝐂𝐇𝐎𝐒𝐎 | 𝐈𝐍 v${require('../package.json').version}`
global.footer = `✦ 𝐃𝐄𝐕 𝐀𝐁𝐎𝐎𝐃𝐈 𝐎𝐅𝐅𝐈𝐂𝐈𝐀𝐋 ッ ✦`

// تعريب كامل لرسائل النظام والردود التلقائية للبوت
global.status = Object.freeze({
   invalid: Utils.Styles('الرابط غير صالح أو غير مدعوم.'),
   wrong: Utils.Styles('الصيغة خاطئة! يرجى التأكد من طريقة كتابة الأمر.'),
   fail: Utils.Styles('فشل جلب البيانات الملوثة أو البيانات الوصفية.'),
   error: Utils.Styles('حدث خطأ غير متوقع أثناء معالجة طلبك.'),
   errorF: Utils.Styles('نأسف، هذه الميزة تحتوي على خلل برمجية حالياً.'),
   premium: Utils.Styles('هذه الميزة متاحة فقط للمشتركين في النسخة المميزة (Premium).'),
   auth: Utils.Styles('لا تملك الصلاحية لاستخدام هذه الميزة، يرجى مراجعة المطور أولاً.'),
   owner: Utils.Styles('هذا الأمر مخصص فقط لمطور البوت الأصلي: 𝐃𝐄𝐕 𝐀𝐁𝐎𝐎𝐃𝐈 𝐎𝐅𝐅𝐈𝐂𝐈𝐀𝐋.'),
   group: Utils.Styles('هذا الأمر يعمل فقط داخل المجموعات.'),
   botAdmin: Utils.Styles('يجب رفع البوت مشرفاً (Admin) في المجموعة أولاً لتنفيذ هذا الأمر.'),
   admin: Utils.Styles('هذا الأمر مخصص فقط لمشرفي المجموعة (Admins).'),
   private: Utils.Styles('يرجى استخدام هذا الأمر داخل المحادثات الخاصة فقط.'),
   gameSystem: Utils.Styles('ألعاب البوت معطلة حالياً من قبل الإدارة.'),
   gameInGroup: Utils.Styles('ميزات الألعاب لم يتم تفعيلها بعد في هذه المجموعة.'),
   gameLevel: Utils.Styles('لا يمكنك اللعب لأن مستواك الحالي قد وصل إلى الحد الأقصى المسموح به.')
})
