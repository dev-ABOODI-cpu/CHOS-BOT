# 1. تحديث حزم تيرمكس (بدون استخدام sudo لأن تيرمكس لا يحتاجها)
pkg update && pkg upgrade -y

# 2. تثبيت الأدوات الأساسية ومكتبة الصوت والفيديو
pkg install ffmpeg git curl nodejs-lts -y

# 3. تثبيت أدوات إدارة الحزم والتشغيل الخلفي عبر npm مباشرة
npm install -g yarn pm2

# 4. تثبيت حزم المشروع
yarn

# 5. تشغيل البوت واستعراض سجل العمليات
pm2 start pm2.config.cjs && pm2 logs
