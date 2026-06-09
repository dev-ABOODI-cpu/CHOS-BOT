import { makeWASocket, useMultiFileAuthState, DisconnectReason, Browsers, delay, fetchLatestBaileysVersion } from 'baileys'
import pino from 'pino'
import fs from 'fs'
import path from 'path'

const sessionsDir = path.resolve('./sessions_sub')
if (!fs.existsSync(sessionsDir)) fs.mkdirSync(sessionsDir, { recursive: true })

global.subBots = global.subBots || {}

export const run = {
   usage: ['تنصيب', 'ربط'],
   category: 'البوتات الفرعية',

   async: async (m, { client, Utils }) => {

      const num = m.sender.split("@")[0].replace(/\D/g, '')
      const sessionPath = path.join(sessionsDir, num)

      if (global.subBots[num]) {
         return client.reply(m.chat, '🚩 البوت الفرعي شغال بالفعل', m)
      }

      await client.reply(m.chat, '⏳ جاري تهيئة الاتصال...', m)

      try {

         if (fs.existsSync(sessionPath)) {
            fs.rmSync(sessionPath, { recursive: true, force: true })
         }

         const { state, saveCreds } = await useMultiFileAuthState(sessionPath)
         const { version } = await fetchLatestBaileysVersion()

         const sock = makeWASocket({
            version,
            auth: state,
            logger: pino({ level: 'silent' }),
            printQRInTerminal: false,
            browser: Browsers.macOS('Desktop')
         })

         global.subBots[num] = sock

         sock.ev.on('creds.update', saveCreds)

         // ===== WAIT CONNECTION =====
         let isConnected = false

         sock.ev.on('connection.update', async (update) => {
            const { connection } = update

            if (connection === 'open') {
               isConnected = true
               await client.reply(m.chat, '✅ تم الاتصال، جاري تجهيز الكود...', m)
            }

            if (connection === 'close') {
               const reason = update.lastDisconnect?.error?.output?.statusCode

               if (reason === DisconnectReason.loggedOut || reason === 401) {
                  global.subBots[num] = null
                  if (fs.existsSync(sessionPath)) {
                     fs.rmSync(sessionPath, { recursive: true, force: true })
                  }
               }
            }
         })

         // ===== WAIT UNTIL READY =====
         let tries = 0
         while (!isConnected && tries < 10) {
            await delay(1000)
            tries++
         }

         await delay(2000)

         // ===== PAIRING =====
         let code
         for (let i = 0; i < 5; i++) {
            try {
               code = await sock.requestPairingCode(num)
               if (code) break
            } catch (e) {
               await delay(2000)
            }
         }

         if (!code) {
            global.subBots[num] = null
            return client.reply(m.chat, '❌ فشل إنشاء كود الربط', m)
         }

         const formatted = code.match(/.{1,4}/g)?.join('-') || code

         await client.sendMessage(m.chat, {
            text: `🔐 كود الربط:\n\n*${formatted}*`
         }, { quoted: m })

      } catch (err) {
         console.log(err)
         global.subBots[num] = null
         return client.reply(m.chat, '🚩 خطأ في النظام الفرعي', m)
      }
   }
}
