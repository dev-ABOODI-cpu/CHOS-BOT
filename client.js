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
      const client = new Client({
         plugsdir: 'plugins',
         online: true,
         bypass_disappearing: true,
         bot: id => {
            // كشف الرسائل القادمة من البوت عن طريق معرف الرسالة
            return id && (id.startsWith('BAE') || /[-]/.test(id))
         },
         custom_id: 'neoxr', // البادئة لمعرف الرسائل المخصص
         presence: true, // تفعيل حالة "جاري الكتابة" أو "جاري تسجيل الصوت" للبوت
         create_session: {
            type: system.session,
            session: 'session',
            config: process.env.DATABASE_URL || ''
         },
         engines: [baileys], // تعيين محرك العمل الأساسي
         debug: false // تفعيل وضع المطور لرؤية العمليات بالتفصيل
      }, {
         // خيارات اتصال مكتبة Baileys
         version: Config.pairing.version,
         browser: Config.pairing.browser,
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
                  console.dim('[قاعدة البيانات] تم العثور على بيانات قديمة، جاري نقل البيانات...')
                  await system.proxy.migrate(previous, structure)
                  console.dim('[قاعدة البيانات] تم نقل البيانات بنجاح!')
               }
            }
         } catch (e) {
            Utils.printError(e)
         }

         if (res && typeof res === 'object' && res.message) Utils.logFile(res.message)
      })

      client.register('error', async error => {
         console.log(colors.red(error.message))
         if (error && typeof error === 'object' && error.message) Utils.logFile(error.message)
      })

      client.once('ready', async () => {
         const ramCheck = setInterval(() => {
            var ramUsage = process.memoryUsage().rss
            if (ramUsage >= bytes(Config.ram_limit)) {
               clearInterval(ramCheck)
               console.log(colors.yellow('⚠️ تم تجاوز حد الذاكرة العشوائية المسموح به، جاري إعادة التشغيل...'))
               process.send('reset')
            }
         }, 60 * 1000)

         // جدولة النسخ الاحتياطي التلقائي لقاعدة البيانات
         cron.schedule('0 12 * * *', async () => {
            if (global?.db?.setting?.autobackup) {
               const data = await system.proxy.backup(structure, Config.database)
               const now = new Intl.DateTimeFormat('en-CA', { timeZone: process.env.TZ, hour12: false, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(new Date()).replace(', ', '_').replace(/:/g, '-')
               const filename = `${Config.database}-${now}.json`
               await fsPromise.writeFile(filename, data, 'utf-8')
               const buffer = await fsPromise.readFile(filename)
               
               // إرسال ملف النسخة الاحتياطية إلى رقم المطور الجديد المعتمد في الـ Config
               await client.sock.sendFile(`${Config.owner}@s.whatsapp.net`, buffer, filename, '📦 نسخة احتياطية تلقائية لقاعدة البيانات.', null).then(async () => {
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
