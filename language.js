// 1. القاموس المركزي (يحتوي على كل كلمات التطبيق)
const translations = {
    ar: {
        dir: "rtl",
        home: "الرئيسية",
        search: "بحث...",
        messages: "الرسائل",
        like: "أعجبني",
        comment: "تعليق"
        // ... ضيف كل كلماتك هنا
    },
    en: {
        dir: "ltr",
        home: "Home",
        search: "Search...",
        messages: "Messages",
        like: "Like",
        comment: "Comment"
        // ... الترجمة الإنجليزية
    }
};

// 2. جلب اللغة المحفوظة أو تعيين العربية كافتراضي
let currentAppLang = localStorage.getItem('wareed_lang') || 'ar';

// 3. دالة الاستقبال والتطبيق (التي تترجم الصفحة)
function applyLanguage(lang) {
    currentAppLang = lang;
    
    // قلب اتجاه الصفحة
    document.documentElement.dir = translations[lang].dir;
    document.documentElement.lang = lang;

    // ترجمة النصوص العادية
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang][key]) el.innerText = translations[lang][key];
    });

    // ترجمة الخانات (Placeholders)
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (translations[lang][key]) el.placeholder = translations[lang][key];
    });
}

// 4. دالة تغيير اللغة (التي يضغط عليها المستخدم)
function changeLanguage(lang) {
    localStorage.setItem('wareed_lang', lang);
    applyLanguage(lang);
    
    // إطلاق "إشارة لاسلكية" داخل نفس الصفحة لأي سكربت آخر يحتاج تحديث
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: lang }));
}

// 5. دالة مساعدة لترجمة النصوص اللي بتترسم برمجياً (زي المنشورات)
window.t = function(key) {
    return translations[currentAppLang][key] || key;
};

// ==========================================
// 📡 نظام اللاسلكي (الاستقبال التلقائي)
// ==========================================

// أول ما أي صفحة تفتح، تلقط الإشارة وتترجم نفسها فوراً
document.addEventListener('DOMContentLoaded', () => {
    applyLanguage(currentAppLang);
});

// "الرادار": لو فاتح التطبيق في تاب تانية أو iFrame، 
// وغيرت اللغة من الإعدادات، باقي الصفحات هتسمع وتتغير فوراً!
window.addEventListener('storage', (e) => {
    if (e.key === 'wareed_lang') {
        applyLanguage(e.newValue);
    }
});
