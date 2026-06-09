import 'dotenv/config'
import 'rootpath'
import { spawn } from 'child_process'
import fs from 'fs/promises'
import path from 'path'
import CFonts from 'cfonts'
import { fileURLToPath } from 'url'
import { Utils } from '@neoxr/wb'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const TEMP_DIR = path.resolve('./temp')

const ensureTempDir = async () => {
   try {
      await fs.mkdir(TEMP_DIR, { recursive: true })
   } catch (e) {
      Utils.printError('فشل إنشاء مجلد الملفات المؤقتة: ' + e)
   }
}

const cleanTemp = async () => {
   try {
      const files = await fs.readdir(TEMP_DIR)

      await Promise.all(
         files.map(async file => {
            if (file.endsWith('.file')) return

            const filePath = path.join(TEMP_DIR, file)
            try {
               const stats = await fs.stat(filePath)
               if (stats.isFile()) await fs.unlink(filePath)
            } catch {
               Utils.printWarning(`تم تجاوز ملف تعذر حذفه: ${file}`)
            }
         })
      )
   } catch (e) {
      Utils.printError('حدث خطأ أثناء قراءة مجلد الملفات المؤقتة: ' + e)
   }
}

const startAutoClean = async () => {
   await ensureTempDir()
   cleanTemp()
   setInterval(cleanTemp, 60 * 60 * 1000) // كل ساعة
}

let p = null
function start() {
   const args = [path.join(__dirname, 'client.js'), ...process.argv.slice(2)]
   p = spawn(process.argv[0], args, {
      stdio: ['inherit', 'inherit', 'inherit', 'ipc']
   })
      .on('message', data => {
         if (data === 'reset') {
            console.log('جاري إعادة تشغيل البوت...')
            p.kill()
            p = null
         }
      })
      .on('exit', code => {
         console.error('تم إيقاف البوت برمز الخروج:', code)
         start()
      })
}

console.clear()

const major = parseInt(process.versions.node.split('.')[0], 10)

if (major < 20) {
   console.error(
      `\n❌ يتطلب البوت Node.js 20 أو أحدث للعمل بشكل صحيح.\n` +
      `   النسخة الحالية لديك هي ${process.versions.node}.\n` +
      `   يرجى ترقية Node.js إلى الإصدار 20 أو أحدث ثم إعادة المحاولة.\n`
   )
   process.exit(1)
}

// تعديل الحقوق هنا لتطابق اسم البوت الجديد
CFonts.say('CHOSO IN', {
   font: 'tiny',
   align: 'center',
   colors: ['system']
})

// تعديل اسم المطور والقناة ليظهر في الكونسول عند التشغيل
CFonts.say('DEV ABOODI OFFICIAL', {
   colors: ['system'],
   font: 'console',
   align: 'center'
})

CFonts.say('IN | DASH', {
   colors: ['system'],
   font: 'console',
   align: 'center'
})

CFonts.say('Version : 1.0.0', {
   colors: ['system'],
   font: 'console',
   align: 'center'
})

start()
startAutoClean()
