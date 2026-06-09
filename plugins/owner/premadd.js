export const run = {
   usage: ['إضافة_مميز'], // الاسم العربي الرئيسي الذي سيظهر في القائمة (إضافة_مميز)
   hidden: ['+prem', 'اضافة_بريميوم', 'مميز'], // الاختصارات المخفية لضمان عمل البوت كبدائل دائمًا
   use: 'منشن، رد، أو رقم الهاتف | المدة الزمنية',
   category: 'المطور', // الفئة المعربة لتنظيم قائمة أوامر المالك
   async: async (m, {
      client,
      args,
      text,
      isPrefix,
      command,
      Utils
   }) => {
      // دالة تحليل المدة الزمنية وتحويلها إلى صيغة مفهومة للبوت
      const parseDuration = (input) => {
         const getUnitName = (unitChar, value) => {
            switch (unitChar) {
               case 'd':
                  return value === 1 ? 'يوم' : 'أيام'
               case 'h':
                  return value === 1 ? 'ساعة' : 'ساعات'
               case 'm':
                  return value === 1 ? 'دقيقة' : 'دقائق'
               case 's':
                  return value === 1 ? 'ثانية' : 'ثواني'
               default:
                  return 'أيام'
            }
         }

         if (!input) {
            return { ms: 86400000 * 30, value: 30, unitName: getUnitName('d', 30) }
         }

         const match = input.match(/^(\d+)([dhms])?$/)
         if (match) {
            const value = parseInt(match[1])
            const unitChar = match[2]

            let ms
            let actualUnitChar

            switch (unitChar) {
               case 'd':
                  ms = value * 86400000
                  actualUnitChar = 'd'
                  break
               case 'h':
                  ms = value * 3600000
                  actualUnitChar = 'h'
                  break
               case 'm':
                  ms = value * 60000
                  actualUnitChar = 'm'
                  break
               case 's':
                  ms = value * 1000
                  actualUnitChar = 's'
                  break
               default:
                  ms = value * 86400000
                  actualUnitChar = 'd'
                  break
            }
            return { ms: ms, value: value, unitName: getUnitName(actualUnitChar, value) }
         } else {
            const num = parseInt(input)
            if (!isNaN(num)) {
               return { ms: num * 86400000, value: num, unitName: getUnitName('d', num) }
            }
         }
         return null
      }

      try {
         let user = global.db.users

         // 1. في حال تم تنفيذ الأمر بالرد على رسالة المستخدم المستهدف (Reply)
         if (m.quoted) {
            if (m.quoted.isBot) return client.reply(m.chat, Utils.texted('bold', `🚩 حماية: لا يمكن تعيين البوت كحساب مميز.`), m)

            const parsedDuration = parseDuration(args[0])
            if (!parsedDuration) {
               return client.reply(m.chat, Utils.texted('bold', `🚩 صيغة الوقت غير صالحة. أمثلة مدعومة: '30d' أيام، '1h' ساعات، '5m' دقائق، '10s' ثواني.`), m)
            }

            let durationMs = parsedDuration.ms
            let durationValue = parsedDuration.value
            let durationUnitName = parsedDuration.unitName

            let jid = client.decodeJid(m.quoted.sender)
            let users = user.find(v => v.jid == jid)
            users.limit += 1000
            users.limit_game += 1000
            users.expired += users.premium ? durationMs : ((new Date() * 1) + durationMs)

            client.reply(m.chat, users.premium ? Utils.texted('bold', `✅ تم تمديد الاشتراك المميز لـ @${jid.replace(/@.+/, '')} بمقدار ${durationValue} ${durationUnitName} إضافية.\n\n© DEV ABOODI OFFICIAL`) : Utils.texted('bold', `✅ تم إضافة @${jid.replace(/@.+/, '')} بنجاح إلى القائمة المميزة لمدة ${durationValue} ${durationUnitName}.\n\n© DEV ABOODI OFFICIAL`), m).then(() => users.premium = true)
         
         // 2. في حال تم تنفيذ الأمر عن طريق المنشن أو الإشارة (@mention)
         } else if (m.mentionedJid.length != 0) {
            const parsedDuration = parseDuration(args[1])
            if (!parsedDuration) {
               return client.reply(m.chat, Utils.texted('bold', `🚩 صيغة الوقت غير صالحة. أمثلة مدعومة: '30d' أيام، '1h' ساعات، '5m' دقائق، '10s' ثواني.`), m)
            }

            let durationMs = parsedDuration.ms
            let durationValue = parsedDuration.value
            let durationUnitName = parsedDuration.unitName

            let jid = client.decodeJid(m.mentionedJid[0])
            const users = user.find(v => v.jid == jid)
            users.limit += 1000
            users.expired += users.premium ? durationMs : ((new Date() * 1) + durationMs)

            client.reply(m.chat, users.premium ? Utils.texted('bold', `✅ تم تمديد الاشتراك المميز لـ @${jid.replace(/@.+/, '')} بمقدار ${durationValue} ${durationUnitName} إضافية.\n\n© DEV ABOODI OFFICIAL`) : Utils.texted('bold', `✅ تم إضافة @${jid.replace(/@.+/, '')} بنجاح إلى القائمة المميزة لمدة ${durationValue} ${durationUnitName}.\n\n© DEV ABOODI OFFICIAL`), m).then(() => users.premium = true)
         
         // 3. في حال تم إدخال رقم هاتف متبوعاً بعلامة الفاصلة والمدة زمنية (الرقم|المدة)
         } else if (text && /\|/.test(text)) {
            let [number, durationInput] = text.split`|`
            let p = (await client.onWhatsApp(String(number).startsWith('0') ? '62' + String(number).slice(1) : number.startsWith('+') ? number.match(/\d+/g).join('') : number))[0] || {}
            if (!p.exists) return client.reply(m.chat, Utils.texted('bold', '🚩 هذا الرقم غير مسجل أو نشط على واتساب حالياً.'), m)

            const parsedDuration = parseDuration(durationInput)
            if (!parsedDuration) {
               return client.reply(m.chat, Utils.texted('bold', `🚩 صيغة الوقت غير صالحة للرقم المدخل. أمثلة مدعومة: '30d' أيام، '1h' ساعات.`), m)
            }

            let durationMs = parsedDuration.ms
            let durationValue = parsedDuration.value
            let durationUnitName = parsedDuration.unitName

            let jid = client.decodeJid(p.jid)
            const users = user.find(v => v.jid == jid)
            if (!users) return client.reply(m.chat, Utils.texted('bold', `🚩 لم يتم العثور على بيانات هذا المستخدم في قاعدة البيانات.`), m)

            users.limit += 1000
            users.expired += users.premium ? durationMs : ((new Date() * 1) + durationMs)

            client.reply(m.chat, users.premium ? Utils.texted('bold', `🚩 تم تمديد الاشتراك المميز لـ @${jid.replace(/@.+/, '')} بمقدار ${durationValue} ${durationUnitName} إضافية.\n\n© DEV ABOODI OFFICIAL`) : Utils.texted('bold', `🚩 تم إضافة @${jid.replace(/@.+/, '')} بنجاح إلى القائمة المميزة لمدة ${durationValue} ${durationUnitName}.\n\n© DEV ABOODI OFFICIAL`), m).then(() => users.premium = true)

         // 4. دليل الاستخدام والتعليمات في حال كتابة الأمر بشكل خاطئ
         } else {
            let teks = `乂  *أ مـثـلـة  ا لـا سـتـخـد ا م* :\n\n`
            teks += `• بالرقم والمدة: ${isPrefix + command} 9665xxxxx | 7d\n`
            teks += `• بالمنشن والمدة: ${isPrefix + command} @المستخدم 12h\n`
            teks += `• بالرد والمدة: ${isPrefix + command} 30m (قم بالرد على رسالة الضحية)\n\n`
            teks += `_💡 صيغة الوقت المتاحة:_ اكتب الرقم متبوعاً بحرف الاختصار المناسب:\n`
            teks += `- [ *d* ] للأيام (Days)\n`
            teks += `- [ *h* ] للساعات (Hours)\n`
            teks += `- [ *m* ] للدقائق (Minutes)\n`
            teks += `- [ *s* ] للثواني (Seconds)\n\n`
            teks += `_ملاحظة: إذا كتبت رقماً مجرداً بدون رمز، فسيتم اعتباره أياماً تلقائياً (مثال: 7 تعني 7 أيام). القيمة الافتراضية عند عدم الإدخال هي 30 يوماً._`
            client.reply(m.chat, teks, m)
         }
      } catch (e) {
         console.error(e)
         client.reply(m.chat, Utils.texted('bold', `🚩 تعذر تنفيذ العملية، المستخدم غير مسجل في قاعدة البيانات أو حدث خطأ داخلي.`), m)
      }
   },
   error: false,
   owner: true // الأداة محمية ومخصصة لمالك البوت فقط لمنع توزيع الصلاحيات المميزة بشكل عشوائي
}
