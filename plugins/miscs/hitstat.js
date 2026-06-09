import { format } from 'date-fns'

export const run = {
   usage: ['الاحصائيات_العامة', 'الاحصائيات_اليومية'], // الأوامر العربية المضافة للقائمة
   hidden: ['hitstat', 'hitdaily'], // الاختصارات المخفية لضمان عمل البوت بالإنجليزية أيضاً
   category: 'إحصائيات', // الفئة المعربة لتنظيم قائمة الأوامر
   async: async (m, {
      client,
      isPrefix,
      command,
      setting,
      Utils
   }) => {
      // تحديد نوع الإحصائيات المطلوبة (عامة أم يومية تابعة لتاريخ اليوم الحالي)
      const isGeneral = command === 'الاحصائيات_العامة' || command === 'hitstat'
      const todayStr = format(new Date(), 'ddMMyy')
      
      const types = isGeneral 
         ? global.db.statistic 
         : Object.fromEntries(Object.entries(global.db.statistic).filter(([_, prop]) => format(new Prop.lasthit, 'ddMMyy') == todayStr))
         
      let stat = Object.keys(types)
      if (stat.length == 0) return client.reply(m.chat, Utils.texted('bold', `🚩 لم يتم استخدام أي أوامر بعد لتوليد الإحصائيات.`), m)
      
      class Hit extends Array {
         total(key) {
            return this.reduce((a, b) => a + (b[key] || 0), 0)
         }
      }
      
      let sum = new Hit(...Object.values(types))
      let sorted = isGeneral 
         ? Object.entries(types).sort((a, b) => b[1].hitstat - a[1].hitstat) 
         : Object.entries(types).sort((a, b) => b[1].today - a[1].today)
         
      let prepare = sorted.map(v => v[0])
      let show = Math.min(10, prepare.length) // عرض أعلى 10 أوامر مستخدمة فقط
      
      // صياغة واجهة البيانات باللغة العربية
      let teks = `乂  *إ حـصـا ئـيـا ت  ا لأ و ا مـر*\n\n`
      teks += Utils.texted('bold', `“إجمالي استخدام الأوامر ${isGeneral ? 'العام الحالي' : 'لهذا اليوم'} هو ${Utils.formatNumber(isGeneral ? sum.total('hitstat') : sum.total('today'))} استخدام.”`) + '\n\n'
      
      teks += sorted.slice(0, show).map(([cmd, prop], i) => {
         return `   ┌ ` + Utils.texted('bold', 'الأمر') + ` :  ` + Utils.texted('monospace', isPrefix + cmd) + 
                `\n   │ ` + Utils.texted('bold', 'الاستخدام') + ` : ${Utils.formatNumber(isGeneral ? prop.hitstat : prop.today)} مرة\n   └ ` + 
                Utils.texted('bold', 'آخر استخدام') + ` : ${format(prop.lasthit, 'dd/MM/yy HH:mm:ss')}`
      }).join('\n\n')
      
      teks += `\n\n© DEV ABOODI OFFICIAL`
      
      // إرسال لوحة الإحصائيات مدمجة بغلاف البوت
      client.sendMessageModify(m.chat, teks, m, {
         largeThumb: true,
         type: 'preview-link',
         ratio: 'landscape',
         thumbnail: Utils.isUrl(setting.cover) ? setting.cover : Buffer.from(setting.cover, 'base64'),
      })
   },
   error: false
}
