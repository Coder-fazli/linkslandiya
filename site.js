// Site page functionality

// Get site ID from URL
function getSiteIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return parseInt(params.get('id')) || 1;
}

// Get best sellers (sorted by price descending)
function getBestSellers() {
    return [...websites].sort((a, b) => b.price - a.price).slice(0, 10);
}

// Load site data
function loadSiteData() {
    const siteId = getSiteIdFromUrl();
    const site = websites.find(s => s.id === siteId);

    if (!site) {
        window.location.href = 'index.html';
        return;
    }

    // Update page title
    document.title = `${site.name} - Linkslandiya`;

    // Update breadcrumb
    document.getElementById('breadcrumbSite').textContent = site.name;

    // Update favicon
    const favicon = document.getElementById('siteFavicon');
    favicon.textContent = getFaviconInitial(site.name);
    favicon.style.background = `linear-gradient(135deg, ${getFaviconColor(site.name)} 0%, ${getFaviconColor(site.name)}dd 100%)`;

    // Update basic info
    document.getElementById('siteTitle').textContent = site.name;
    document.getElementById('sitePrice').textContent = `$${site.price}`;
    document.getElementById('siteName').textContent = site.name;

    // Update stats
    document.getElementById('siteId').textContent = `LNK-${String(site.id).padStart(3, '0')}`;

    const siteUrl = document.getElementById('siteUrl');
    siteUrl.querySelector('span').textContent = site.name;
    siteUrl.href = `https://${site.name}`;
    siteUrl.target = '_blank';

    document.getElementById('siteCountry').textContent = `${getCountryFlag(site.country)} ${getCountryName(site.country)}`;
    document.getElementById('siteLanguage').textContent = site.language;
    document.getElementById('siteTopic').textContent = site.topic;

    // Update dofollow status
    const dofollowEl = document.getElementById('siteDofollow');
    dofollowEl.innerHTML = site.dofollow
        ? '<span class="status-badge success">Yes</span>'
        : '<span class="status-badge error">No</span>';

    // Update metrics
    document.getElementById('siteDA').textContent = site.da;
    document.getElementById('siteDABar').style.width = `${site.da}%`;

    document.getElementById('siteTraffic').textContent = formatTraffic(site.traffic);
    document.getElementById('siteTrafficBar').style.width = `${getTrafficPercentage(site.traffic)}%`;

    // Setup buttons
    setupButtons(site);
}

// Get full country name
function getCountryName(code) {
    const names = {
        'US': 'United States',
        'UK': 'United Kingdom',
        'DE': 'Germany',
        'FR': 'France',
        'ES': 'Spain',
        'IT': 'Italy',
        'TR': 'Turkey',
        'IN': 'India',
        'BR': 'Brazil',
        'Global': 'Global'
    };
    return names[code] || code;
}

// Setup action buttons
function setupButtons(site) {
    const addToCartBtn = document.getElementById('addToCartBtn');
    const favoriteBtn = document.getElementById('favoriteBtn');

    addToCartBtn.addEventListener('click', () => {
        if (!cart.find(item => item.id === site.id)) {
            cart.push(site);
            cartCount.textContent = cart.length;
            addToCartBtn.innerHTML = `
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20 6L9 17l-5-5"></path>
                </svg>
                Added to Cart
            `;
            addToCartBtn.style.background = 'linear-gradient(135deg, #166534 0%, #22c55e 100%)';
        }
    });

    favoriteBtn.addEventListener('click', () => {
        favoriteBtn.classList.toggle('active');
        if (favoriteBtn.classList.contains('active')) {
            favoriteBtn.innerHTML = `
                <svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
                Favorited
            `;
        } else {
            favoriteBtn.innerHTML = `
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
                Favorite
            `;
        }
    });
}

// Load best sellers sidebar
function loadBestSellers() {
    const bestSellers = getBestSellers();
    const listEl = document.getElementById('bestSellersList');

    listEl.innerHTML = bestSellers.map((site, index) => `
        <a href="site.html?id=${site.id}" class="sidebar-item">
            <div class="sidebar-rank">${index + 1}</div>
            <div class="sidebar-info">
                <div class="sidebar-name">${site.name}</div>
            </div>
            <div class="sidebar-price">$${site.price}</div>
            <button class="sidebar-cart" onclick="event.preventDefault(); addToCartSidebar(${site.id})">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 5v14M5 12h14"></path>
                </svg>
            </button>
        </a>
    `).join('');
}

// Add to cart from sidebar
function addToCartSidebar(id) {
    const site = websites.find(s => s.id === id);
    if (site && !cart.find(item => item.id === id)) {
        cart.push(site);
        cartCount.textContent = cart.length;
    }
}

// Go back
function goBack() {
    if (document.referrer.includes('index.html') || document.referrer.includes(window.location.host)) {
        history.back();
    } else {
        window.location.href = 'index.html';
    }
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    loadSiteData();
    loadBestSellers();
});
