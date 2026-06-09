import { makeWASocket, useMultiFileAuthState, DisconnectReason } from 'baileys'
import pino from 'pino'
import fs from 'fs'
import path from 'path'

const sessionsDir = path.resolve('./sessions_sub')
if (!fs.existsSync(sessionsDir)) {
   fs.mkdirSync(sessionsDir, { recursive: true })
}

export const run = {
   usage: ['تنصيب', 'ربط'], 
   hidden: ['code', 'jadibot'], 
   use: 'لربط حسابك كبوت فرعي',
   category: 'البوتات الفرعية', 
   async: async (m, { client, Utils }) => {
      const userNumber = m.sender.split('@')[0]
      const userSessionPath = path.join(sessionsDir, userNumber)

      await client.reply(m.chat, Utils.texted('bold', `⏳ جاري تجهيز كود الربط الخاص بحسابك...`), m)

      try {
         const { state, saveCreds } = await useMultiFileAuthState(userSessionPath)
         const sock = makeWASocket({
            auth: state,
            logger: pino({ level: 'silent' }),
            printQRInTerminal: false 
         })

         sock.ev.on('creds.update', saveCreds)

         if (!sock.authState.creds.registered) {
            setTimeout(async () => {
               try {
                  let code = await sock.requestPairingCode(userNumber)
                  code = code?.match(/.{1,4}/g)?.join('-') || code

                  // إرسال الكود لوحده لسهولة النسخ
                  await client.sendMessage(m.chat, { text: code }, { quoted: m })

                  const instruction = `${Utils.texted('bold', `📌 كود الربط الخاص بك أُرسل في الأعلى!`)}\n\n` +
                                      `*طريقة التفعيل:*\n` +
                                      `1️⃣ قم بنسخ الكود المرسل في الأعلى.\n` +
                                      `2️⃣ افتح واتساب > الأجهزة المرتبطة > ربط جهاز.\n` +
                                      `3️⃣ اختر "الربط باستخدام رقم الهاتف بدلاً من ذلك" وضع الكود.\n\n` +
                                      `© DEV ABOODI OFFICIAL`

                  await client.reply(m.chat, instruction, m)
               } catch (err) {
                  await client.reply(m.chat, Utils.texted('bold', `🚩 فشل توليد كود الربط. يرجى المحاولة لاحقاً.`), m)
               }
            }, 3000) 
         } else {
            await client.reply(m.chat, Utils.texted('bold', `🚩 أنت مسجل بالفعل ونظامك يعمل بنجاح!`), m)
         }

         sock.ev.on('connection.update', async (update) => {
            const { connection, lastDisconnect } = update
            if (connection === 'close') {
               const reason = lastDisconnect?.error?.output?.statusCode
               if (reason === DisconnectReason.loggedOut) {
                  fs.rmSync(userSessionPath, { recursive: true, force: true })
               }
            } else if (connection === 'open') {
               // تخزين وقت بداية التشغيل لحساب الحالة لاحقاً
               global.db.users[m.sender].subBotUptime = Date.now()
               await client.reply(m.chat, Utils.texted('bold', `✅ تم ربط حسابك وتشغيل البوت الفرعي بنجاح تام.`), m)
            }
         })

         // عداد الرسائل المستلمة للبوت الفرعي
         sock.ev.on('messages.upsert', async (chatUpdate) => {
            if (!global.db.users[m.sender].subBotMsgs) global.db.users[m.sender].subBotMsgs = 0
            global.db.users[m.sender].subBotMsgs += chatUpdate.messages.length
         })

      } catch (error) {
         await client.reply(m.chat, Utils.texted('bold', `🚩 حدث خطأ داخلي في النظام.`), m)
      }
   },
   error: false
}

