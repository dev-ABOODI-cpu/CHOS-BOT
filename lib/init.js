class Init {
   /**
    * إنشاء نسخة عميقة (Deep Clone) من الكائن الممرر.
    * هذا مفيد لتجنب المراجع المشتركة بين الكائنات في الذاكرة،
    * مما يضمن أن التعديلات على الكائن الجديد لا تؤثر على الكائن الأصلي.
    *
    * @function
    * @param {Object} [object={}] - الكائن المراد نسخ نسخه عميقاً.
    * @returns {Object} - نسخة مطابقة ومستقلة تماماً من الكائن المدخل.
    */
   getModel = (object) => {
      if (object === undefined) return undefined
      if (object === null) return null
      return JSON.parse(JSON.stringify(object))
   }

   /**
    * دالة لتهيئة وتحديث الكائنات بالقيم الافتراضية من قالب معين بالإضافة إلى الخصائص المخصصة.
    * تضمن دمج البيانات الجديدة بسلاسة دون التغلب على البيانات القديمة للمستخدم.
    * * @param {Object} prefix - الكائن الحالي المراد تهيئته أو تحديثه (مثل بيانات مستخدم).
    * @param {Object} template - القالب الافتراضي الذي يحتوي على القيم والخصائص القياسية للبوت.
    * @param {Object} [custom={}] - خصائص مخصصة اختيارية ليتم إضافتها في حال فقدانها.
    */
   execute = (prefix, template, custom = {}) => {
      const merge = (target, source) => {
         Object.keys(source).forEach(key => {
            const val = source[key]

            if (!(key in target)) {
               target[key] = (val !== null && typeof val === 'object')
                  ? JSON.parse(JSON.stringify(val))
                  : val

            } else if (
               val !== null && typeof val === 'object' && !Array.isArray(val) &&
               target[key] !== null && typeof target[key] === 'object' && !Array.isArray(target[key])
            ) {
               merge(target[key], val)
            }
         })
      }

      merge(prefix, template)
      merge(prefix, custom)
   }
}

export default new Init()
