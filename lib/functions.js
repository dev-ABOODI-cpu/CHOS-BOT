import { Utils } from '@neoxr/wb'
import { format } from 'date-fns'
import chalk from 'chalk'
import fs from 'node:fs'
import fsPromise from 'fs/promises'
import path from 'path'
import { pathToFileURL } from 'url'

// دالة فحص والتحقق من روابط وسائل التواصل الاجتماعي المدعومة
Utils.socmed = url => {
   const regex = [
      /^(?:https?:\/\/(web\.|www\.|m\.)?(facebook|fb)\.(com|watch)\S+)?$/,
      /^(?:https?:\/\/)?(?:www\.)?(?:instagram\.com\/)(?:tv\/|p\/|reel\/)(?:\S+)?$/,
      /^(?:https?:\/\/)?(?:www\.)?(?:instagram\.com\/)(?:stories\/)(?:\S+)?$/,
      /^(?:https?:\/\/)?(?:www\.)?(?:instagram\.com\/)(?:s\/)(?:\S+)?$/,
      /^(?:https?:\/\/)?(?:www\.)?(?:mediafire\.com\/)(?:\S+)?$/,
      /pin(?:terest)?(?:\.it|\.com)/,
      /^(?:https?:\/\/)?(?:www\.|vt\.|vm\.|t\.)?(?:tiktok\.com\/)(?:\S+)?$/,
      /http(?:s)?:\/\/(?:www\.|mobile\.)?twitter\.com\/([a-zA-Z0-9_]+)/,
      /^(?:https?:\/\/)?(?:www\.|m\.|music\.)?youtu\.?be(?:\.com)?\/?.*(?:watch|embed)?(?:.*v=|v\/|\/)([\w\-_]+)\&?/,
      /^(?:https?:\/\/)?(?:podcasts\.)?(?:google\.com\/)(?:feed\/)(?:\S+)?$/
   ]
   return regex.some(v => /tiktok/.test(url) ? url.match(v) && !/tiktoklite/gis.test(url) : url.match(v))
}

// دالة تحديد تحية الوقت التلقائية بناءً على توقيت السيرفر أو الهاتف
Utils.greeting = () => {
   let time = parseInt(format(Date.now(), 'HH'))
   let res = `لا تنسَ أخذ قسط من النوم مريح`
   if (time >= 3) res = `مساء الخير`
   if (time > 6) res = `صباح الخير`
   if (time >= 11) res = `مساء النور`
   if (time >= 18) res = `طاب مساؤك`
   return res
}

// دالة توليد طريقة الاستخدام أو المثال للأوامر
Utils.example = (isPrefix, command, args) => {
   return `• ${Utils.texted('bold', 'مثال للاستخدام')} : ${isPrefix + command} ${args}`
}

// دالة إصلاح روابط إنستغرام لضمان معالجتها برمجياً بشكل صحيح
Utils.igFixed = (url) => {
   let count = url.split('/')
   if (count.length == 7) {
      let username = count[3]
      let destruct = Utils.removeItem(count, username)
      return destruct.map(v => v).join('/')
   } else return url
}

// دالة إصلاح وتحويل روابط تيك توك المختصرة
Utils.ttFixed = (url) => {
   if (!url.match(/(tiktok.com\/t\/)/g)) return url
   let id = url.split('/t/')[1]
   return 'https://vm.tiktok.com/' + id
}

// دالة حساب الحجم الإجمالي للمجلدات (مفيدة لمعرفة حجم التخزين المؤقت وقاعدة البيانات)
Utils.getFolderSize = async folderPath => {
   let totalSize = 0

   try {
      async function calculateSize(dir) {
         const files = await fsPromise.readdir(dir)

         for (const file of files) {
            const filePath = path.join(dir, file)
            const stats = await fsPromise.stat(filePath)

            if (stats.isFile()) {
               totalSize += stats.size
            } else if (stats.isDirectory()) {
               await calculateSize(filePath)
            }
         }
      }

      await calculateSize(folderPath)
      return totalSize
   } catch (e) {
      return totalSize
   }
}

// دالة مراقبة الملفات وتحديثها تلقائياً في الخلفية فور تعديل الكود
Utils.watchThisFile = (filePath, callback) => {
   const fileUrl = pathToFileURL(filePath).href

   const loadModule = async () => {
      try {
         const module = await import(`${fileUrl}?update=${Date.now()}`)
         if (callback) {
            callback(module)
         }
      } catch (error) {
         console.error(
            chalk.redBright.bold('[ خطأ برميجي ]'),
            format(new Date(), 'dd/MM/yyyy HH:mm:ss'),
            `~ فشل إعادة تحميل الملف المحدث ${filePath}:`,
            error.message
         )
      }
   }

   loadModule()

   const watcher = fs.watch(filePath, (eventType) => {
      if (eventType === 'change') {
         console.log(
            chalk.magenta.bold('[ تحديث تلقائي ]'),
            format(new Date(), 'dd/MM/yyyy HH:mm:ss'),
            chalk.bold(`~ تم تحديث الملف بنجاح: ${filePath}`)
         )
         loadModule()
      }
   })

   watcher.on('error', (error) => {
      console.error(
         chalk.redBright.bold('[ خطأ في المراقبة ]'),
         format(new Date(), 'dd/MM/yyyy HH:mm:ss'),
         `~ حدث خطأ أثناء مراقبة التغييرات للملف ${filePath}:`,
         error.message
      )
   })
}
