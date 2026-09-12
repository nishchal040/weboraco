// EmailJS message sender
function sendmail() {
    const params = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        message: document.getElementById("message").value
    };

    emailjs
        .send("service_6izxvj5", "template_8jomi5v", params)
        .then(() => {
            alert("Message sent successfully! We will get back to you shortly.");
            const form = document.querySelector("form");
            if (form) form.reset();
        })
        .catch((error) => {
            alert("Failed to send message. Please email us directly at info.webora.co@gmail.com");
            console.error(error);
        });
}

// Mobile Menu Controls
function showmenu() {
    const menu = document.getElementById('nav-menu') || document.getElementById('list') || document.getElementById('menu');
    if (menu) {
        menu.classList.add("active");
        document.body.style.overflow = 'hidden';
    }
}

function closemenu() {
    const menu = document.getElementById('nav-menu') || document.getElementById('list') || document.getElementById('menu');
    if (menu) {
        menu.classList.remove("active");
        document.body.style.overflow = '';
    }
}

// Back to Top smooth scroll
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Global DOM Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Navbar scroll effect
    const navbar = document.querySelector('nav.navbar') || document.querySelector('nav');
    window.addEventListener('scroll', () => {
        if (navbar) {
            if (window.scrollY > 30) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
    });

    // Close mobile menu when clicking nav links
    const navLinks = document.querySelectorAll('.nav-list a, .menu ul a, #list a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            closemenu();
        });
    });
});

// FAQ Accordion Toggle
function toggleFaq(button) {
    const faqItem = button.parentElement;
    const answer = faqItem.querySelector('.faq-answer');
    const isOpen = faqItem.classList.contains('open');

    // Close other open items for cleaner UX
    const allItems = document.querySelectorAll('.faq-item');
    allItems.forEach(item => {
        if (item !== faqItem) {
            item.classList.remove('open');
            const otherAnswer = item.querySelector('.faq-answer');
            if (otherAnswer) otherAnswer.style.maxHeight = null;
            const otherBtn = item.querySelector('.faq-question');
            if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
        }
    });

    if (isOpen) {
        faqItem.classList.remove('open');
        answer.style.maxHeight = null;
        button.setAttribute('aria-expanded', 'false');
    } else {
        faqItem.classList.add('open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
        button.setAttribute('aria-expanded', 'true');
    }
}

// ==========================================================================
// BLOG HUB: LIVE SEARCH & CATEGORY FILTERING
// ==========================================================================
let currentBlogCategory = 'all';

function filterBlogCategory(category, btnElement) {
    currentBlogCategory = category.toLowerCase();
    
    // Update active filter button state
    const filterBtns = document.querySelectorAll('.category-filter-btn');
    filterBtns.forEach(btn => btn.classList.remove('active'));
    if (btnElement) {
        btnElement.classList.add('active');
    }

    applyBlogFilters();
}

function searchBlogArticles(query) {
    applyBlogFilters(query.toLowerCase().trim());
}

function applyBlogFilters(searchQuery = null) {
    const searchInput = document.getElementById('blog-search-input');
    const query = searchQuery !== null ? searchQuery : (searchInput ? searchInput.value.toLowerCase().trim() : '');
    
    const blogCards = document.querySelectorAll('.blog-card');
    const noResults = document.getElementById('no-results');
    const articleCountBadge = document.getElementById('visible-article-count');
    let visibleCount = 0;

    blogCards.forEach(card => {
        const title = card.getAttribute('data-title') ? card.getAttribute('data-title').toLowerCase() : '';
        const category = card.getAttribute('data-category') ? card.getAttribute('data-category').toLowerCase() : '';
        const excerpt = card.querySelector('.blog-card-excerpt') ? card.querySelector('.blog-card-excerpt').innerText.toLowerCase() : '';

        const matchesCategory = currentBlogCategory === 'all' || category.includes(currentBlogCategory);
        const matchesSearch = query === '' || title.includes(query) || excerpt.includes(query) || category.includes(query);

        if (matchesCategory && matchesSearch) {
            card.style.display = 'flex';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });

    if (noResults) {
        noResults.style.display = visibleCount === 0 ? 'block' : 'none';
    }

    if (articleCountBadge) {
        articleCountBadge.innerText = `${visibleCount} Article${visibleCount === 1 ? '' : 's'}`;
    }
}

// ==========================================================================
// SINGLE BLOG POST: READING PROGRESS & TOC HIGHLIGHT
// ==========================================================================
window.addEventListener('scroll', () => {
    // 1. Reading Progress Bar
    const progressBar = document.getElementById('reading-progress');
    if (progressBar) {
        const totalHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        if (totalHeight > 0) {
            const scrollPercentage = (window.scrollY / totalHeight) * 100;
            progressBar.style.width = `${scrollPercentage}%`;
        }
    }

    // 2. Table of Contents Active Link Highlighting
    const headings = document.querySelectorAll('.post-content-body h2, .post-content-body h3');
    const tocLinks = document.querySelectorAll('.toc-list a');
    
    if (headings.length > 0 && tocLinks.length > 0) {
        let activeId = '';
        headings.forEach(heading => {
            const top = heading.getBoundingClientRect().top;
            if (top <= 140) {
                activeId = heading.getAttribute('id');
            }
        });

        if (activeId) {
            tocLinks.forEach(link => {
                if (link.getAttribute('href') === `#${activeId}`) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            });
        }
    }
});

// Copy Post URL to Clipboard with Toast
function copyPostUrl() {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
        showToast("Article link copied to clipboard!");
    }).catch(() => {
        showToast("Link: " + url);
    });
}

function showToast(message) {
    let toast = document.getElementById('copy-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'copy-toast';
        toast.className = 'copy-toast';
        document.body.appendChild(toast);
    }
    toast.innerText = message;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 2800);
}

// ==========================================================================
// ==========================================================================
// PRICING PAGE: MULTI-CURRENCY SWITCHER & INTERACTIVE ESTIMATOR
// ==========================================================================
let activeCurrency = 'USD'; // Default fallback if no country match
let activeTypeRate = 1.0;

const currencyConfig = {
    INR: { symbol: '₹', baseMin: 9999, pageRate: 3000, locale: 'en-IN' },
    GBP: { symbol: '£', baseMin: 150, pageRate: 48, locale: 'en-GB' },
    EUR: { symbol: '€', baseMin: 200, pageRate: 58, locale: 'de-DE' },
    USD: { symbol: '$', baseMin: 199, pageRate: 60, locale: 'en-US' }
};

// Automatic Geo/Country Currency Detection
function detectUserCurrency() {
    // 1. Check if user previously manually selected a currency
    try {
        const saved = localStorage.getItem('webora_selected_currency');
        if (saved && currencyConfig[saved]) {
            return saved;
        }
    } catch (e) {}

    // 2. Fast Instant Client-Side Detection via Timezone & Browser Locales (0ms latency, zero layout shift)
    try {
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
        const lang = (navigator.language || navigator.userLanguage || '').toLowerCase();
        const languages = (navigator.languages || []).map(l => l.toLowerCase());

        // India Match -> INR
        if (tz === 'Asia/Kolkata' || tz === 'Asia/Calcutta' || lang.includes('en-in') || lang.includes('hi-in') || languages.some(l => l.includes('-in'))) {
            return 'INR';
        }

        // United Kingdom Match -> GBP
        if (tz === 'Europe/London' || tz === 'Europe/Belfast' || tz === 'Europe/Gibraltar' || lang === 'en-gb' || languages.includes('en-gb')) {
            return 'GBP';
        }

        // European Union / European Countries Match -> EUR
        const euTimezones = [
            'Europe/Berlin', 'Europe/Paris', 'Europe/Rome', 'Europe/Madrid', 'Europe/Amsterdam',
            'Europe/Brussels', 'Europe/Vienna', 'Europe/Dublin', 'Europe/Lisbon', 'Europe/Athens',
            'Europe/Helsinki', 'Europe/Stockholm', 'Europe/Oslo', 'Europe/Copenhagen', 'Europe/Warsaw',
            'Europe/Prague', 'Europe/Budapest', 'Europe/Bucharest', 'Europe/Sofia', 'Europe/Zagreb',
            'Europe/Tallinn', 'Europe/Riga', 'Europe/Vilnius', 'Europe/Ljubljana', 'Europe/Bratislava',
            'Europe/Luxembourg', 'Europe/Valletta', 'Europe/Nicosia', 'Europe/Zurich'
        ];
        const euLocales = [
            'de', 'fr', 'es', 'it', 'nl', 'pt', 'pl', 'sv', 'da', 'fi', 'el', 'cs', 'hu', 'ro', 'bg', 'hr', 'sk', 'sl', 'et', 'lv', 'lt', 'ga'
        ];

        if (euTimezones.includes(tz) || tz.startsWith('Europe/') || euLocales.some(l => lang.startsWith(l))) {
            return 'EUR';
        }
    } catch (e) {
        console.warn('Browser locale detection error:', e);
    }

    // 3. Fallback: If country is not present / any other country -> default to USD
    return 'USD';
}

// Background GeoIP Verification (Non-blocking asynchronous enhancement)
function checkGeoIpCurrency() {
    try {
        if (localStorage.getItem('webora_selected_currency')) {
            return; // User has explicitly chosen a currency, do not override
        }
    } catch (e) {}

    fetch('https://api.country.is', { cache: 'force-cache' })
        .then(res => res.json())
        .then(data => {
            if (data && data.country) {
                const c = data.country.toUpperCase();
                let geoCurr = 'USD';
                if (c === 'IN') {
                    geoCurr = 'INR';
                } else if (c === 'GB' || c === 'UK') {
                    geoCurr = 'GBP';
                } else {
                    const euCountryCodes = [
                        'AT','BE','BG','HR','CY','CZ','DK','EE','FI','FR','DE','GR','HU','IE',
                        'IT','LV','LT','LU','MT','NL','PL','PT','RO','SK','SI','ES','SE','NO',
                        'IS','CH','LI','MC','AD','SM','VA','ME','MK','AL','RS','BA'
                    ];
                    if (euCountryCodes.includes(c)) {
                        geoCurr = 'EUR';
                    } else {
                        geoCurr = 'USD'; // Any other country -> USD
                    }
                }

                if (geoCurr !== activeCurrency) {
                    switchCurrency(geoCurr, false);
                }
            }
        })
        .catch(() => {
            // Silently fallback to timezone/browser detection if GeoIP is unreachable or blocked
        });
}

function switchCurrency(curr, isManual = false) {
    if (!currencyConfig[curr]) return;
    activeCurrency = curr;

    if (isManual) {
        try {
            localStorage.setItem('webora_selected_currency', curr);
        } catch (e) {}
    }

    // Update Currency Buttons
    const buttons = document.querySelectorAll('.currency-btn');
    buttons.forEach(btn => {
        const isSelected = btn.dataset.currency === curr;
        btn.classList.toggle('active', isSelected);
        btn.setAttribute('aria-selected', isSelected ? 'true' : 'false');
    });

    const cfg = currencyConfig[curr];

    // Update symbols on pricing cards
    document.querySelectorAll('[data-type="currency-symbol"]').forEach(el => {
        el.textContent = cfg.symbol;
    });

    // Update tier amounts on pricing page
    document.querySelectorAll('.price-amount').forEach(el => {
        const val = el.dataset[curr.toLowerCase()];
        if (val) {
            el.textContent = val;
        }
    });

    // Update homepage teaser cards if present
    document.querySelectorAll('.teaser-price').forEach(el => {
        const val = el.dataset[curr.toLowerCase()];
        if (val) {
            el.textContent = val;
        }
    });

    // Update add-on tags in calculator
    updateCalculatorAddonTags();

    // Recalculate calculator estimate
    updateCalculator();
}

function updateCalculatorAddonTags() {
    const addons = [
        { id: 'addon-seo', inr: '₹4,000', gbp: '£50', eur: '€60', usd: '$60' },
        { id: 'addon-blog', inr: '₹5,000', gbp: '£75', eur: '€85', usd: '$90' },
        { id: 'addon-payment', inr: '₹8,000', gbp: '£120', eur: '€140', usd: '$150' },
        { id: 'addon-rush', inr: '₹6,000', gbp: '£90', eur: '€100', usd: '$110' }
    ];

    addons.forEach(item => {
        const input = document.getElementById(item.id);
        if (input) {
            const label = input.closest('.calc-checkbox-label');
            if (label) {
                const tag = label.querySelector('[data-type="addon-tag"]');
                if (tag) {
                    tag.textContent = '+' + item[activeCurrency.toLowerCase()];
                }
            }
        }
    });
}

function selectProjectType(btn, rate) {
    activeTypeRate = rate;
    const allBtns = document.querySelectorAll('.calc-option-btn');
    allBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    updateCalculator();
}

function updateCalculator() {
    const pagesSlider = document.getElementById('calc-pages-slider');
    if (!pagesSlider) return;

    const pages = parseInt(pagesSlider.value, 10) || 1;
    const pagesValLabel = document.getElementById('calc-pages-val');
    if (pagesValLabel) {
        pagesValLabel.textContent = pages === 1 ? '1 Page (Landing)' : `${pages} Pages`;
    }

    const cfg = currencyConfig[activeCurrency];

    // Compute Base Scope Cost
    let rawBase;
    if (pages === 1) {
        rawBase = cfg.baseMin * activeTypeRate;
    } else {
        rawBase = (cfg.baseMin + (pages - 1) * cfg.pageRate) * activeTypeRate;
    }

    // Compute Add-ons
    let addonsTotal = 0;
    const addonCheckboxes = [
        { id: 'addon-seo', inr: 4000, gbp: 50, eur: 60, usd: 60 },
        { id: 'addon-blog', inr: 5000, gbp: 75, eur: 85, usd: 90 },
        { id: 'addon-payment', inr: 8000, gbp: 120, eur: 140, usd: 150 },
        { id: 'addon-rush', inr: 6000, gbp: 90, eur: 100, usd: 110 }
    ];

    addonCheckboxes.forEach(item => {
        const checkbox = document.getElementById(item.id);
        if (checkbox && checkbox.checked) {
            addonsTotal += item[activeCurrency.toLowerCase()];
        }
    });

    const totalCost = Math.round(rawBase + addonsTotal);

    // Format numbers
    const formatNumber = (num) => {
        return num.toLocaleString(cfg.locale);
    };

    const finalPriceEl = document.getElementById('calc-final-price');
    const breakdownBaseEl = document.getElementById('calc-breakdown-base');
    const breakdownAddonsEl = document.getElementById('calc-breakdown-addons');
    const timelineTextEl = document.getElementById('calc-timeline-text');
    const ctaBtn = document.getElementById('calc-cta-btn');

    if (finalPriceEl) finalPriceEl.textContent = `${cfg.symbol}${formatNumber(totalCost)}`;
    if (breakdownBaseEl) breakdownBaseEl.textContent = `${cfg.symbol}${formatNumber(Math.round(rawBase))}`;
    if (breakdownAddonsEl) breakdownAddonsEl.textContent = `${cfg.symbol}${formatNumber(addonsTotal)}`;

    // Dynamic Delivery Timeline
    let days = '3–5 Days';
    if (pages > 10 || activeTypeRate >= 2.0) {
        days = '14–21 Days';
    } else if (pages > 4 || activeTypeRate >= 1.6) {
        days = '7–12 Days';
    }
    const rushCheckbox = document.getElementById('addon-rush');
    if (rushCheckbox && rushCheckbox.checked) {
        days = '48–72 Hours (Express)';
    }

    if (timelineTextEl) {
        timelineTextEl.textContent = `Estimated Delivery: ${days}`;
    }

    if (ctaBtn) {
        ctaBtn.href = `contactus.html?plan=calculator&pages=${pages}&currency=${activeCurrency}&quote=${totalCost}`;
    }
}

// Pricing FAQ Accordion Toggle
function togglePricingFaq(button) {
    const item = button.closest('.faq-accordion-item');
    if (!item) return;

    const isActive = item.classList.contains('active');

    // Close others
    document.querySelectorAll('.faq-accordion-item').forEach(other => {
        if (other !== item) {
            other.classList.remove('active');
            const btn = other.querySelector('.faq-accordion-btn');
            if (btn) btn.setAttribute('aria-expanded', 'false');
        }
    });

    if (isActive) {
        item.classList.remove('active');
        button.setAttribute('aria-expanded', 'false');
    } else {
        item.classList.add('active');
        button.setAttribute('aria-expanded', 'true');
    }
}

// Initialize on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    // 1. Auto-detect visitor country & initialize currency (INR, GBP, EUR, or USD fallback)
    const initialCurrency = detectUserCurrency();
    switchCurrency(initialCurrency, false);
    checkGeoIpCurrency();

    // 2. Calculator init
    if (document.getElementById('calc-pages-slider')) {
        updateCalculator();
    }

    // 3. Pre-fill contact form message from URL parameters (e.g. from pricing tiers or calculator)
    const urlParams = new URLSearchParams(window.location.search);
    const planParam = urlParams.get('plan');
    const messageField = document.getElementById('message');

    if (planParam && messageField && !messageField.value.trim()) {
        const currency = urlParams.get('currency') || activeCurrency || 'USD';
        const quote = urlParams.get('quote');
        const pages = urlParams.get('pages');

        if (planParam === 'starter') {
            messageField.value = `Hi WeboraCo team,\n\nI would like to get started with the "Starter Launch Pad" package (₹9,999 / £150 / €200 / $199).\n\nHere are details about my project and preferred timeline:\n`;
        } else if (planParam === 'business-pro') {
            messageField.value = `Hi WeboraCo team,\n\nI would like to get started with the "Business Growth Pro" package (₹24,999 / £380 / €450 / $499).\n\nHere are details about my business, desired pages, and design references:\n`;
        } else if (planParam === 'growth-scale') {
            messageField.value = `Hi WeboraCo team,\n\nI would like to get started with the "Growth & Catalog Scale" package (₹49,999 / £750 / €890 / $950).\n\nHere are details regarding our product catalog / checkout requirements:\n`;
        } else if (planParam === 'enterprise') {
            messageField.value = `Hi WeboraCo team,\n\nI am looking for an Enterprise / Bespoke Custom Web Application.\n\nHere are our project specifications, integrations, and timeline:\n`;
        } else if (planParam === 'calculator') {
            const sym = currencyConfig[currency]?.symbol || '$';
            messageField.value = `Hi WeboraCo team,\n\nI used your online Scope & Cost Estimator for my project:\n- Estimated Pages: ${pages || 'Custom'}\n- Estimated Quote: ${sym}${quote || ''} (${currency})\n\nHere are additional details about our business and goals:\n`;
        }
    }
});