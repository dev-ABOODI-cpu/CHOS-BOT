import { Version } from '@neoxr/wb'
import fs from 'node:fs'

export const run = {
   usage: ['القائمة', 'الاوامر', 'مساعدة'], // الأوامر العربية الرئيسية لاستدعاء قائمة البوت
   hidden: ['menu', 'help', 'command'], // الاختصارات الأجنبية لضمان المرونة والاستجابة دائماً
   async: async (m, {
      client,
      text,
      isPrefix,
      command,
      setting,
      system,
      plugins,
      Config,
      Utils
   }) => {
      try {
         // حساب حجم قاعدة البيانات المحلية إن وجدت بصيغة مقروءة
         const local_size = fs.existsSync('./' + Config.database + '.json') ? await Utils.formatSize(fs.statSync('./' + Config.database + '.json').size) : ''
         const library = JSON.parse(fs.readFileSync('./package.json', 'utf-8'))
         
         // تجهيز رسالة الترحيب والمعلومات الأساسية عبر تعويض المتغيرات النصية
         const message = setting.msg
            .replace('+tag', `@${m.sender.replace(/@.+/g, '')}`)
            .replace('+name', m.pushName).replace('+greeting', Utils.greeting())
            .replace('+db', (system.name === 'Local' ? `محلي (${local_size})` : system.name))
            .replace('+module', Version).replace('^', '').replace('~', '')
            .replace('+version', (library.dependencies.bails ? library.dependencies.bails : library.dependencies['baileys'] ? library.dependencies['baileys'] : library.dependencies.baileys).replace('^', '').replace('~', ''))

         const style = setting.style
         
         // --- النمط الأول (Style 1): عرض تقليدي منسق بعلامات أفقية ---
         if (style === 1) {
            let filter = Object.entries(plugins).filter(([_, obj]) => obj.run.usage)
            let cmd = Object.fromEntries(filter)
            let category = []
            for (let name in cmd) {
               let obj = cmd[name].run
               if (!cmd) continue
               if (!obj.category || setting.hidden.includes(obj.category)) continue
               if (Object.keys(category).includes(obj.category)) category[obj.category].push(obj)
               else {
                  category[obj.category] = []
                  category[obj.category].push(obj)
               }
            }
            const keys = Object.keys(category).sort()
            let print = message
            print += '\n' + String.fromCharCode(8206).repeat(4001) // خدعة اقرأ المزيد
            for (let k of keys) {
               print += '\n\n乂  *' + k.toUpperCase().split('').map(v => v).join(' ') + '*\n\n'
               let cmd = Object.entries(plugins).filter(([_, v]) => v.run.usage && v.run.category == k.toLowerCase())
               let usage = Object.keys(Object.fromEntries(cmd))
               if (usage.length == 0) return
               let commands = []
               cmd.map(([_, v]) => {
                  switch (v.run.usage.constructor.name) {
                     case 'Array':
                        v.run.usage.map(x => commands.push({
                           usage: x,
                           use: v.run.use ? Utils.texted('bold', v.run.use) : ''
                        }))
                        break
                     case 'String':
                        commands.push({
                           usage: v.run.usage,
                           use: v.run.use ? Utils.texted('bold', v.run.use) : ''
                        })
                  }
               })
               print += commands.sort((a, b) => a.usage.localeCompare(b.usage)).map(v => `	◦  ${isPrefix + v.usage} ${v.use}`).join('\n')
            }
            client.sendMessageModify(m.chat, Utils.Styles(print) + '\n\n' + `© DEV ABOODI OFFICIAL`, m, {
               ads: false,
               largeThumb: true,
               type: 'preview-link',
               ratio: 'landscape',
               thumbnail: Utils.isUrl(setting.cover) ? setting.cover : Buffer.from(setting.cover, 'base64'),
               url: setting.link
            })
            
         // --- النمط الثاني (Style 2): عرض مؤطر بحواف جانبية متناسقة ---
         } else if (style === 2) {
            let filter = Object.entries(plugins).filter(([_, obj]) => obj.run.usage)
            let cmd = Object.fromEntries(filter)
            let category = []
            for (let name in cmd) {
               let obj = cmd[name].run
               if (!cmd) continue
               if (!obj.category || setting.hidden.includes(obj.category)) continue
               if (Object.keys(category).includes(obj.category)) category[obj.category].push(obj)
               else {
                  category[obj.category] = []
                  category[obj.category].push(obj)
               }
            }
            const keys = Object.keys(category).sort()
            let print = message
            print += '\n' + String.fromCharCode(8206).repeat(4001)
            for (let k of keys) {
               print += '\n\n –  *' + k.toUpperCase().split('').map(v => v).join(' ') + '*\n\n'
               let cmd = Object.entries(plugins).filter(([_, v]) => v.run.usage && v.run.category == k.toLowerCase())
               let usage = Object.keys(Object.fromEntries(cmd))
               if (usage.length == 0) return
               let commands = []
               cmd.map(([_, v]) => {
                  switch (v.run.usage.constructor.name) {
                     case 'Array':
                        v.run.usage.map(x => commands.push({
                           usage: x,
                           use: v.run.use ? Utils.texted('bold', v.run.use) : ''
                        }))
                        break
                     case 'String':
                        commands.push({
                           usage: v.run.usage,
                           use: v.run.use ? Utils.texted('bold', v.run.use) : ''
                        })
                  }
               })
               print += commands.sort((a, b) => a.usage.localeCompare(b.usage)).map((v, i) => {
                  if (i == 0) {
                     return `┌  ◦  ${isPrefix + v.usage} ${v.use}`
                  } else if (i == commands.sort((a, b) => a.usage.localeCompare(b.usage)).length - 1) {
                     return `└  ◦  ${isPrefix + v.usage} ${v.use}`
                  } else {
                     return `│  ◦  ${isPrefix + v.usage} ${v.use}`
                  }
               }).join('\n')
            }
            client.sendMessageModify(m.chat, Utils.Styles(print) + '\n\n' + `© DEV ABOODI OFFICIAL`, m, {
               largeThumb: true,
               type: 'preview-link',
               ratio: 'landscape',
               thumbnail: Utils.isUrl(setting.cover) ? setting.cover : Buffer.from(setting.cover, 'base64'),
               url: setting.link
            })
            
         // --- النمط الثالث (Style 3): عرض مؤطر بدون معالجة خطوط متقدمة ---
         } else if (style === 3) {
            let filter = Object.entries(plugins).filter(([_, obj]) => obj.run.usage)
            let cmd = Object.fromEntries(filter)
            let category = []
            for (let name in cmd) {
               let obj = cmd[name].run
               if (!cmd) continue
               if (!obj.category || setting.hidden.includes(obj.category)) continue
               if (Object.keys(category).includes(obj.category)) category[obj.category].push(obj)
               else {
                  category[obj.category] = []
                  category[obj.category].push(obj)
               }
            }
            const keys = Object.keys(category).sort()
            let print = message
            print += '\n' + String.fromCharCode(8206).repeat(4001)
            for (let k of keys) {
               print += '\n\n –  *' + k.toUpperCase().split('').map(v => v).join(' ') + '*\n\n'
               let cmd = Object.entries(plugins).filter(([_, v]) => v.run.usage && v.run.category == k.toLowerCase())
               let usage = Object.keys(Object.fromEntries(cmd))
               if (usage.length == 0) return
               let commands = []
               cmd.map(([_, v]) => {
                  switch (v.run.usage.constructor.name) {
                     case 'Array':
                        v.run.usage.map(x => commands.push({
                           usage: x,
                           use: v.run.use ? Utils.texted('bold', v.run.use) : ''
                        }))
                        break
                     case 'String':
                        commands.push({
                           usage: v.run.usage,
                           use: v.run.use ? Utils.texted('bold', v.run.use) : ''
                        })
                  }
               })
               print += commands.sort((a, b) => a.usage.localeCompare(b.usage)).map((v, i) => {
                  if (i == 0) {
                     return `┌  ◦  ${isPrefix + v.usage} ${v.use}`
                  } else if (i == commands.sort((a, b) => a.usage.localeCompare(b.usage)).length - 1) {
                     return `└  ◦  ${isPrefix + v.usage} ${v.use}`
                  } else {
                     return `│  ◦  ${isPrefix + v.usage} ${v.use}`
                  }
               }).join('\n')
            }
            client.sendMessageModify(m.chat, print + '\n\n' + `© DEV ABOODI OFFICIAL`, m, {
               largeThumb: true,
               type: 'preview-link',
               ratio: 'landscape',
               thumbnail: Utils.isUrl(setting.cover) ? setting.cover : Buffer.from(setting.cover, 'base64'),
               url: setting.link
            })
            
         // --- النمط الرابع (Style 4): سرد الفئات أولاً ثم جلب الأوامر نصياً عن الإدخال ---
         } else if (style === 4) {
            if (text) {
               let cmd = Object.entries(plugins).filter(([_, v]) => v.run.usage && v.run.category == text.trim().toLowerCase() && !setting.hidden.includes(v.run.category.toLowerCase()))
               let usage = Object.keys(Object.fromEntries(cmd))
               if (usage.length == 0) return
               let commands = []
               cmd.map(([_, v]) => {
                  switch (v.run.usage.constructor.name) {
                     case 'Array':
                        v.run.usage.map(x => commands.push({
                           usage: x,
                           use: v.run.use ? Utils.texted('bold', v.run.use) : ''
                        }))
                        break
                     case 'String':
                        commands.push({
                           usage: v.run.usage,
                           use: v.run.use ? Utils.texted('bold', v.run.use) : ''
                        })
                  }
               })
               let print = commands.sort((a, b) => a.usage.localeCompare(b.usage)).map((v, i) => {
                  if (i == 0) {
                     return `┌  ◦  ${isPrefix + v.usage} ${v.use}`
                  } else if (i == commands.sort((a, b) => a.usage.localeCompare(b.usage)).length - 1) {
                     return `└  ◦  ${isPrefix + v.usage} ${v.use}`
                  } else {
                     return `│  ◦  ${isPrefix + v.usage} ${v.use}`
                  }
               }).join('\n')
               m.reply(print)
            } else {
               let print = message
               print += '\n' + String.fromCharCode(8206).repeat(4001) + '\n'
               let filter = Object.entries(plugins).filter(([_, obj]) => obj.run.usage)
               let cmd = Object.fromEntries(filter)
               let category = []
               for (let name in cmd) {
                  let obj = cmd[name].run
                  if (!cmd) continue
                  if (!obj.category || setting.hidden.includes(obj.category)) continue
                  if (Object.keys(category).includes(obj.category)) category[obj.category].push(obj)
                  else {
                     category[obj.category] = []
                     category[obj.category].push(obj)
                  }
               }
               const keys = Object.keys(category).sort()
               print += keys.sort((a, b) => a.localeCompare(b)).map((v, i) => {
                  if (i == 0) {
                     return `┌  ◦  ${isPrefix + command} ${v}`
                  } else if (i == keys.sort((a, b) => a.localeCompare(b)).length - 1) {
                     return `└  ◦  ${isPrefix + command} ${v}`
                  } else {
                     return `│  ◦  ${isPrefix + command} ${v}`
                  }
               }).join('\n')
               client.sendMessageModify(m.chat, print + '\n\n' + `© DEV ABOODI OFFICIAL`, m, {
                  largeThumb: true,
                  type: 'preview-link',
                  ratio: 'landscape',
                  thumbnail: Utils.isUrl(setting.cover) ? setting.cover : Buffer.from(setting.cover, 'base64'),
                  url: setting.link
               })
            }
            
         // --- النمط الخامس (Style 5): زر اختيار تفاعلي منفرد لعرض التصنيفات ---
         } else if (style === 5) {
            if (text) {
               let cmd = Object.entries(plugins).filter(([_, v]) => v.run.usage && v.run.category == text.trim().toLowerCase() && !setting.hidden.includes(v.run.category.toLowerCase()))
               let usage = Object.keys(Object.fromEntries(cmd))
               if (usage.length == 0) return
               let commands = []
               cmd.map(([_, v]) => {
                  switch (v.run.usage.constructor.name) {
                     case 'Array':
                        v.run.usage.map(x => commands.push({
                           usage: x,
                           use: v.run.use ? Utils.texted('bold', v.run.use) : ''
                        }))
                        break
                     case 'String':
                        commands.push({
                           usage: v.run.usage,
                           use: v.run.use ? Utils.texted('bold', v.run.use) : ''
                        })
                  }
               })
               let print = commands.sort((a, b) => a.usage.localeCompare(b.usage)).map((v, i) => {
                  if (i == 0) {
                     return `┌  ◦  ${isPrefix + v.usage} ${v.use}`
                  } else if (i == commands.sort((a, b) => a.usage.localeCompare(b.usage)).length - 1) {
                     return `└  ◦  ${isPrefix + v.usage} ${v.use}`
                  } else {
                     return `│  ◦  ${isPrefix + v.usage} ${v.use}`
                  }
               }).join('\n')
               m.reply(Utils.Styles(print))
            } else {
               let print = message
               let filter = Object.entries(plugins).filter(([_, obj]) => obj.run.usage)
               let cmd = Object.fromEntries(filter)
               let category = []
               for (let name in cmd) {
                  let obj = cmd[name].run
                  if (!cmd) continue
                  if (!obj.category || setting.hidden.includes(obj.category)) continue
                  if (Object.keys(category).includes(obj.category)) category[obj.category].push(obj)
                  else {
                     category[obj.category] = []
                     category[obj.category].push(obj)
                  }
               }
               const keys = Object.keys(category).sort()
               let sections = []
               const label = {
                  highlight_label: 'الأكثر استخداماً'
               }
               keys.sort((a, b) => a.localeCompare(b)).map((v, i) => sections.push({
                  ...(/download|conver|util/.test(v) ? label : {}),
                  rows: [{
                     title: Utils.ucword(v),
                     description: `يحتوي هذا القسم على ${Utils.arrayJoin(Object.entries(plugins).filter(([_, x]) => x.run.usage && x.run.category == v.trim().toLowerCase() && !setting.hidden.includes(x.run.category.toLowerCase())).map(([_, x]) => x.run.usage)).length} من الأوامر الجاهزة`,
                     id: `${isPrefix + command} ${v}`
                  }]
               }))
               const buttons = [{
                  name: 'single_select',
                  buttonParamsJson: JSON.stringify({
                     title: 'اضغط لفتح القائمة ⬇️',
                     sections
                  })
               }]
               client.sendIAMessage(m.chat, buttons, m, {
                  header: '',
                  content: print,
                  footer: `© DEV ABOODI OFFICIAL`,
                  media: Utils.isUrl(setting.cover) ? setting.cover : Buffer.from(setting.cover, 'base64')
               })
            }
            
         // --- النمط السادس (Style 6): قائمة تفاعلية شاملة مدعومة بروابط خارجية للمطور ---
         } else if (style === 6) {
            if (text) {
               let cmd = Object.entries(plugins).filter(([_, v]) => v.run.usage && v.run.category == text.trim().toLowerCase() && !setting.hidden.includes(v.run.category.toLowerCase()))
               let usage = Object.keys(Object.fromEntries(cmd))
               if (usage.length == 0) return
               let commands = []
               cmd.map(([_, v]) => {
                  switch (v.run.usage.constructor.name) {
                     case 'Array':
                        v.run.usage.map(x => commands.push({
                           usage: x,
                           use: v.run.use ? Utils.texted('bold', v.run.use) : ''
                        }))
                        break
                     case 'String':
                        commands.push({
                           usage: v.run.usage,
                           use: v.run.use ? Utils.texted('bold', v.run.use) : ''
                        })
                  }
               })
               let print = commands.sort((a, b) => a.usage.localeCompare(b.usage)).map((v, i) => {
                  if (i == 0) {
                     return `┌  ◦  ${isPrefix + v.usage} ${v.use}`
                  } else if (i == commands.sort((a, b) => a.usage.localeCompare(b.usage)).length - 1) {
                     return `└  ◦  ${isPrefix + v.usage} ${v.use}`
                  } else {
                     return `│  ◦  ${isPrefix + v.usage} ${v.use}`
                  }
               }).join('\n')
               m.reply(Utils.Styles(print))
            } else {
               let print = message
               let filter = Object.entries(plugins).filter(([_, obj]) => obj.run.usage)
               let cmd = Object.fromEntries(filter)
               let category = []
               for (let name in cmd) {
                  let obj = cmd[name].run
                  if (!cmd) continue
                  if (!obj.category || setting.hidden.includes(obj.category)) continue
                  if (Object.keys(category).includes(obj.category)) category[obj.category].push(obj)
                  else {
                     category[obj.category] = []
                     category[obj.category].push(obj)
                  }
               }
               const keys = Object.keys(category).sort()
               let sections = []
               const label = {
                  highlight_label: 'الأكثر استخداماً'
               }
               keys.sort((a, b) => a.localeCompare(b)).map((v, i) => sections.push({
                  ...(/download|conver|util/.test(v) ? label : {}),
                  rows: [{
                     title: Utils.ucword(v),
                     description: `يحتوي هذا القسم على ${Utils.arrayJoin(Object.entries(plugins).filter(([_, x]) => x.run.usage && x.run.category == v.trim().toLowerCase() && !setting.hidden.includes(x.run.category.toLowerCase())).map(([_, x]) => x.run.usage)).length} من الأوامر الجاهزة`,
                     id: `${isPrefix + command} ${v}`
                  }]
               }))
               const buttons = [{
                  name: 'cta_url',
                  buttonParamsJson: JSON.stringify({
                     display_text: 'بوابة واتساب الإلكترونية',
                     url: 'https://wapify.neoxr.eu',
                     merchant_url: 'https://wapify.neoxr.eu'
                  })
               }, {
                  name: 'cta_url',
                  buttonParamsJson: JSON.stringify({
                     display_text: 'موقع الـ API الرسمي',
                     url: 'https://api.neoxr.eu',
                     merchant_url: 'https://api.neoxr.eu'
                  })
               }, {
                  name: 'cta_url',
                  buttonParamsJson: JSON.stringify({
                     display_text: 'خادم الرفع المؤقت',
                     url: 'https://s.neoxr.eu',
                     merchant_url: 'https://s.neoxr.eu'
                  })
               }, {
                  name: 'cta_url',
                  buttonParamsJson: JSON.stringify({
                     display_text: 'متجر الدعم الرسمي',
                     url: 'https://shop.neoxr.eu',
                     merchant_url: 'https://shop.neoxr.eu'
                  })
               }, {
                  name: 'single_select',
                  buttonParamsJson: JSON.stringify({
                     title: 'الصفحة التالية ➡️',
                     sections
                  })
               }]
               client.sendIAMessage(m.chat, buttons, m, {
                  header: global.header,
                  content: print,
                  v2: true,
                  footer: `© DEV ABOODI OFFICIAL`,
                  media: Utils.isUrl(setting.cover) ? setting.cover : Buffer.from(setting.cover, 'base64'),
                  multiple: {
                     name: 'التحكم التلقائي الذكي',
                     code: 'Neoxr Creative',
                     list_title: 'اختر قائمة من الخيارات المتاحة',
                     button_title: 'اضغط هنا لعرض الأوامر ⬇️'
                  }
               })
            }
         }
      } catch (e) {
         client.reply(m.chat, Utils.jsonFormat(e), m)
      }
   },
   error: false
}
