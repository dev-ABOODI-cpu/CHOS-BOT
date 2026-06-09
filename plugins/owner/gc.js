export const run = {
   usage: ['خيارات_القروب', 'تحكم_القروب'], // الأوامر العربية الرئيسية المضافة للقائمة لإدارة المجموعات عن بعد
   hidden: ['gcopt', 'gc', 'خيارات_المجموعات'], // الاختصارات المخفية لضمان عمل البوت إذا كُتبت بالإنجليزية
   category: 'المطور', // الفئة المعربة لتنظيم قائمة أوامر المالك
   async: async (m, {
      client,
      args,
      isPrefix,
      command,
      setting,
      Utils
   }) => {
      try {
         client.groupsJid = client.groupsJid || []
         const areArraysEqual = (a, b) => a.length === b.length && JSON.stringify([...a].sort()) === JSON.stringify([...b].sort())
         const fetchedGroups = Object.values(await client.groupFetchAllParticipating()).map(v => v.id)
         if (fetchedGroups.length > 0 && !areArraysEqual(fetchedGroups, client.groupsJid)) {
            client.groupsJid = fetchedGroups
         }

         const [no, option, ...text] = args
         // إذا لم يتم إدخال رقم المجموعة المستهدفة، يتم عرض دليل الاستخدام المعرب له تلقائياً
         if (!no || isNaN(no)) return client.reply(m.chat, explain(isPrefix, command), m)
         let group = global.db.groups?.find(v => v.jid === client.groupsJid[no - 1])
         if (!group) return client.reply(m.chat, Utils.texted('bold', `🚩 لم يتم العثور على المجموعة المطلوبة في السجلات.`), m)

         const { id, subject, participants } = await client.resolveGroupMetadata(group.jid)
         const picture = await client.profilePicture(id)
         const admins = client.getAdmin(client.lidParser(participants))
         const isBotAdmin = admins.includes(client.decodeJid(client.user.id))

         switch (true) {
            // 11. رفع حالة/ستوري للمجموعة
            case option?.includes('-'): {
               const texts = text?.join(' ')
               const color = `#${Math.floor(Math.random() * 0xFFFFFF).toString(16).padStart(6, '0').toUpperCase()}`
               const q = m.quoted ? m.quoted : m
               const mime = (q.msg || q).mimetype || ''
               if (/video|image\/(jpe?g|png)/.test(mime)) {
                  await client.sendReact(m.chat, '🕒', m.key)
                  client.groupStatus(id, {
                     message: { [q.mtype]: { ...q, caption: texts || q.text || '' } },
                     caption: texts || q.text || ''
                  }).then(async () => {
                     await client.sendReact(m.chat, '✅', m.key)
                  })
               } else if (/audio/.test(mime)) {
                  await client.sendReact(m.chat, '🕒', m.key)
                  client.groupStatus(id, {
                     message: { [q.mtype]: q },
                     background: color
                  }).then(async () => {
                     await client.sendReact(m.chat, '✅', m.key)
                  })
               } else {
                  if (!texts) return client.reply(m.chat, Utils.texted('bold', `🚩 النص مطلوب لإنشاء الحالة!`), m)
                  await client.sendReact(m.chat, '🕒', m.key)
                  client.groupStatus(id, {
                     text: texts,
                     background: color
                  }).then(async () => {
                     await client.sendReact(m.chat, '✅', m.key)
                  })
               }
               break
            }

            // 2. فتح المجموعة للسماح لجميع الأعضاء بالإرسال
            case option === 'open' || option === 'فتح': {
               if (!isBotAdmin) return client.reply(m.chat, Utils.texted('bold', `🚩 لا يمكن فتح إرسال الرسائل في مجموعة [ ${subject} ] لأن البوت ليس مشرفاً (أدمن) هناك.`), m)
               client.groupSettingUpdate(id, 'not_announcement').then(() => {
                  client.reply(id, Utils.texted('bold', `🚩 تم فتح المجموعة للسماح للجميع بالإرسال.`)).then(() => {
                     client.reply(m.chat, Utils.texted('bold', `🚩 تم فتح إرسال مجموعة [ ${subject} ] بنجاح.`), m)
                  })
               })
               break
            }

            // 3. إغلاق المجموعة وجعل الإرسال للمشرفين فقط
            case option === 'close' || option === 'قفل': {
               if (!isBotAdmin) return client.reply(m.chat, Utils.texted('bold', `🚩 لا يمكن قفل إرسال الرسائل في مجموعة [ ${subject} ] لأن البوت ليس مشرفاً (أدمن) هناك.`), m)
               client.groupSettingUpdate(id, 'announcement').then(() => {
                  client.reply(id, Utils.texted('bold', `🚩 تم قفل المجموعة، الإرسال متاح للمشرفين فقط حالياً.`)).then(() => {
                     client.reply(m.chat, Utils.texted('bold', `🚩 تم قفل إرسال مجموعة [ ${subject} ] بنجاح.`), m)
                  })
               })
               break
            }

            // 4. كتم البوت داخل المجموعة
            case option === 'mute' || option === 'كتم': {
               group.mute = true
               client.reply(m.chat, Utils.texted('bold', `🚩 تم كتم وإيقاف استجابة البوت في مجموعة [ ${subject} ] بنجاح.`), m)
               break
            }

            // 5. إلغاء كتم البوت داخل المجموعة
            case option === 'unmute' || option === 'تفعيل': {
               group.mute = false
               client.reply(m.chat, Utils.texted('bold', `🚩 تم إلغاء الكتم وتفعيل استجابة البوت في مجموعة [ ${subject} ] بنجاح.`), m)
               break
            }

            // 6. جلب رابط دعوة المجموعة
            case option === 'link' || option === 'رابط': {
               if (!isBotAdmin) return client.reply(m.chat, Utils.texted('bold', `🚩 تعذر جلب رابط مجموعة [ ${subject} ] لأن البوت ليس مشرفاً هناك.`), m)
               client.reply(m.chat, 'https://chat.whatsapp.com/' + (await client.groupInviteCode(id)), m)
               break
            }

            // 7. مغادرة المجموعة عن بعد
            case option === 'leave' || option === 'خروج': {
               client.reply(id, `🚩 وداعاً للجميع! تم إصدار أمر مغادرة البوت من قِبل المطور.\n\n(${setting.link})`, null, {
                  mentions: participants.map(v => v.id)
               }).then(async () => {
                  await client.groupLeave(id).then(() => {
                     Utils.removeItem(global.db.groups, group)
                     return client.reply(m.chat, Utils.texted('bold', `🚩 تم مغادرة مجموعة [ ${subject} ] بنجاح وحذف سجلها.`), m)
                  })
               })
               break
            }

            // 8. إعادة تعيين إعدادات البوت للمجموعة للوضع الافتراضي
            case option === 'reset' || option === 'تصفير': {
               group.expired = 0
               group.stay = false
               client.reply(m.chat, Utils.texted('bold', `🚩 تم إعادة تعيين تكوينات البوت في مجموعة [ ${subject} ] إلى الوضع الافتراضي للشركة.`), m)
               break
            }

            // 9. تعيين البوت للبقاء الدائم في المجموعة دون انتهاء صلاحية
            case option === 'forever' || option === 'دائم': {
               group.expired = 0
               group.stay = true
               client.reply(m.chat, Utils.texted('bold', `🚩 تم تفعيل الوضع الدائم للبوت بنجاح داخل مجموعة [ ${subject} ].`), m)
               break
            }

            // 10. تمديد أو تحديد صلاحية بقاء البوت بالأيام (مثال: 30d)
            case option?.endsWith('d'): {
               const now = new Date() * 1
               const day = 86400000 * parseInt(option.replace('d', ''))
               group.expired += (group.expired == 0) ? (now + day) : day
               group.stay = false
               client.reply(m.chat, Utils.texted('bold', `🚩 تم تعيين مدة بقاء البوت بنجاح في مجموعة [ ${subject} ] لمدة [ ${option.replace('d', ' يوم')} ].`), m)
               break
            }

            // 1. الخيار الافتراضي: سحب وعرض معلومات المجموعة التفصيلية (Stealer)
            default: {
               client.sendMessageModify(m.chat, steal(Utils, {
                  name: subject,
                  member: participants.length,
                  time: group.stay ? 'دائم (FOREVER)' : (group.expired == 0 ? 'غير محدد' : Utils.timeReverse(group.expired - new Date() * 1)),
                  admin: isBotAdmin,
                  group
               }) + '\n\n' + `© DEV ABOODI OFFICIAL`, m, {
                  largeThumb: true,
                  type: 'preview-link',
                  ratio: 'landscape',
                  thumbnail: picture
               })
            }
         }
      } catch (e) {
         console.log(e)
         m.reply(Utils.jsonFormat(e))
      }
   },
   owner: true
}

// دالة صياغة لوحة معلومات المجموعة المسحوبة بالعربية
const steal = (Utils, data) => {
   return `乂  *مـعـلـو مـا ت  ا لـمـجـمـو عـة*\n
	◦  *الاسم* : ${data.name}
	◦  *الأعضاء* : ${data.member} عضو
	◦  *الصلاحية* : ${data.time}
	◦  *الاستجابة* : ${Utils.switcher(data.group.mute, 'مكتوم 🔕', 'نشط 🔔')}
	◦  *أدمن البوت* : ${Utils.switcher(data.admin, '[ √ ] مشرف', '[ × ] ليس مشرف')}`
}

// دالة صياغة واجهة دليل الخيارات الإدارية الكامل بالعربية
const explain = (prefix, cmd) => {
   return `乂  *لـو حـة  ا لـتـحـكـم  بـا لـمـجـمـو عـا ت*\n
*1.* ${prefix + cmd} <الرقم>
- لعرض وسحب كافة معلومات وتكوينات المجموعة.

*2.* ${prefix + cmd} <الرقم> open / فتح
- لفتح إرسال المجموعة والسماح لكافة الأعضاء بالمحادثة.

*3.* ${prefix + cmd} <الرقم> close / قفل
- لقفل إرسال المجموعة وجعله متاحاً للمشرفين فقط.

*4.* ${prefix + cmd} <الرقم> mute / كتم
- لكتم وتعطيل استجابة البوت للأوامر داخل تلك المجموعة.

*5.* ${prefix + cmd} <الرقم> unmute / تفعيل
- لإلغاء كتم البوت وإعادة تفعيل استجابته للأوامر.

*6.* ${prefix + cmd} <الرقم> link / رابط
- لتوليد وجلب رابط دعوة المجموعة (يتطلب كون البوت مشرفاً).

*7.* ${prefix + cmd} <الرقم> leave / خروج
- لإصدار أمر خروج ومغادرة البوت من المجموعة عن بعد.

*8.* ${prefix + cmd} <الرقم> reset / تصفير
- لإعادة تعيين إعدادات مدة وصلاحية المجموعة للوضع الافتراضي.

*9.* ${prefix + cmd} <الرقم> forever / دائم
- لجعل البوت مستقراً في المجموعة بشكل دائم دون تاريخ انتهاء.

*10.* ${prefix + cmd} <الرقم> 30d
- لتحديد عدد أيام صلاحية بقاء البوت في المجموعة.
مثال: ${prefix + cmd} 2 7d (لتمديد بقاء البوت في المجموعة رقم 2 لمدة 7 أيام).

*11.* ${prefix + cmd} <الرقم> - [اكتب نص أو رد على ميديا]
- لرفع حالة / ستوري للمجموعة (صورة، فيديو، صوت، نص).
مثال: ${prefix + cmd} 2 - أهلاً بكم في مجموعتنا!

*ملاحظة هامة* : يجب استخدام هذا الأمر بالرد أو الإشارة إلى قائمة جرد المجموعات المستخرجة؛ أرسل أمر ( *${prefix}المجموعات* ) لعرض جرد المجموعات وأرقامها الترتيبية الحالية.`
}
