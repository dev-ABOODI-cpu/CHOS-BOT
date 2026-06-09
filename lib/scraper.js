import { Component } from '@neoxr/wb'
const { Scraper } = new Component()

/**
 * كاشط البيانات الأول (مثال: جلب بيانات من موقع معين)
 * @param {string} url - الرابط المراد كشطه واستخراج البيانات منه
 */
Scraper.yourScraper1 = async (url) => {
   // اكتب كود الكاشط الأول الخاص بك هنا (Your scraper code here)
}

/**
 * كاشط البيانات الثاني
 * @param {string} url - الرابط المراد معالجته
 */
Scraper.yourScraper2 = async (url) => {
   // اكتب كود الكاشط الثاني الخاص بك هنا (Your scraper code here)
}

// يمكنك إضافة المزيد من الكاشطات هنا بنفس الطريقة ...
