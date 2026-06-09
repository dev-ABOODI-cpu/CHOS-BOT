// FunkyMunky LMAO

module.exports = {
   apps: [{
      name: 'choso-in',
      script: './index.js',
      node_args: '--max-old-space-size=512', // تقييد مساحة الذاكرة لتفادي تسريب الذاكرة على السيرفرات الصغيرة وتيرمكس
      max_memory_restart: '700M', // إعادة تشغيل البوت تلقائياً إذا تجاوز استهلاك الرام الفعلي 700 ميجابايت
      env: {
         NODE_ENV: 'production'
      },
      env_development: {
         NODE_ENV: 'development'
      }
   }]
}
