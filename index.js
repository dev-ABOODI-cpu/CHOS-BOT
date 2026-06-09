import 'dotenv/config'
import 'rootpath'
import { spawn } from 'child_process'
import fs from 'fs'
import fsPromise from 'fs/promises'
import path from 'path'
import CFonts from 'cfonts'
import { fileURLToPath } from 'url'
import { Utils } from '@neoxr/wb'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const TEMP_DIR = path.resolve('./temp')

// 🧹 تنظيف الملفات المؤقتة
const ensureTempDir = async () => {
   try {
      await fsPromise.mkdir(TEMP_DIR, { recursive: true })
   } catch (e) {
      Utils.printError('Temp error: ' + e)
   }
}

const cleanTemp = async () => {
   try {
      const files = await fsPromise.readdir(TEMP_DIR)

      for (const file of files) {
         if (file.endsWith('.file')) continue

         const filePath = path.join(TEMP_DIR, file)
         try {
            const stats = await fsPromise.stat(filePath)
            if (stats.isFile()) await fsPromise.unlink(filePath)
         } catch {}
      }
   } catch {}
}

const startAutoClean = async () => {
   await ensureTempDir()
   await cleanTemp()
   setInterval(cleanTemp, 60 * 60 * 1000)
}

// 💣 حماية من restart loop
let restarting = false
let p = null

function start() {
   const args = [path.join(__dirname, 'client.js'), ...process.argv.slice(2)]

   p = spawn(process.argv[0], args, {
      stdio: ['inherit', 'inherit', 'inherit', 'ipc']
   })

   p.on('message', data => {
      if (data === 'reset') {
         if (restarting) return
         restarting = true

         console.log('♻️ إعادة تشغيل البوت...')

         p.kill()
         p = null

         setTimeout(() => {
            restarting = false
            start()
         }, 3000)
      }
   })

   p.on('exit', code => {
      console.error('❌ البوت توقف:', code)

      if (!restarting) {
         setTimeout(start, 5000)
      }
   })
}

console.clear()

// 🔥 فحص Node.js
const major = parseInt(process.versions.node.split('.')[0], 10)

if (major < 20) {
   console.error('❌ يحتاج Node 20+')
   process.exit(1)
}

// 🎨 UI
CFonts.say('CHOSO IN', {
   font: 'tiny',
   align: 'center',
   colors: ['system']
})

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

// 🚀 تشغيل
start()
startAutoClean()
