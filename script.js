// Sample website data
const websites = [
    { id: 1, name: "techblog.com", dofollow: true, da: 65, traffic: 125000, country: "US", language: "English", topic: "Technology", price: 150 },
    { id: 2, name: "healthnews.org", dofollow: true, da: 52, traffic: 80000, country: "UK", language: "English", topic: "Health", price: 95 },
    { id: 3, name: "businessinsider.de", dofollow: true, da: 71, traffic: 250000, country: "DE", language: "German", topic: "Business", price: 200 },
    { id: 4, name: "travelmag.fr", dofollow: false, da: 38, traffic: 45000, country: "FR", language: "French", topic: "Travel", price: 60 },
    { id: 5, name: "financenews.com", dofollow: true, da: 58, traffic: 95000, country: "US", language: "English", topic: "Finance", price: 120 },
    { id: 6, name: "sportsdaily.es", dofollow: true, da: 44, traffic: 67000, country: "ES", language: "Spanish", topic: "Sports", price: 75 },
    { id: 7, name: "lifestyleblog.it", dofollow: true, da: 35, traffic: 32000, country: "IT", language: "Italian", topic: "Lifestyle", price: 50 },
    { id: 8, name: "technews.tr", dofollow: true, da: 41, traffic: 55000, country: "TR", language: "Turkish", topic: "Technology", price: 45 },
    { id: 9, name: "eduportal.in", dofollow: false, da: 48, traffic: 120000, country: "IN", language: "Hindi", topic: "Education", price: 40 },
    { id: 10, name: "entertainhub.com", dofollow: true, da: 62, traffic: 180000, country: "US", language: "English", topic: "Entertainment", price: 130 },
    { id: 11, name: "globalnews.com", dofollow: true, da: 75, traffic: 450000, country: "Global", language: "English", topic: "News", price: 250 },
    { id: 12, name: "healthtips.de", dofollow: true, da: 42, traffic: 38000, country: "DE", language: "German", topic: "Health", price: 70 },
    { id: 13, name: "bizweekly.uk", dofollow: true, da: 55, traffic: 72000, country: "UK", language: "English", topic: "Business", price: 100 },
    { id: 14, name: "techworld.br", dofollow: false, da: 33, traffic: 28000, country: "BR", language: "Portuguese", topic: "Technology", price: 35 },
    { id: 15, name: "travelguide.es", dofollow: true, da: 47, traffic: 58000, country: "ES", language: "Spanish", topic: "Travel", price: 80 },
    { id: 16, name: "financepro.com", dofollow: true, da: 68, traffic: 210000, country: "US", language: "English", topic: "Finance", price: 180 },
    { id: 17, name: "sportnews.fr", dofollow: true, da: 51, traffic: 89000, country: "FR", language: "French", topic: "Sports", price: 90 },
    { id: 18, name: "lifestyle360.com", dofollow: true, da: 45, traffic: 62000, country: "UK", language: "English", topic: "Lifestyle", price: 85 },
    { id: 19, name: "edublog.com", dofollow: true, da: 53, traffic: 95000, country: "US", language: "English", topic: "Education", price: 110 },
    { id: 20, name: "newsportal.tr", dofollow: true, da: 39, traffic: 48000, country: "TR", language: "Turkish", topic: "News", price: 55 },
];

// Favicon colors based on first letter
const faviconColors = {
    'a': '#ef4444', 'b': '#f97316', 'c': '#eab308', 'd': '#84cc16',
    'e': '#22c55e', 'f': '#14b8a6', 'g': '#06b6d4', 'h': '#0ea5e9',
    'i': '#3b82f6', 'j': '#6366f1', 'k': '#8b5cf6', 'l': '#a855f7',
    'm': '#d946ef', 'n': '#ec4899', 'o': '#f43f5e', 'p': '#ef4444',
    'q': '#f97316', 'r': '#eab308', 's': '#84cc16', 't': '#0d9488',
    'u': '#06b6d4', 'v': '#0ea5e9', 'w': '#3b82f6', 'x': '#6366f1',
    'y': '#8b5cf6', 'z': '#a855f7'
};

// State
let filteredWebsites = [...websites];
let currentPage = 1;
const itemsPerPage = 10;
let cart = [];

// DOM Elements
const tableBody = document.getElementById('websiteTableBody');
const pagination = document.getElementById('pagination');
const priceMin = document.getElementById('priceMin');
const priceMax = document.getElementById('priceMax');
const trafficFilter = document.getElementById('trafficFilter');
const countryFilter = document.getElementById('countryFilter');
const languageFilter = document.getElementById('languageFilter');
const topicFilter = document.getElementById('topicFilter');
const daFilter = document.getElementById('daFilter');
const searchInput = document.getElementById('searchInput');
const applyFiltersBtn = document.getElementById('applyFilters');
const resetFiltersBtn = document.getElementById('resetFilters');
const cartCount = document.querySelector('.cart-count');
const filterToggle = document.getElementById('filterToggle');
const filterContent = document.getElementById('filterContent');
const modalOverlay = document.getElementById('modalOverlay');
const modalContent = document.getElementById('modalContent');
const modalClose = document.getElementById('modalClose');

// Mobile navigation elements
const menuToggle = document.getElementById('menuToggle');
const mobileNavOverlay = document.getElementById('mobileNavOverlay');
const mobileNavClose = document.getElementById('mobileNavClose');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderTable();
    renderPagination();
    setupEventListeners();
});

// Event Listeners
function setupEventListeners() {
    applyFiltersBtn.addEventListener('click', applyFilters);
    resetFiltersBtn.addEventListener('click', resetFilters);
    searchInput.addEventListener('input', debounce(applyFilters, 300));

    // Mobile filter toggle
    filterToggle.addEventListener('click', toggleFilters);

    // Modal events
    modalClose.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeModal();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });

    // Mobile navigation events
    menuToggle.addEventListener('click', openMobileNav);
    mobileNavClose.addEventListener('click', closeMobileNav);
    mobileNavOverlay.addEventListener('click', (e) => {
        if (e.target === mobileNavOverlay) closeMobileNav();
    });
}

// Open mobile navigation
function openMobileNav() {
    mobileNavOverlay.classList.add('show');
    document.body.style.overflow = 'hidden';
}

// Close mobile navigation
function closeMobileNav() {
    mobileNavOverlay.classList.remove('show');
    document.body.style.overflow = '';
}

// Toggle filter panel on mobile
function toggleFilters() {
    filterToggle.classList.toggle('active');
    filterContent.classList.toggle('show');
}

// Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply Filters
function applyFilters() {
    filteredWebsites = websites.filter(site => {
        // Price filter
        const minPrice = priceMin.value ? parseFloat(priceMin.value) : 0;
        const maxPrice = priceMax.value ? parseFloat(priceMax.value) : Infinity;
        if (site.price < minPrice || site.price > maxPrice) return false;

        // Traffic filter
        if (trafficFilter.value) {
            const [min, max] = parseTrafficRange(trafficFilter.value);
            if (site.traffic < min || site.traffic > max) return false;
        }

        // Country filter
        if (countryFilter.value && site.country !== countryFilter.value) return false;

        // Language filter
        if (languageFilter.value && site.language !== languageFilter.value) return false;

        // Topic filter
        if (topicFilter.value && site.topic !== topicFilter.value) return false;

        // DA filter
        if (daFilter.value) {
            const [min, max] = parseDARange(daFilter.value);
            if (site.da < min || site.da > max) return false;
        }

        // Search filter
        if (searchInput.value) {
            const search = searchInput.value.toLowerCase();
            if (!site.name.toLowerCase().includes(search)) return false;
        }

        return true;
    });

    currentPage = 1;
    renderTable();
    renderPagination();
}

// Parse traffic range
function parseTrafficRange(value) {
    if (value === '500000+') return [500000, Infinity];
    const [min, max] = value.split('-').map(Number);
    return [min, max];
}

// Parse DA range
function parseDARange(value) {
    const [min, max] = value.split('-').map(Number);
    return [min, max];
}

// Reset Filters
function resetFilters() {
    priceMin.value = '';
    priceMax.value = '';
    trafficFilter.value = '';
    countryFilter.value = '';
    languageFilter.value = '';
    topicFilter.value = '';
    daFilter.value = '';
    searchInput.value = '';

    filteredWebsites = [...websites];
    currentPage = 1;
    renderTable();
    renderPagination();

    // Close filter panel on mobile after reset
    closeFiltersOnMobile();
}

// Close filters on mobile
function closeFiltersOnMobile() {
    if (window.innerWidth <= 768) {
        filterToggle.classList.remove('active');
        filterContent.classList.remove('show');
    }
}

// Get favicon color
function getFaviconColor(name) {
    const firstLetter = name.charAt(0).toLowerCase();
    return faviconColors[firstLetter] || '#64748b';
}

// Get favicon initial
function getFaviconInitial(name) {
    return name.charAt(0).toUpperCase();
}

// Get DA color based on value
function getDAColor(da) {
    if (da >= 60) return '#0d9488';
    if (da >= 40) return '#14b8a6';
    if (da >= 20) return '#5eead4';
    return '#99f6e4';
}

// Get traffic percentage (max 500K for 100%)
function getTrafficPercentage(traffic) {
    const maxTraffic = 500000;
    return Math.min((traffic / maxTraffic) * 100, 100);
}

// Render Table
function renderTable() {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageData = filteredWebsites.slice(start, end);

    if (pageData.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="9">
                    <div class="no-results">
                        <h3>No websites found</h3>
                        <p>Try adjusting your filters</p>
                    </div>
                </td>
            </tr>
        `;
        return;
    }

    tableBody.innerHTML = pageData.map(site => `
        <tr>
            <td data-label="">
                <div class="website-cell">
                    <div class="website-favicon" style="background: linear-gradient(135deg, ${getFaviconColor(site.name)} 0%, ${getFaviconColor(site.name)}dd 100%); color: white;">
                        ${getFaviconInitial(site.name)}
                    </div>
                    <span class="website-name">${site.name}</span>
                </div>
            </td>
            <td data-label="Dofollow">
                <div class="status-icon ${site.dofollow ? 'success' : 'error'}" title="${site.dofollow ? 'Dofollow' : 'Nofollow'}">
                    ${site.dofollow ? '&#10003;' : '&#10007;'}
                </div>
            </td>
            <td class="progress-cell" data-label="DA (Moz)">
                <div class="progress-wrapper">
                    <span class="progress-value">${site.da}</span>
                    <div class="progress-bar">
                        <div class="progress-fill da" style="width: ${site.da}%;"></div>
                    </div>
                </div>
            </td>
            <td class="progress-cell" data-label="Traffic">
                <div class="progress-wrapper">
                    <span class="progress-value">${formatTraffic(site.traffic)}</span>
                    <div class="progress-bar">
                        <div class="progress-fill traffic" style="width: ${getTrafficPercentage(site.traffic)}%;"></div>
                    </div>
                </div>
            </td>
            <td data-label="Country"><span class="badge badge-country">${getCountryFlag(site.country)} ${site.country}</span></td>
            <td data-label="Language">${site.language}</td>
            <td data-label="Topic"><span class="badge badge-topic">${site.topic}</span></td>
            <td class="price-cell" data-label="Price">$${site.price}</td>
            <td data-label="">
                <div class="table-actions">
                    <button class="btn-add" onclick="addToCart(${site.id})">Add</button>
                    <button class="btn-view" onclick="viewSite(${site.id})">View</button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Get country flag emoji
function getCountryFlag(country) {
    const flags = {
        'US': '🇺🇸',
        'UK': '🇬🇧',
        'DE': '🇩🇪',
        'FR': '🇫🇷',
        'ES': '🇪🇸',
        'IT': '🇮🇹',
        'TR': '🇹🇷',
        'IN': '🇮🇳',
        'BR': '🇧🇷',
        'Global': '🌍'
    };
    return flags[country] || '🌐';
}

// Format traffic number
function formatTraffic(num) {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(0) + 'K';
    return num.toString();
}

// Render Pagination
function renderPagination() {
    const totalPages = Math.ceil(filteredWebsites.length / itemsPerPage);

    if (totalPages <= 1) {
        pagination.innerHTML = '';
        return;
    }

    let html = '';

    // Previous button
    html += `<button class="pagination-btn" onclick="goToPage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>&#8249; Prev</button>`;

    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
            html += `<button class="pagination-btn ${i === currentPage ? 'active' : ''}" onclick="goToPage(${i})">${i}</button>`;
        } else if (i === currentPage - 2 || i === currentPage + 2) {
            html += `<button class="pagination-btn" disabled>...</button>`;
        }
    }

    // Next button
    html += `<button class="pagination-btn" onclick="goToPage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}">Next &#8250;</button>`;

    pagination.innerHTML = html;
}

// Go to page
function goToPage(page) {
    const totalPages = Math.ceil(filteredWebsites.length / itemsPerPage);
    if (page < 1 || page > totalPages) return;
    currentPage = page;
    renderTable();
    renderPagination();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Add to cart
function addToCart(id) {
    const site = websites.find(s => s.id === id);
    if (site && !cart.find(item => item.id === id)) {
        cart.push(site);
        cartCount.textContent = cart.length;

        // Visual feedback
        const btn = event.target;
        const originalText = btn.textContent;
        btn.textContent = 'Added!';
        btn.style.background = 'linear-gradient(135deg, #166534 0%, #22c55e 100%)';
        setTimeout(() => {
            btn.textContent = originalText;
            btn.style.background = '';
        }, 1500);
    } else if (cart.find(item => item.id === id)) {
        // Already in cart feedback
        const btn = event.target;
        btn.textContent = 'In Cart';
        setTimeout(() => {
            btn.textContent = 'Add';
        }, 1000);
    }
}

// View site details - show modal
function viewSite(id) {
    const site = websites.find(s => s.id === id);
    if (site) {
        modalContent.innerHTML = `
            <div class="modal-header">
                <div class="modal-favicon" style="background: linear-gradient(135deg, ${getFaviconColor(site.name)} 0%, ${getFaviconColor(site.name)}dd 100%);">
                    ${getFaviconInitial(site.name)}
                </div>
                <div>
                    <div class="modal-title">${site.name}</div>
                    <div class="modal-subtitle">Guest Post Opportunity</div>
                </div>
            </div>

            <div class="modal-stats">
                <div class="modal-stat">
                    <div class="modal-stat-label">DA (Moz)</div>
                    <div class="modal-stat-value">${site.da}</div>
                    <div class="modal-stat-bar">
                        <div class="modal-stat-bar-fill" style="width: ${site.da}%;"></div>
                    </div>
                </div>
                <div class="modal-stat">
                    <div class="modal-stat-label">Traffic</div>
                    <div class="modal-stat-value">${formatTraffic(site.traffic)}</div>
                    <div class="modal-stat-bar">
                        <div class="modal-stat-bar-fill" style="width: ${getTrafficPercentage(site.traffic)}%; background: linear-gradient(90deg, #6366f1 0%, #818cf8 100%);"></div>
                    </div>
                </div>
            </div>

            <div class="modal-tags">
                <span class="modal-tag country">${getCountryFlag(site.country)} ${site.country}</span>
                <span class="modal-tag language">${site.language}</span>
                <span class="modal-tag topic">${site.topic}</span>
                <span class="modal-tag ${site.dofollow ? 'dofollow' : 'nofollow'}">${site.dofollow ? 'Dofollow' : 'Nofollow'}</span>
            </div>

            <div class="modal-price">
                <div class="modal-price-label">Price</div>
                <div class="modal-price-value">$${site.price}</div>
            </div>

            <div class="modal-actions">
                <button class="modal-btn modal-btn-secondary" onclick="viewDetails(${site.id})">View Details</button>
                <button class="modal-btn modal-btn-primary" onclick="addToCartFromModal(${site.id})">Add to Cart</button>
            </div>
        `;

        openModal();
    }
}

// Open modal
function openModal() {
    modalOverlay.classList.add('show');
    document.body.style.overflow = 'hidden';
}

// Close modal
function closeModal() {
    modalOverlay.classList.remove('show');
    document.body.style.overflow = '';
}

// Add to cart from modal
function addToCartFromModal(id) {
    const site = websites.find(s => s.id === id);
    if (site && !cart.find(item => item.id === id)) {
        cart.push(site);
        cartCount.textContent = cart.length;
        closeModal();
    } else if (cart.find(item => item.id === id)) {
        closeModal();
    }
}

// View details - go to single page
function viewDetails(id) {
    window.location.href = `site.html?id=${id}`;
}
