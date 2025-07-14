document.addEventListener('DOMContentLoaded', () => {

    // --- Language Switcher Logic ---
    const langSelectorBtn = document.getElementById('lang-selector-btn');
    const langOptions = document.getElementById('lang-options');
    
    const setLanguage = (lang) => {
        // Update text content
        document.querySelectorAll('[data-key]').forEach(elem => {
            const key = elem.getAttribute('data-key');
            if (translations[lang] && translations[lang][key]) {
                elem.innerHTML = translations[lang][key];
            }
        });

        // Update content attributes for meta tags
        document.querySelectorAll('[data-key-content]').forEach(elem => {
            const key = elem.getAttribute('data-key-content');
            if (translations[lang] && translations[lang][key]) {
                elem.setAttribute('content', translations[lang][key]);
            }
        });

        // Update alt attributes
        document.querySelectorAll('[data-key-alt]').forEach(elem => {
            const key = elem.getAttribute('data-key-alt');
            if (translations[lang] && translations[lang][key]) {
                elem.setAttribute('alt', translations[lang][key]);
            }
        });

        // Update page lang attribute and title
        document.documentElement.lang = lang;
        document.title = translations[lang].company_title;

        // Update dropdown button text
        const activeLangText = langOptions.querySelector(`[data-lang="${lang}"]`).textContent;
        langSelectorBtn.textContent = activeLangText;
        
        // Update active class in dropdown
        langOptions.querySelectorAll('a').forEach(a => a.classList.remove('active'));
        langOptions.querySelector(`[data-lang="${lang}"]`).classList.add('active');

        // Save language to local storage
        localStorage.setItem('hystech-lang', lang);
    };

    // Handle language selection
    langOptions.addEventListener('click', (e) => {
        if (e.target.tagName === 'A') {
            e.preventDefault();
            const selectedLang = e.target.getAttribute('data-lang');
            setLanguage(selectedLang);
            // After selection, force the button to lose focus to avoid weird states
            langSelectorBtn.blur();
        }
    });

    // --- Initial Language Setup ---
    const savedLang = localStorage.getItem('hystech-lang');
    const browserLang = navigator.language.slice(0, 2); // Get 'en' from 'en-US'
    let initialLang = 'zh-CN'; // Default language

    if (savedLang) {
        initialLang = savedLang;
    } else if (translations[navigator.language]) { // e.g. 'zh-CN'
        initialLang = navigator.language;
    } else if (translations[browserLang]) { // e.g. 'en'
        initialLang = browserLang;
    }
    
    setLanguage(initialLang);


    // --- Smooth scroll for anchor links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}); 