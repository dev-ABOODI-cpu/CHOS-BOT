import { Utils, Config } from '@neoxr/wb'
import baileys from '../lib/baileys.js'
import path from 'path'
import fs from 'node:fs'
import colors from 'colors'
import Notifier from './notifier.js'
import { models } from './models.js'
import { NodeCache } from '@cacheable/node-cache'

const cache = new NodeCache({
   stdTTL: Config.cooldown
})
let handler = null
const handlerPath = path.resolve('./handler.js')
Utils.watchThisFile(handlerPath, (mod) => {
   handler = mod.default
})

export default (system, client) => {
   try {
      if (client.options.debug) console.log(colors.yellow('[مستمعات إضافية] جاري تسجيل مستمعات النظام الإضافية...'))
      const notify = new Notifier(client.sock, false)
      notify.start(15)

      // 1. التفاعل التلقائي مع حالات الواتساب (Stories) برياكشن عشوائي
      client.register('stories', async ctx => {
         try {
            if (ctx.message.key && ctx.sender !== client.sock.decodeJid(client.sock.user.id)) {
               await client.sock.sendMessage('status@broadcast', {
                  react: {
                     text: Utils.random(['🤣', '🥹', '😂', '😋', '😎', '🤓', '🤪', '🥳', '😠', '😱', '🤔']),
                     key: ctx.message.key
                  }
               }, {
                  statusJidList: [ctx.sender]
               })
            }
         } catch (e) {
            Utils.printError(e)
         }
      })

      // 2. ميزة حماية الرسائل من الحذف (Anti-Delete)
      client.register('message.delete', ctx => {
         const { sock } = client
         if (!ctx || ctx.message?.key?.fromMe || ctx.message?.isBot || !ctx.message?.sender) return
         if (cache.has(ctx.message.sender) && cache.get(ctx.message.sender) === 1) return
         cache.set(ctx.message.sender, 1)
         if (Object.keys(ctx.message) < 1) return
         if (ctx.message.isGroup && global.db.groups.some(v => v.jid == ctx.message.chat) && global.db.groups.find(v => v.jid == ctx.message.chat).antidelete) return sock.copyNForward(ctx.message.chat, ctx.message)
      })

      // 3. مراقبة حالة المستخدمين والتحقق من وضع الخمول (AFK) عند بدء الكتابة أو التسجيل
      client.register('presence.update', update => {
         if (!update) return
         const { sock } = client
         if (!global.db) return
         const { id, presences } = update
         if (id.endsWith('g.us')) {
            let groupSet = global.db?.groups?.find(v => v.jid === id)
            for (let sender in presences) {
               let user = global.db?.users?.find(v =>
                  v.jid === sender || v.lid === sender
               )
               const presence = presences[user?.jid] || presences[user?.lid]
               if (!presence || user?.lid === sock.decodeJid(sock.user.lid) || !user?.afk) continue
               if ((presence.lastKnownPresence === 'composing' || presence.lastKnownPresence === 'recording') && user.afk > -1) {
                  sock.reply(id, `نظام الرصد يكشف عن نشاط للمستخدم @${user.jid.replace(/@.+/, '')} بعد اختفاء دام: ${Utils.texted('bold', Utils.toTime(new Date - (user?.afk || 0)))}\n\n➠ ${Utils.texted('bold', 'سبب الخمول المستند')} : ${user?.afkReason || '-'}`, user?.afkObj)
                  user.afk = -1
                  user.afkReason = ''
                  user.afkObj = {}
               }
            }
         } else { }
      })

      // 4. مستمع الرسائل الرئيسي وتمريره للملف الهاندلر
      client.register('message', ctx => {
         baileys(client.sock)
         if (handler) handler(client.sock, { ...ctx, system })
      })

      // 5. الترحيب التلقائي عند انضمام عضو جديد للمجموعة وفحص حظر الأرقام الأجنبية
      client.register('group.add', async ctx => {
         try {
            const sock = client.sock
            const text = `أهلاً بك +tag في مجموعة +grup، نورتنا! ✨`
            if (!global?.db?.groups || !ctx.member) return

            const memberId = ctx.member?.phoneNumber || ctx.member
            if (!memberId || typeof memberId !== 'string') return

            const groupSet = global.db.groups.find(v => v.jid == ctx.jid)

            let pic = fs.readFileSync('./media/image/default.jpg')
            try {
               pic = await sock.profilePictureUrl(memberId, 'image') || fs.readFileSync('./media/image/default.jpg')
            } catch {
               pic = fs.readFileSync('./media/image/default.jpg')
            }

            // تفعيل حماية جغرافية (تم تعديل المنطق البرمجي لدعم الأرقام العربية بشكل عام ويمكنك تخصيصه كود دولتك إن أردت)
            if (groupSet && groupSet.localonly) {
               if (global.db.users.some(v => v.jid === memberId) && !global.db.users.find(v => v.jid == memberId).whitelist && !memberId.startsWith('20') && !memberId.startsWith('966')) {
                  sock.reply(ctx.jid, Utils.texted('bold', `عذراً @${memberId.split`@`[0]}، هذه المجموعة مخصصة للأرقام المحلية فقط. سيتم طردك تلقائياً.`))
                  return await Utils.delay(2000).then(() => sock.groupParticipantsUpdate(ctx.jid, [memberId], 'remove'))
               }
            }

            const isAdmin = ctx.groupMetadata?.participants?.some(
               v => (v.phoneNumber === sock.decodeJid(sock.user.id) || v.id === sock.decodeJid(sock.user.id)) && v.admin
            )

            if (groupSet.member?.[memberId]?.left && isAdmin) {
               sock.groupParticipantsUpdate(ctx.jid, [memberId], 'remove')
               delete groupSet.member[memberId]
               return
            }

            if (!groupSet.member?.[memberId]) {
               groupSet.member[memberId] = { ...models.member }
            }

            const txt = (groupSet && groupSet.text_welcome ? groupSet.text_welcome : text).replace('+tag', `@${memberId.split`@`[0]}`).replace('+grup', `${ctx.subject}`)
            if (groupSet && groupSet.welcome) sock.sendMessageModify(ctx.jid, txt, null, {
               largeThumb: true,
               thumbnail: pic,
               type: 'preview-link',
               ratio: 'landscape',
               url: global.db.setting.link
            })
         } catch (e) {
            Utils.printError(e)
         }
      })

      // 6. التوديع التلقائي عند مغادرة أو طرد عضو من المجموعة
      client.register('group.remove', async ctx => {
         try {
            const sock = client.sock
            const text = `إلى اللقاء +tag، نتمنى لك وقتاً طيباً بالخارج. 👋`
            if (!global?.db?.groups || !ctx.member) return

            const memberId = ctx.member?.phoneNumber || ctx.member
            if (!memberId || typeof memberId !== 'string') return

            const groupSet = global.db.groups.find(v => v.jid == ctx.jid)
            if (!groupSet) return

            let pic = fs.readFileSync('./media/image/default.jpg')
            try {
               pic = await sock.profilePictureUrl(memberId, 'image') || fs.readFileSync('./media/image/default.jpg')
            } catch {
               pic = fs.readFileSync('./media/image/default.jpg')
            }

            if (groupSet.member?.[memberId]) {
               groupSet.member[memberId].left = true
            }

            const txt = (groupSet && groupSet.text_left ? groupSet.text_left : text).replace('+tag', `@${memberId.split`@`[0]}`).replace('+grup', `${ctx.subject}`)
            if (groupSet && groupSet.left) sock.sendMessageModify(ctx.jid, txt, null, {
               largeThumb: true,
               thumbnail: pic,
               type: 'preview-link',
               ratio: 'landscape',
               url: global.db.setting.link
            })
         } catch (e) {
            Utils.printError(e)
         }
      })

      // 7. الرفض التلقائي للمكالمات الصوتية والمرئية لحماية خط البوت
      client.on('caller', async ctx => {
         try {
            if (typeof ctx === 'boolean') return
            await client.sock.rejectCall(ctx.id, ctx.jid)
         } catch { }
      })
   } catch (e) {
      Utils.printError(e)
   }
}
