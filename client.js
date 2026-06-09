import { Client, Config, Utils } from '@neoxr/wb'
import baileys from './lib/engine.js'
import './lib/proto.js'
import './error.js'
import './lib/config.js'
import './lib/functions.js'

import bytes from 'bytes'
import fsPromise from 'fs/promises'
import colors from 'colors'
import cron from 'node-cron'
import extra from './lib/listeners-extra.js'
import { models, structure } from './lib/models.js'
import system from './lib/adapter.js'

const connect = async () => {
   try {

      // 🔥 حماية من Config undefined
      const pairing = Config?.pairing || {
         version: [2, 3000, 1015901307],
         browser: ['Chrome', 'Windows', '10']
      }

      const client = new Client({
         plugsdir: 'plugins',
         online: true,
         bypass_disappearing: true,

         bot: id => {
            return id && (id.startsWith('BAE') || /[-]/.test(id))
         },

         custom_id: 'neoxr',
         presence: true,

         create_session: {
            type: system.session,
            session: 'session',
            config: process.env.DATABASE_URL || ''
         },

         engines: [baileys],
         debug: false
      }, {
         // 🚀 FIX: استخدام fallback آمن
         version: pairing.version,
         browser: pairing.browser,

         shouldIgnoreJid: jid => {
            return /(newsletter|bot)/.test(jid)
         }
      })

      client.once('connect', async res => {
         try {
            await system.proxy.init(models, structure, Config.database)

            const isEmpty = global.db.users.length === 0 && global.db.chats.length === 0

            if (isEmpty) {
               const previous = await system.database.fetch()

               if (previous && Object.keys(previous).length > 0) {
                  console.dim('[قاعدة البيانات] نقل البيانات...')
                  await system.proxy.migrate(previous, structure)
                  console.dim('[قاعدة البيانات] تم النقل بنجاح!')
               }
            }

         } catch (e) {
            Utils.printError(e)
         }

         if (res && typeof res === 'object' && res.message)
            Utils.logFile(res.message)
      })

      client.register('error', async error => {
         console.log(colors.red(error.message))
         if (error?.message) Utils.logFile(error.message)
      })

      client.once('ready', async () => {

         const ramCheck = setInterval(() => {
            const ramUsage = process.memoryUsage().rss

            if (ramUsage >= bytes(Config.ram_limit)) {
               clearInterval(ramCheck)
               console.log(colors.yellow('⚠️ إعادة تشغيل بسبب RAM'))
               process.send('reset')
            }
         }, 60000)

         cron.schedule('0 12 * * *', async () => {
            if (global?.db?.setting?.autobackup) {
               const data = await system.proxy.backup(structure, Config.database)

               const now = new Intl.DateTimeFormat('en-CA', {
                  timeZone: process.env.TZ,
                  hour12: false,
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit',
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit'
               }).format(new Date()).replace(', ', '_').replace(/:/g, '-')

               const filename = `${Config.database}-${now}.json`

               await fsPromise.writeFile(filename, data, 'utf-8')
               const buffer = await fsPromise.readFile(filename)

               await client.sock.sendFile(
                  `${Config.owner}@s.whatsapp.net`,
                  buffer,
                  filename,
                  '📦 نسخة احتياطية تلقائية',
                  null
               ).then(async () => {
                  await fsPromise.unlink(filename)
               })
            }
         })

         extra(system, client)
      })

   } catch (e) {
      Utils.printError(e)
   }
}

connect().catch(() => connect())
