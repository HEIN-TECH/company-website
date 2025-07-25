document.addEventListener('DOMContentLoaded', () => {

    // --- Link Applicator Logic ---
    const applyLinks = () => {
        document.querySelectorAll('[data-link-key]').forEach(elem => {
            const key = elem.getAttribute('data-link-key');
            if (config.links[key]) {
                elem.setAttribute('href', config.links[key]);
            }
        });
    };

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

    // --- Initial Page Setup ---
    const setupPage = () => {
        // 1. Apply all links from config
        applyLinks();

        // 2. Set language
        const savedLang = localStorage.getItem('hystech-lang');
        const browserLang = navigator.language.slice(0, 2); // Get 'en' from 'en-US'
        let initialLang = 'en'; // Default language

        if (savedLang) {
            initialLang = savedLang;
        } else if (translations[navigator.language]) { // e.g. 'zh-CN'
            initialLang = navigator.language;
        } else if (translations[browserLang]) { // e.g. 'en'
            initialLang = browserLang;
        }
        
        setLanguage(initialLang);
    };

    setupPage();

    // --- Smooth scroll for anchor links ---
    // This part is now more important as some links are dynamically set
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

    // --- Hero Entrance Animation ---
    const heroSection = document.getElementById('hero');
    if (heroSection) {
        // 确保动画在渲染后再触发
        setTimeout(() => {
            heroSection.classList.add('hero-entrance');
        }, 100);
    }

    // --- Hero Ripple/Water Effect ---
    const rippleCanvas = document.getElementById('hero-ripple-canvas');
    if (rippleCanvas && heroSection) {
        const ctx = rippleCanvas.getContext('2d');
        let ripples = [];
        let dpr = window.devicePixelRatio || 1;

        function resizeCanvas() {
            const rect = heroSection.getBoundingClientRect();
            rippleCanvas.width = rect.width * dpr;
            rippleCanvas.height = rect.height * dpr;
            rippleCanvas.style.width = rect.width + 'px';
            rippleCanvas.style.height = rect.height + 'px';
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        function drawRipples() {
            ctx.clearRect(0, 0, rippleCanvas.width, rippleCanvas.height);
            ripples = ripples.filter(r => r.alpha > 0.01);
            for (const ripple of ripples) {
                ctx.save();
                ctx.globalAlpha = ripple.alpha;
                const grad = ctx.createRadialGradient(ripple.x, ripple.y, ripple.radius * 0.2, ripple.x, ripple.y, ripple.radius);
                grad.addColorStop(0, 'rgba(255,255,255,0.25)');
                grad.addColorStop(0.7, 'rgba(0,85,164,0.12)');
                grad.addColorStop(1, 'rgba(0,85,164,0)');
                ctx.beginPath();
                ctx.arc(ripple.x, ripple.y, ripple.radius, 0, 2 * Math.PI);
                ctx.fillStyle = grad;
                ctx.fill();
                ctx.restore();
                ripple.radius += 2.5 * dpr;
                ripple.alpha *= 0.93;
            }
            requestAnimationFrame(drawRipples);
        }
        drawRipples();

        heroSection.addEventListener('mousemove', e => {
            const rect = heroSection.getBoundingClientRect();
            const x = (e.clientX - rect.left) * dpr;
            const y = (e.clientY - rect.top) * dpr;
            ripples.push({ x, y, radius: 0, alpha: 0.45 });
        });
    }
}); 