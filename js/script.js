document.addEventListener('DOMContentLoaded', async () => {
    initExistingUiBehavior();
    initPremiumUiEnhancements();
    await initGarageWaveScr08();
    initImageFallbacks();
    enhanceProductCardLayout();
});

function initExistingUiBehavior() {
    document.body.classList.add('gw-loading');

    const fadeUpElements = document.querySelectorAll('.hero-content, .category-card, .product-card, .split-content, .footer-title, .cart-item, .order-card, .address-card, .profile-sidebar, .gallery-main, .delivery-box');

    fadeUpElements.forEach((el, index) => {
        if (!el.hasAttribute('data-aos')) {
            el.setAttribute('data-aos', 'fade-up');
        }
        if (el.classList.contains('product-card') || el.classList.contains('category-card') || el.classList.contains('cart-item') || el.classList.contains('order-card') || el.classList.contains('address-card')) {
            const delay = (index % 4) * 100;
            if (!el.hasAttribute('data-aos-delay')) {
                el.setAttribute('data-aos-delay', delay.toString());
            }
        }
    });

    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-out-cubic',
            once: true,
            offset: 50
        });
    }

    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('shadow-sm');
                navbar.style.padding = '1rem 0';
            } else {
                navbar.classList.remove('shadow-sm');
                navbar.style.padding = '1.5rem 0';
            }
        });
    }

    const qtySelectors = document.querySelectorAll('.qty-selector');
    qtySelectors.forEach((selector) => {
        const minusBtn = selector.querySelector('.qty-minus');
        const plusBtn = selector.querySelector('.qty-plus');
        const input = selector.querySelector('.qty-input');

        if (minusBtn && plusBtn && input) {
            minusBtn.addEventListener('click', () => {
                const val = parseInt(input.value, 10);
                if (val > 1) {
                    input.value = val - 1;
                }
            });

            plusBtn.addEventListener('click', () => {
                const val = parseInt(input.value, 10);
                input.value = val + 1;
            });
        }
    });

    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    if (typeof bootstrap !== 'undefined') {
        tooltipTriggerList.map((tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl));
    }

    const forms = document.querySelectorAll('form');
    forms.forEach((form) => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
        });
    });

    window.addEventListener('load', () => {
        requestAnimationFrame(() => {
            document.body.classList.remove('gw-loading');
            document.body.classList.add('gw-ready');
        });
    });
}

function initPremiumUiEnhancements() {
    initThemeToggle();
    initMobileActionBar();
    initPageTransitions();
    initParallaxMotion();
    initHoverTilt();
    initRevealOnScroll();
    initCartLocationWidget();
}

function initThemeToggle() {
    const navbarContainer = document.querySelector('.navbar .container');
    if (!navbarContainer || document.getElementById('gw-theme-toggle')) {
        return;
    }

    const toggle = document.createElement('button');
    toggle.id = 'gw-theme-toggle';
    toggle.type = 'button';
    toggle.className = 'gw-theme-toggle nav-icon';
    toggle.setAttribute('aria-label', 'Toggle color theme');
    toggle.innerHTML = '<i class="bi bi-moon-stars"></i>';

    const toggler = navbarContainer.querySelector('.navbar-toggler');
    if (toggler) {
        navbarContainer.insertBefore(toggle, toggler);
    } else {
        navbarContainer.appendChild(toggle);
    }

    const savedTheme = localStorage.getItem('gwTheme') || 'light';
    applyTheme(savedTheme);

    toggle.addEventListener('click', () => {
        const nextTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        applyTheme(nextTheme);
        localStorage.setItem('gwTheme', nextTheme);
        toggle.innerHTML = nextTheme === 'dark' ? '<i class="bi bi-sun"></i>' : '<i class="bi bi-moon-stars"></i>';
        showGwToast(nextTheme === 'dark' ? 'Dark mode enabled' : 'Light mode enabled');
    });
}

function applyTheme(theme) {
    if (theme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
    } else {
        document.documentElement.removeAttribute('data-theme');
    }

    const themeToggle = document.getElementById('gw-theme-toggle');
    if (themeToggle) {
        themeToggle.innerHTML = theme === 'dark' ? '<i class="bi bi-sun"></i>' : '<i class="bi bi-moon-stars"></i>';
    }
}

function initMobileActionBar() {
    if (document.getElementById('gw-mobile-nav')) {
        return;
    }

    const mobileBar = document.createElement('nav');
    mobileBar.id = 'gw-mobile-nav';
    mobileBar.className = 'gw-mobile-nav';
    mobileBar.setAttribute('aria-label', 'Quick actions');
    mobileBar.innerHTML = [
        '<a href="index.html" data-gw-nav-link="home"><span class="gw-icon-stack"><i class="bi bi-house"></i></span></a>',
        '<a href="shop.html" data-gw-nav-link="browse"><span class="gw-icon-stack"><i class="bi bi-grid"></i></span></a>',
        '<a href="cart.html" data-gw-nav-link="cart"><span class="gw-icon-stack"><i class="bi bi-bag"></i></span></a>',
        '<button type="button" data-gw-action="theme"><span class="gw-icon-stack"><i class="bi bi-moon-stars"></i></span></button>',
        '<button type="button" data-gw-action="top"><span class="gw-icon-stack"><i class="bi bi-arrow-up"></i></span></button>'
    ].join('');
    document.body.appendChild(mobileBar);

    mobileBar.querySelector('[data-gw-action="theme"]').addEventListener('click', () => {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        applyTheme(isDark ? 'light' : 'dark');
        localStorage.setItem('gwTheme', isDark ? 'light' : 'dark');
        showGwToast(isDark ? 'Light mode enabled' : 'Dark mode enabled');
    });

    mobileBar.querySelector('[data-gw-action="top"]').addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    mobileBar.querySelectorAll('a[data-gw-nav-link]').forEach((link) => {
        link.addEventListener('click', (event) => {
            if (link.getAttribute('href').startsWith('http')) {
                return;
            }
            event.preventDefault();
            transitionNavigate(link.getAttribute('href'));
        });
    });
}

function initPageTransitions() {
    if (document.body.dataset.gwTransitionsReady === 'true') {
        return;
    }
    document.body.dataset.gwTransitionsReady = 'true';

    document.querySelectorAll('a[href]').forEach((anchor) => {
        const href = anchor.getAttribute('href') || '';
        if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('http')) {
            return;
        }

        anchor.addEventListener('click', (event) => {
            if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
                return;
            }

            if (anchor.target === '_blank') {
                return;
            }

            event.preventDefault();
            transitionNavigate(href);
        });
    });
}

function transitionNavigate(href) {
    document.body.classList.add('gw-leaving');
    setTimeout(() => {
        window.location.href = href;
    }, 160);
}

function initParallaxMotion() {
    const targets = document.querySelectorAll('.hero-section, .about-hero, .collection-hero');
    if (!targets.length) {
        return;
    }

    const update = () => {
        const scrollY = window.scrollY || 0;
        targets.forEach((target) => {
            const offset = Math.max(-22, Math.min(22, scrollY * -0.08));
            target.style.setProperty('--gw-parallax-y', offset.toFixed(2) + 'px');
        });
    };

    update();
    window.addEventListener('scroll', debounce(update, 10), { passive: true });
}

function initHoverTilt() {
    const tiltItems = document.querySelectorAll('.product-card, .category-card, .gw-sale-card, .value-card, .split-banner, .collection-split, .gw-module');
    tiltItems.forEach((item) => {
        item.addEventListener('mousemove', (event) => {
            const rect = item.getBoundingClientRect();
            const x = ((event.clientX - rect.left) / rect.width - 0.5) * 8;
            const y = ((event.clientY - rect.top) / rect.height - 0.5) * -8;
            item.style.transform = `translateY(-6px) rotateX(${y}deg) rotateY(${x}deg)`;
        });

        item.addEventListener('mouseleave', () => {
            item.style.transform = '';
        });
    });
}

function initRevealOnScroll() {
    const revealItems = document.querySelectorAll('.hero-content, .category-card, .product-card, .split-content, .text-wrapper, .page-header, .filter-sidebar, .profile-sidebar, .cart-summary, .order-card, .address-card, .value-card, .gw-module, .gw-sale-card, .gw-location-sheet');
    if (!revealItems.length || !('IntersectionObserver' in window)) {
        return;
    }

    revealItems.forEach((item) => item.classList.add('gw-reveal-item'));

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('gw-revealed');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    revealItems.forEach((item) => observer.observe(item));

    const readyClassTimer = setTimeout(() => {
        document.body.classList.remove('gw-loading');
    }, 450);

    window.addEventListener('load', () => clearTimeout(readyClassTimer));
}

function initImageFallbacks() {
    const images = document.querySelectorAll('img');
    images.forEach((image) => {
        if (image.dataset.fallbackReady === 'true') {
            return;
        }

        image.dataset.fallbackReady = 'true';
        image.loading = image.loading || 'lazy';
        image.decoding = image.decoding || 'async';
        if (!image.referrerPolicy) {
            image.referrerPolicy = 'no-referrer';
        }

        image.addEventListener('error', () => {
            const alt = image.getAttribute('alt') || 'Aura Home';
            image.src = 'img/image-placeholder.svg';
            image.addEventListener('error', () => {
                image.src = createPlaceholderImage(alt);
            }, { once: true });
        }, { once: true });
    });
}

function enhanceProductCardLayout() {
    const cards = document.querySelectorAll('.product-card');
    cards.forEach((card) => {
        const title = card.querySelector('.product-title');
        const price = card.querySelector('.product-price');
        const actionBtn = card.querySelector('.btn.btn-sm.btn-outline-dark.rounded-circle');

        if (!title || !price || !actionBtn) {
            return;
        }

        if (card.dataset.gwCardEnhanced !== 'true') {
            title.insertAdjacentElement('afterend', price);
            price.classList.add('product-price-top');
            card.dataset.gwCardEnhanced = 'true';
        }

        const actionRow = actionBtn.closest('.d-flex');
        if (actionRow) {
            actionRow.classList.add('gw-action-row');
        }

        const priceText = (price.textContent || '').trim();
        actionBtn.classList.add('gw-add-btn');

        
    });
}

function createPlaceholderImage(label) {
    const safeLabel = String(label || 'Aura Home').replace(/[<>]/g, '').slice(0, 28);
    const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="900" viewBox="0 0 1200 900" role="img" aria-label="${safeLabel}">
            <defs>
                <linearGradient id="wall" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#f9fbff"/>
                    <stop offset="100%" stop-color="#e7f0ff"/>
                </linearGradient>
                <linearGradient id="floor" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stop-color="#cfdfff"/>
                    <stop offset="100%" stop-color="#b7cdf6"/>
                </linearGradient>
                <linearGradient id="sofa" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stop-color="#3f83df"/>
                    <stop offset="100%" stop-color="#1f61be"/>
                </linearGradient>
            </defs>
            <rect width="1200" height="900" rx="48" fill="url(#wall)"/>
            <rect y="610" width="1200" height="290" fill="url(#floor)"/>
            <rect x="120" y="92" width="960" height="116" rx="30" fill="rgba(255,255,255,0.84)"/>
            <text x="165" y="168" fill="#0f4ea8" font-family="Arial, sans-serif" font-size="56" font-weight="700">${safeLabel}</text>

            <rect x="330" y="430" width="540" height="175" rx="56" fill="url(#sofa)"/>
            <rect x="290" y="474" width="80" height="130" rx="36" fill="#2f70ca"/>
            <rect x="830" y="474" width="80" height="130" rx="36" fill="#2f70ca"/>
            <rect x="390" y="390" width="190" height="82" rx="34" fill="#6ea2eb"/>
            <rect x="615" y="390" width="190" height="82" rx="34" fill="#6ea2eb"/>

            <circle cx="980" cy="520" r="88" fill="#1e7f55" opacity="0.9"/>
            <rect x="962" y="595" width="36" height="62" rx="14" fill="#a67b4d"/>
            <ellipse cx="980" cy="668" rx="80" ry="20" fill="rgba(56,80,120,0.2)"/>

            <rect x="165" y="500" width="18" height="120" rx="8" fill="#5576a8"/>
            <path d="M130 500h88l-44-95z" fill="#6e8fbe"/>

            <rect x="520" y="640" width="180" height="28" rx="14" fill="#2f66ba" opacity="0.95"/>
            <ellipse cx="610" cy="688" rx="135" ry="18" fill="rgba(56,80,120,0.18)"/>

            <rect x="210" y="270" width="150" height="100" rx="18" fill="#e4efff" stroke="#a8c2ec" stroke-width="10"/>
            <path d="M232 346l36-34 28 24 24-18 22 28" fill="none" stroke="#5a89cf" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>

            <text x="165" y="820" fill="#35547d" font-family="Arial, sans-serif" font-size="34">Aura Home</text>
        </svg>
    `;
    return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg.trim());
}

function initCartLocationWidget() {
    const locationLabel = document.getElementById('gw-cart-location-label');
    const locationStatus = document.getElementById('gw-cart-location-status');
    const locationButton = document.getElementById('gw-use-actual-location');
    const mapFrame = document.getElementById('gw-cart-map-frame');
    const mapNote = document.getElementById('gw-cart-map-note');

    if (!locationLabel || !locationStatus || !locationButton) {
        return;
    }

    const updateMapFrame = (location) => {
        if (!mapFrame || !location) {
            return;
        }

        if (typeof location.lat === 'number' && typeof location.lng === 'number') {
            mapFrame.src = 'https://www.google.com/maps?q=' + location.lat + ',' + location.lng + '&z=14&output=embed';
            if (mapNote) {
                mapNote.textContent = location.label || 'Your current location';
            }
            return;
        }

        if (location.label) {
            mapFrame.src = 'https://www.google.com/maps?q=' + encodeURIComponent(location.label) + '&z=13&output=embed';
            if (mapNote) {
                mapNote.textContent = location.label;
            }
        }
    };

    const savedLocation = loadSavedLocation();
    if (savedLocation && savedLocation.label) {
        locationLabel.textContent = savedLocation.label;
        locationStatus.textContent = 'Loaded from your saved browsing location.';
        updateMapFrame(savedLocation);
    }

    const resolveCurrentLocation = () => {
        if (!navigator.geolocation) {
            locationStatus.textContent = 'Geolocation is not supported in this browser.';
            showGwToast('Location is not supported in this browser.');
            return;
        }

        locationStatus.textContent = 'Resolving original location...';
        locationButton.disabled = true;

        navigator.geolocation.getCurrentPosition(async (position) => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            const normalized = normalizeToMaharashtra(latitude, longitude);

            try {
                const resolved = normalized.forced ? MAHARASHTRA_DEFAULT.label : await reverseGeocode(normalized.lat, normalized.lng);
                const actualLocation = {
                    label: resolved,
                    lat: normalized.lat,
                    lng: normalized.lng
                };

                persistLocation(actualLocation);
                locationLabel.textContent = actualLocation.label;
                locationStatus.textContent = 'Original location loaded successfully.';
                updateMapFrame(actualLocation);
                window.dispatchEvent(new CustomEvent('gw-location-updated', { detail: actualLocation }));
            } catch (error) {
                locationStatus.textContent = 'Could not resolve your current location.';
                showGwToast('Could not resolve your current location.');
            } finally {
                locationButton.disabled = false;
            }
        }, () => {
            locationStatus.textContent = 'Permission denied. Enable location access and try again.';
            locationButton.disabled = false;
            showGwToast('Permission denied.');
        }, { enableHighAccuracy: true, timeout: 10000 });
    };

    locationButton.addEventListener('click', resolveCurrentLocation);
    resolveCurrentLocation();
}

async function initGarageWaveScr08() {
    const state = {
        isLoggedIn: loadAuthMode(),
        unreadNotifications: 2,
        selectedLocation: loadSavedLocation(),
        module: null
    };

    const isHomePage = isGarageWaveHomePage();

    if (isHomePage) {
        injectGarageWaveHeaderControls();
        ensureGlobalLocationSheet();
        ensureGarageWaveModuleOnPage();

        bindGlobalHeaderActions(state);
        bindLocationHandling(state);

        await ensureLeafletAssets();
        initGarageWaveHomeModule(state);
    }
}

function isGarageWaveHomePage() {
    const path = window.location.pathname.replace(/\\/g, '/').toLowerCase();
    return path.endsWith('/index.html') || path.endsWith('/index') || path === '/' || path === '' || path.endsWith('/');
}

function injectGarageWaveHeaderControls() {
    const navbarContainer = document.querySelector('.navbar .container');
    if (!navbarContainer) {
        return;
    }

    if (!document.getElementById('gw-location-trigger')) {
        const locationButton = document.createElement('button');
        locationButton.id = 'gw-location-trigger';
        locationButton.type = 'button';
        locationButton.className = 'gw-location-trigger';
        locationButton.setAttribute('aria-label', 'Open location picker');
        locationButton.innerHTML = '<i class="bi bi-geo-alt-fill"></i><span id="gw-location-label">Select location</span><i class="bi bi-chevron-down"></i>';
        navbarContainer.insertBefore(locationButton, navbarContainer.querySelector('.navbar-toggler') || navbarContainer.firstChild);
    }

    const navIcons = navbarContainer.querySelector('.d-flex.align-items-center') || navbarContainer.querySelector('.d-flex');
    if (navIcons && !document.getElementById('gw-notification-btn')) {
        const bell = document.createElement('button');
        bell.id = 'gw-notification-btn';
        bell.type = 'button';
        bell.className = 'nav-icon gw-header-btn';
        bell.setAttribute('aria-label', 'Notifications');
        bell.innerHTML = '<i class="bi bi-bell"></i><span id="gw-notification-dot" class="gw-notification-dot"></span>';
        navIcons.insertBefore(bell, navIcons.firstElementChild);

        const profileIcon = navIcons.querySelector('a[href="profile.html"] i');
        if (profileIcon) {
            profileIcon.id = 'gw-profile-icon';
        }
    }
}

function ensureGlobalLocationSheet() {
    if (document.getElementById('gw-location-sheet')) {
        return;
    }

    const backdrop = document.createElement('div');
    backdrop.id = 'gw-sheet-backdrop';
    backdrop.className = 'gw-sheet-backdrop gw-hidden';

    const sheet = document.createElement('section');
    sheet.id = 'gw-location-sheet';
    sheet.className = 'gw-location-sheet';
    sheet.setAttribute('aria-label', 'Location Picker');
    sheet.setAttribute('aria-hidden', 'true');
    sheet.innerHTML = [
        '<div class="gw-sheet-handle"></div>',
        '<h2>Choose Browsing Location</h2>',
        '<button id="gw-use-current-location" type="button" class="gw-use-current-btn"><i class="bi bi-crosshair"></i>Use Current Location</button>',
        '<div class="gw-sheet-search"><i class="bi bi-search"></i><input id="gw-location-search-input" type="text" placeholder="Search city, state..."></div>',
        '<div id="gw-location-search-state" class="gw-location-search-state">Type 3+ characters to search locations.</div>',
        '<ul id="gw-location-suggestions" class="gw-location-suggestions"></ul>'
    ].join('');

    const toast = document.createElement('div');
    toast.id = 'gw-toast';
    toast.className = 'gw-toast gw-hidden';
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');

    document.body.appendChild(backdrop);
    document.body.appendChild(sheet);
    document.body.appendChild(toast);
}

function ensureGarageWaveModuleOnPage() {
    if (document.getElementById('gw-sales-list')) {
        ensureAuthToggleInModule();
        return;
    }

    const nav = document.querySelector('.navbar');
    if (!nav || !nav.parentElement) {
        return;
    }

    const host = document.createElement('section');
    host.className = 'container py-5 gw-module-host';
    host.innerHTML = `
        <div class="gw-module">
            <div class="gw-module-head">
                <h2 class="section-title mb-0">GarageWave Nearby Sales</h2>
                <div class="gw-head-right">
                    <span id="gw-results-count" class="gw-results-count">0 results</span>
                    <button id="gw-auth-toggle" type="button" class="gw-auth-toggle">Mode: Guest</button>
                </div>
            </div>

            <div class="gw-search-wrap">
                <i class="bi bi-search"></i>
                <input id="gw-global-search" type="text" placeholder="Search sales, items, city, state...">
                <button id="gw-clear-search" type="button" aria-label="Clear search">Clear</button>
            </div>

            <div class="gw-chips-wrap" id="gw-category-chips"></div>
            <div class="gw-chips-wrap" id="gw-status-chips"></div>

            <div class="gw-map-toggle" role="tablist" aria-label="Map toggle">
                <button type="button" class="gw-toggle-btn active" id="gw-toggle-map-on"><i class="bi bi-map-fill"></i><span>Map On</span></button>
                <button type="button" class="gw-toggle-btn" id="gw-toggle-map-off"><i class="bi bi-map"></i><span>Map Off</span></button>
            </div>

            <section id="gw-map-section" class="gw-map-section">
                <div id="gw-map-loader" class="gw-map-loader gw-hidden">Refreshing map pins...</div>
                <div id="gw-map-empty-state" class="gw-map-empty gw-hidden">No nearby sales for this area.</div>
                <div id="gw-sales-map" class="gw-sales-map" aria-label="Nearby sales map"></div>
            </section>

            <div id="gw-sales-list" class="gw-sales-list" aria-live="polite"></div>
            <div id="gw-list-empty-state" class="gw-list-empty gw-hidden">No sales found. Try changing location, filters, or search.</div>
        </div>
    `;

    nav.insertAdjacentElement('afterend', host);
}

function ensureAuthToggleInModule() {
    const head = document.querySelector('.gw-module-head');
    if (!head || document.getElementById('gw-auth-toggle')) {
        return;
    }

    const right = document.createElement('div');
    right.className = 'gw-head-right';
    right.innerHTML = '<button id="gw-auth-toggle" type="button" class="gw-auth-toggle">Mode: Guest</button>';
    head.appendChild(right);
}

function bindGlobalHeaderActions(state) {
    const label = document.getElementById('gw-location-label');
    const bell = document.getElementById('gw-notification-btn');
    const dot = document.getElementById('gw-notification-dot');
    const profileIcon = document.getElementById('gw-profile-icon');

    function refreshHeaderUi() {
        if (label) {
            label.textContent = state.selectedLocation && state.selectedLocation.label ? state.selectedLocation.label : 'Select location';
        }
        if (dot) {
            dot.classList.toggle('gw-hidden', state.unreadNotifications === 0);
        }
        if (profileIcon) {
            profileIcon.className = state.isLoggedIn ? 'bi bi-person-fill' : 'bi bi-person';
        }
        const authToggle = document.getElementById('gw-auth-toggle');
        if (authToggle) {
            authToggle.textContent = state.isLoggedIn ? 'Mode: Logged In' : 'Mode: Guest';
            authToggle.classList.toggle('logged-in', state.isLoggedIn);
        }
    }

    refreshHeaderUi();

    if (bell) {
        bell.addEventListener('click', () => {
            if (!state.isLoggedIn) {
                showGwToast('Guest mode: login flow for notifications.');
                return;
            }
            showGwToast('Navigate: Notifications screen');
        });
    }

    const profileLink = document.querySelector('a[href="profile.html"]');
    if (profileLink) {
        profileLink.addEventListener('click', (event) => {
            if (!state.isLoggedIn) {
                event.preventDefault();
                showGwToast('Guest mode: login flow for profile.');
            }
        });
    }

    const authToggle = document.getElementById('gw-auth-toggle');
    if (authToggle) {
        authToggle.addEventListener('click', () => {
            state.isLoggedIn = !state.isLoggedIn;
            persistAuthMode(state.isLoggedIn);
            refreshHeaderUi();
            window.dispatchEvent(new CustomEvent('gw-auth-updated', { detail: { isLoggedIn: state.isLoggedIn } }));
            showGwToast(state.isLoggedIn ? 'Mock mode changed: Logged In' : 'Mock mode changed: Guest');
        });
    }

    window.addEventListener('focus', () => {
        if (!state.isLoggedIn && dot) {
            state.unreadNotifications = Math.min(state.unreadNotifications + 1, 5);
            dot.classList.toggle('gw-hidden', state.unreadNotifications === 0);
        }
    });
}

function bindLocationHandling(state) {
    const trigger = document.getElementById('gw-location-trigger');
    const backdrop = document.getElementById('gw-sheet-backdrop');
    const sheet = document.getElementById('gw-location-sheet');
    const useCurrentBtn = document.getElementById('gw-use-current-location');
    const locationInput = document.getElementById('gw-location-search-input');
    const locationState = document.getElementById('gw-location-search-state');
    const suggestionList = document.getElementById('gw-location-suggestions');

    if (!trigger || !backdrop || !sheet || !useCurrentBtn || !locationInput || !locationState || !suggestionList) {
        return;
    }

    let suppressOpenUntil = 0;

    const openSheet = () => {
        backdrop.classList.remove('gw-hidden');
        sheet.classList.add('open');
        sheet.setAttribute('aria-hidden', 'false');
    };

    const closeSheet = () => {
        backdrop.classList.add('gw-hidden');
        sheet.classList.remove('open');
        sheet.setAttribute('aria-hidden', 'true');
    };

    trigger.addEventListener('click', (event) => {
        if (Date.now() < suppressOpenUntil) {
            event.preventDefault();
            event.stopPropagation();
            return;
        }
        openSheet();
    });
    backdrop.addEventListener('click', closeSheet);

    let startY = 0;
    sheet.addEventListener('touchstart', (event) => {
        startY = event.touches[0].clientY;
    });

    sheet.addEventListener('touchmove', (event) => {
        if (event.touches[0].clientY - startY > 110) {
            closeSheet();
        }
    });

    useCurrentBtn.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        suppressOpenUntil = Date.now() + 1600;
        trigger.style.pointerEvents = 'none';
        setTimeout(() => {
            trigger.style.pointerEvents = '';
        }, 1650);

        if (!navigator.geolocation) {
            showGwToast('Location is not supported in this browser.');
            return;
        }

        // Minimize the sheet immediately for a smoother mobile flow.
        closeSheet();
        locationState.textContent = 'Resolving current location...';
        updateHeaderLocationLabel('Locating...');
        navigator.geolocation.getCurrentPosition(async (position) => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            const normalized = normalizeToMaharashtra(latitude, longitude);
            try {
                const resolved = normalized.forced ? MAHARASHTRA_DEFAULT.label : await reverseGeocode(normalized.lat, normalized.lng);
                state.selectedLocation = {
                    label: resolved,
                    lat: normalized.lat,
                    lng: normalized.lng
                };
                persistLocation(state.selectedLocation);
                updateHeaderLocationLabel(state.selectedLocation.label);
                window.dispatchEvent(new CustomEvent('gw-location-updated', { detail: state.selectedLocation }));
                showGwToast('Location updated successfully.');
            } catch (error) {
                updateHeaderLocationLabel(state.selectedLocation && state.selectedLocation.label ? state.selectedLocation.label : 'Select location');
                showGwToast('Could not resolve location name.');
            }
        }, () => {
            locationState.textContent = 'Permission denied. Search manually.';
            updateHeaderLocationLabel(state.selectedLocation && state.selectedLocation.label ? state.selectedLocation.label : 'Select location');
            showGwToast('Permission denied.');
        }, { enableHighAccuracy: true, timeout: 10000 });
    });

    locationInput.addEventListener('input', debounce(async (event) => {
        const query = event.target.value.trim();
        if (query.length < 3) {
            suggestionList.innerHTML = '';
            locationState.textContent = 'Type 3+ characters to search locations.';
            return;
        }

        locationState.textContent = 'Searching locations...';
        const suggestions = await fetchLocationSuggestions(query);

        suggestionList.innerHTML = '';
        if (!suggestions.length) {
            locationState.textContent = 'No suggestions found.';
            return;
        }

        locationState.textContent = 'Select a location.';
        suggestions.forEach((item) => {
            const li = document.createElement('li');
            li.className = 'gw-location-suggestion-item';
            li.textContent = item.label;
            li.addEventListener('click', () => {
                state.selectedLocation = item;
                persistLocation(item);
                updateHeaderLocationLabel(item.label);
                closeSheet();
                window.dispatchEvent(new CustomEvent('gw-location-updated', { detail: item }));
                showGwToast('Browsing location changed.');
            });
            suggestionList.appendChild(li);
        });
    }, 350));
}

function updateHeaderLocationLabel(text) {
    const label = document.getElementById('gw-location-label');
    if (label) {
        label.textContent = text || 'Select location';
    }
}

function initGarageWaveHomeModule(commonState) {
    const dom = {
        categoryChips: document.getElementById('gw-category-chips'),
        statusChips: document.getElementById('gw-status-chips'),
        search: document.getElementById('gw-global-search'),
        clear: document.getElementById('gw-clear-search'),
        mapSection: document.getElementById('gw-map-section'),
        mapEl: document.getElementById('gw-sales-map'),
        mapLoader: document.getElementById('gw-map-loader'),
        mapEmpty: document.getElementById('gw-map-empty-state'),
        list: document.getElementById('gw-sales-list'),
        listEmpty: document.getElementById('gw-list-empty-state'),
        results: document.getElementById('gw-results-count'),
        toggleOn: document.getElementById('gw-toggle-map-on'),
        toggleOff: document.getElementById('gw-toggle-map-off')
    };

    if (!dom.categoryChips || !dom.statusChips || !dom.search || !dom.list || !dom.results) {
        return;
    }

    const categories = ['Furniture', 'Tools', 'Vintage', 'Kids', 'Electronics', 'Decor'];
    const statusOptions = [
        { key: 'live', label: 'Live Now' },
        { key: 'soon', label: 'Starting Soon' },
        { key: 'hot', label: 'Hot Deals' },
        { key: 'all', label: 'All Sales' }
    ];

    const moduleState = {
        query: '',
        selectedStatus: 'all',
        selectedCategories: new Set(),
        mapVisible: true,
        saved: loadSet('gwSavedSales'),
        routed: loadSet('gwRoutedSales'),
        map: null,
        markersLayer: null,
        visible: [],
        sales: buildSalesDataset()
    };

    renderCategoryChips(dom, moduleState, categories);
    renderStatusChips(dom, moduleState, statusOptions);
    bindSearch(dom, moduleState, commonState);
    bindMapToggles(dom, moduleState, commonState);

    if (dom.mapEl && typeof L !== 'undefined') {
        const baseLocation = commonState.selectedLocation || { lat: 19.7515, lng: 75.7139 };
        moduleState.map = L.map(dom.mapEl).setView([baseLocation.lat, baseLocation.lng], 11);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; OpenStreetMap contributors'
        }).addTo(moduleState.map);

        moduleState.markersLayer = L.layerGroup().addTo(moduleState.map);
        moduleState.map.on('moveend', debounce(() => {
            if (!moduleState.mapVisible) {
                return;
            }
            dom.mapLoader.classList.remove('gw-hidden');
            setTimeout(() => {
                refreshHomeModule(dom, moduleState, commonState);
                dom.mapLoader.classList.add('gw-hidden');
            }, 220);
        }, 320));
    }

    window.addEventListener('gw-location-updated', (event) => {
        const loc = event.detail;
        if (moduleState.map && loc && loc.lat && loc.lng) {
            moduleState.map.setView([loc.lat, loc.lng], 12);
        }
        refreshHomeModule(dom, moduleState, commonState);
    });

    window.addEventListener('gw-auth-updated', (event) => {
        commonState.isLoggedIn = event.detail.isLoggedIn;
        refreshHomeModule(dom, moduleState, commonState);
    });

    refreshHomeModule(dom, moduleState, commonState);
}

function renderCategoryChips(dom, moduleState, categories) {
    dom.categoryChips.innerHTML = '';
    categories.forEach((name) => {
        const chip = document.createElement('button');
        chip.type = 'button';
        chip.className = 'gw-chip';
        chip.textContent = name;
        chip.addEventListener('click', () => {
            if (moduleState.selectedCategories.has(name)) {
                moduleState.selectedCategories.delete(name);
                chip.classList.remove('active');
            } else {
                moduleState.selectedCategories.add(name);
                chip.classList.add('active');
            }
            refreshHomeModule(dom, moduleState);
        });
        dom.categoryChips.appendChild(chip);
    });
}

function renderStatusChips(dom, moduleState, options) {
    dom.statusChips.innerHTML = '';
    options.forEach((status) => {
        const chip = document.createElement('button');
        chip.type = 'button';
        chip.className = 'gw-chip gw-status-chip' + (status.key === 'all' ? ' active' : '');
        chip.dataset.key = status.key;
        chip.textContent = status.label;
        chip.addEventListener('click', () => {
            moduleState.selectedStatus = status.key;
            dom.statusChips.querySelectorAll('.gw-status-chip').forEach((el) => el.classList.remove('active'));
            chip.classList.add('active');
            refreshHomeModule(dom, moduleState);
        });
        dom.statusChips.appendChild(chip);
    });
}

function bindSearch(dom, moduleState, commonState) {
    dom.search.addEventListener('input', debounce((event) => {
        moduleState.query = event.target.value.trim().toLowerCase();
        refreshHomeModule(dom, moduleState, commonState);
    }, 300));

    if (dom.clear) {
        dom.clear.addEventListener('click', () => {
            dom.search.value = '';
            moduleState.query = '';
            refreshHomeModule(dom, moduleState, commonState);
        });
    }
}

function bindMapToggles(dom, moduleState, commonState) {
    if (!dom.toggleOn || !dom.toggleOff || !dom.mapSection) {
        return;
    }

    dom.toggleOn.addEventListener('click', () => {
        moduleState.mapVisible = true;
        dom.toggleOn.classList.add('active');
        dom.toggleOff.classList.remove('active');
        dom.mapSection.classList.remove('gw-hidden');
        if (moduleState.map) {
            setTimeout(() => moduleState.map.invalidateSize(), 120);
        }
        refreshHomeModule(dom, moduleState, commonState);
    });

    dom.toggleOff.addEventListener('click', () => {
        moduleState.mapVisible = false;
        dom.toggleOff.classList.add('active');
        dom.toggleOn.classList.remove('active');
        dom.mapSection.classList.add('gw-hidden');
        refreshHomeModule(dom, moduleState, commonState);
    });
}

function refreshHomeModule(dom, moduleState, commonState) {
    const authState = commonState || { isLoggedIn: false };

    moduleState.visible = moduleState.sales.filter((sale) => {
        if (moduleState.query) {
            const txt = [sale.title, sale.items.join(' '), sale.city, sale.state].join(' ').toLowerCase();
            if (!txt.includes(moduleState.query)) {
                return false;
            }
        }

        if (moduleState.selectedCategories.size > 0) {
            const passCategory = sale.categories.some((cat) => moduleState.selectedCategories.has(cat));
            if (!passCategory) {
                return false;
            }
        }

        if (moduleState.selectedStatus !== 'all' && sale.status !== moduleState.selectedStatus) {
            return false;
        }

        if (moduleState.mapVisible && moduleState.map) {
            const bounds = moduleState.map.getBounds();
            if (!bounds.contains([sale.lat, sale.lng])) {
                return false;
            }
        }

        return true;
    });

    dom.results.textContent = moduleState.visible.length + ' ' + (moduleState.visible.length === 1 ? 'result' : 'results');
    renderHomeList(dom, moduleState, authState);
    renderHomePins(dom, moduleState);
}

function renderHomeList(dom, moduleState, commonState) {
    dom.list.innerHTML = '';

    if (!moduleState.visible.length) {
        dom.listEmpty.classList.remove('gw-hidden');
        return;
    }

    dom.listEmpty.classList.add('gw-hidden');

    moduleState.visible.forEach((sale) => {
        const card = document.createElement('article');
        card.className = 'gw-sale-card';
        card.tabIndex = 0;
        card.innerHTML = [
            '<img class="gw-sale-thumb" src="' + sale.image + '" alt="' + sale.title + '">',
            '<div class="gw-sale-body">',
            '<div class="gw-sale-top">',
            '<span class="gw-sale-type">' + sale.type + '</span>',
            '<div class="gw-sale-actions">',
            '<button type="button" class="gw-action-btn" data-action="save"><i class="bi ' + (moduleState.saved.has(sale.id) ? 'bi-heart-fill' : 'bi-heart') + '"></i></button>',
            '<button type="button" class="gw-action-btn" data-action="route"><i class="bi ' + (moduleState.routed.has(sale.id) ? 'bi-check-square-fill' : 'bi-square') + '"></i></button>',
            '</div></div>',
            '<h4>' + sale.title + '</h4>',
            '<p>' + sale.city + ', ' + sale.state + ' • ' + sale.distance + ' mi • ' + sale.dateLabel + '</p>',
            '<span class="gw-sale-status ' + sale.status + '">' + sale.statusLabel + '</span>',
            '</div>'
        ].join('');

        card.addEventListener('click', () => {
            window.location.href = 'product.html?sale=' + encodeURIComponent(sale.id);
        });

        card.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                window.location.href = 'product.html?sale=' + encodeURIComponent(sale.id);
            }
        });

        card.querySelector('[data-action="save"]').addEventListener('click', (event) => {
            event.stopPropagation();
            if (!commonState.isLoggedIn) {
                showGwToast('Guest mode: login flow for save.');
                return;
            }
            if (moduleState.saved.has(sale.id)) {
                moduleState.saved.delete(sale.id);
            } else {
                moduleState.saved.add(sale.id);
            }
            persistSet('gwSavedSales', moduleState.saved);
            refreshHomeModule(dom, moduleState, commonState);
        });

        card.querySelector('[data-action="route"]').addEventListener('click', (event) => {
            event.stopPropagation();
            if (!commonState.isLoggedIn) {
                showGwToast('Guest mode: login flow for route.');
                return;
            }
            if (moduleState.routed.has(sale.id)) {
                moduleState.routed.delete(sale.id);
            } else {
                moduleState.routed.add(sale.id);
            }
            persistSet('gwRoutedSales', moduleState.routed);
            refreshHomeModule(dom, moduleState, commonState);
        });

        dom.list.appendChild(card);
    });
}

function renderHomePins(dom, moduleState) {
    if (!moduleState.markersLayer) {
        return;
    }

    moduleState.markersLayer.clearLayers();
    if (!moduleState.mapVisible) {
        dom.mapEmpty.classList.add('gw-hidden');
        return;
    }

    if (!moduleState.visible.length) {
        dom.mapEmpty.classList.remove('gw-hidden');
        return;
    }

    dom.mapEmpty.classList.add('gw-hidden');

    moduleState.visible.forEach((sale) => {
        let pinClass = 'soon';
        if (sale.status === 'live') {
            pinClass = 'live';
        } else if (sale.status === 'hot') {
            pinClass = 'hot';
        }

        const marker = L.marker([sale.lat, sale.lng], {
            icon: L.divIcon({
                className: '',
                html: '<div class="gw-map-pin ' + pinClass + '">' + sale.type + '</div>',
                iconSize: [106, 28],
                iconAnchor: [53, 14]
            })
        });

        marker.on('click', () => {
            window.location.href = 'product.html?sale=' + encodeURIComponent(sale.id);
        });

        marker.addTo(moduleState.markersLayer);
    });
}

function buildSalesDataset() {
    return [
        {
            id: 'gw-1',
            type: 'Estate Sale',
            title: 'Pune Estate Mega Sale',
            city: 'Pune',
            state: 'MH',
            lat: 18.5204,
            lng: 73.8567,
            status: 'live',
            statusLabel: 'Ends in 2 hrs 45 mins',
            distance: '4.3',
            dateLabel: 'Apr 22',
            items: ['vintage lamp', 'oak table'],
            categories: ['Vintage', 'Furniture'],
            image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?ixlib=rb-4.0.3&auto=format&fit=crop&w=700&q=80'
        },
        {
            id: 'gw-2',
            type: 'Garage Sale',
            title: 'Mumbai Family Garage Sale',
            city: 'Mumbai',
            state: 'MH',
            lat: 19.076,
            lng: 72.8777,
            status: 'soon',
            statusLabel: 'Starts in 1 hrs 20 mins',
            distance: '7.9',
            dateLabel: 'Apr 22-23',
            items: ['kids bike', 'kitchen mixer'],
            categories: ['Kids', 'Decor'],
            image: 'https://images.unsplash.com/photo-1556740749-887f6717d7e4?ixlib=rb-4.0.3&auto=format&fit=crop&w=700&q=80'
        },
        {
            id: 'gw-3',
            type: 'Estate Sale',
            title: 'Nagpur Collector Hot Deals',
            city: 'Nagpur',
            state: 'MH',
            lat: 21.1458,
            lng: 79.0882,
            status: 'hot',
            statusLabel: 'Ends Apr 24',
            distance: '9.2',
            dateLabel: 'Apr 22-24',
            items: ['vinyl records', 'cameras'],
            categories: ['Vintage', 'Electronics'],
            image: 'https://images.unsplash.com/photo-1481437156560-3205f6a55735?ixlib=rb-4.0.3&auto=format&fit=crop&w=700&q=80'
        },
        {
            id: 'gw-4',
            type: 'Garage Sale',
            title: 'Nashik Tool & Tech Weekend',
            city: 'Nashik',
            state: 'MH',
            lat: 19.9975,
            lng: 73.7898,
            status: 'live',
            statusLabel: 'Ends in 5 hrs 10 mins',
            distance: '13.1',
            dateLabel: 'Apr 22',
            items: ['drill set', 'gaming monitor'],
            categories: ['Tools', 'Electronics'],
            image: 'https://images.unsplash.com/photo-1517705008128-361805f42e86?ixlib=rb-4.0.3&auto=format&fit=crop&w=700&q=80'
        }
    ];
}

async function ensureLeafletAssets() {
    if (typeof L !== 'undefined') {
        return;
    }

    if (!document.querySelector('link[data-gw-leaflet]')) {
        const css = document.createElement('link');
        css.rel = 'stylesheet';
        css.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        css.setAttribute('data-gw-leaflet', 'true');
        document.head.appendChild(css);
    }

    if (document.querySelector('script[data-gw-leaflet]')) {
        await waitForLeaflet();
        return;
    }

    await new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.async = true;
        script.setAttribute('data-gw-leaflet', 'true');
        script.onload = resolve;
        script.onerror = resolve;
        document.body.appendChild(script);
    });

    await waitForLeaflet();
}

async function waitForLeaflet() {
    const started = Date.now();
    while (typeof L === 'undefined' && Date.now() - started < 6000) {
        await new Promise((resolve) => setTimeout(resolve, 80));
    }
}

async function fetchLocationSuggestions(query) {
    try {
        const response = await fetch('https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=6&q=' + encodeURIComponent(query));
        if (!response.ok) {
            return [];
        }
        const data = await response.json();
        return data.map((item) => {
            const city = item.address.city || item.address.town || item.address.village || item.address.county || '';
            const state = item.address.state || item.address.region || '';
            return {
                label: [city, state].filter(Boolean).join(', ') || item.display_name,
                lat: Number(item.lat),
                lng: Number(item.lon)
            };
        });
    } catch (error) {
        return [];
    }
}

async function reverseGeocode(lat, lng) {
    const response = await fetch('https://nominatim.openstreetmap.org/reverse?format=json&addressdetails=1&lat=' + lat + '&lon=' + lng);
    if (!response.ok) {
        throw new Error('reverse geocode failed');
    }
    const data = await response.json();
    const city = data.address.city || data.address.town || data.address.village || data.address.county || '';
    const state = data.address.state || data.address.region || '';
    return [city, state].filter(Boolean).join(', ') || 'Current location';
}

const MAHARASHTRA_DEFAULT = {
    label: 'Maharashtra, India',
    lat: 19.7515,
    lng: 75.7139
};

function isWithinMaharashtra(lat, lng) {
    return lat >= 15.6 && lat <= 22.1 && lng >= 72.6 && lng <= 80.9;
}

function normalizeToMaharashtra(lat, lng) {
    if (isWithinMaharashtra(lat, lng)) {
        return { lat, lng, forced: false };
    }
    return { lat: MAHARASHTRA_DEFAULT.lat, lng: MAHARASHTRA_DEFAULT.lng, forced: true };
}

function loadSavedLocation() {
    try {
        const raw = localStorage.getItem('gwSelectedLocation');
        return raw ? JSON.parse(raw) : null;
    } catch (error) {
        return null;
    }
}

function persistLocation(location) {
    try {
        localStorage.setItem('gwSelectedLocation', JSON.stringify(location));
    } catch (error) {
        // Ignore storage failures.
    }
}

function loadAuthMode() {
    try {
        return localStorage.getItem('gwMockLoggedIn') === 'true';
    } catch (error) {
        return false;
    }
}

function persistAuthMode(value) {
    try {
        localStorage.setItem('gwMockLoggedIn', value ? 'true' : 'false');
    } catch (error) {
        // Ignore storage failures.
    }
}

function loadSet(key) {
    try {
        const raw = localStorage.getItem(key);
        const parsed = raw ? JSON.parse(raw) : [];
        return new Set(Array.isArray(parsed) ? parsed : []);
    } catch (error) {
        return new Set();
    }
}

function persistSet(key, setValue) {
    try {
        localStorage.setItem(key, JSON.stringify(Array.from(setValue)));
    } catch (error) {
        // Ignore storage failures.
    }
}

function showGwToast(message) {
    const toast = document.getElementById('gw-toast');
    if (!toast) {
        return;
    }
    toast.textContent = message;
    toast.classList.remove('gw-hidden');
    clearTimeout(showGwToast._timer);
    showGwToast._timer = setTimeout(() => {
        toast.classList.add('gw-hidden');
    }, 2200);
}

function debounce(fn, delay) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => fn(...args), delay);
    };
}
