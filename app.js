// 1. Language Toggle Logic
const langToggle = document.getElementById('lang-toggle');
const body = document.body;

// Load saved language or default to Ukrainian
const savedLang = localStorage.getItem('dev-lang') || 'uk';
body.className = `lang-${savedLang}`;

langToggle.addEventListener('click', () => {
    const isUk = body.classList.contains('lang-uk');
    const newLang = isUk ? 'en' : 'uk';
    body.className = `lang-${newLang}`;
    localStorage.setItem('dev-lang', newLang);
});
