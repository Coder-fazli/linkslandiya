// Navigation
const navItems = document.querySelectorAll('.nav-item');
const sections = document.querySelectorAll('.section-content');
const pageTitle = document.getElementById('page-title');

navItems.forEach(item => {
    item.addEventListener('click', () => {
        navItems.forEach(nav => nav.classList.remove('active'));
        item.classList.add('active');

        const sectionId = item.dataset.section;
        sections.forEach(section => {
            section.classList.remove('active');
            if (section.id === `section-${sectionId}`) {
                section.classList.add('active');
            }
        });

        const titles = {
            'dashboard': 'Dashboard',
            'websites': 'Websites',
            'orders': 'Orders',
            'users': 'Users',
            'posts': 'Blog Posts',
            'pages': 'Pages',
            'settings': 'Settings'
        };
        pageTitle.textContent = titles[sectionId] || 'Dashboard';

        // Reset all edit views
        hideWebsiteEdit();
        hideOrderDetail();
        hideUserProfile();
        hidePostEdit();
        hidePageEdit();
    });
});

// Tabs
document.querySelectorAll('.tabs').forEach(tabsContainer => {
    const tabs = tabsContainer.querySelectorAll('.tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
        });
    });
});

// Add New Button
document.getElementById('add-new-btn').addEventListener('click', () => {
    const activeSection = document.querySelector('.nav-item.active').dataset.section;

    if (activeSection === 'websites') {
        document.getElementById('website-edit-title').textContent = 'Add New Website';
        showWebsiteEdit();
    } else if (activeSection === 'posts') {
        showPostEdit();
    } else if (activeSection === 'pages') {
        showPageEdit();
    } else if (activeSection === 'users') {
        // Could add user creation form
        alert('User creation form would open here');
    }
});

// Website functions
function showWebsiteEdit() {
    document.getElementById('websites-list').style.display = 'none';
    document.getElementById('website-edit').style.display = 'block';
}

function hideWebsiteEdit() {
    document.getElementById('websites-list').style.display = 'block';
    document.getElementById('website-edit').style.display = 'none';
}

// Order functions
function showOrderDetail(orderId) {
    document.getElementById('orders-list').style.display = 'none';
    document.getElementById('order-detail').style.display = 'block';
}

function hideOrderDetail() {
    document.getElementById('orders-list').style.display = 'block';
    document.getElementById('order-detail').style.display = 'none';
}

// User functions
function showUserProfile(userId) {
    document.getElementById('users-list').style.display = 'none';
    document.getElementById('user-profile').style.display = 'block';
    showUserTab('orders');
}

function hideUserProfile() {
    document.getElementById('users-list').style.display = 'block';
    document.getElementById('user-profile').style.display = 'none';
}

function showUserTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.section-tab').forEach(tab => {
        tab.classList.remove('active');
        if (tab.textContent.toLowerCase() === tabName) {
            tab.classList.add('active');
        }
    });

    // Show/hide tab content
    const tabs = ['orders', 'websites', 'messages', 'activity'];
    tabs.forEach(tab => {
        const el = document.getElementById('user-tab-' + tab);
        if (el) {
            el.style.display = tab === tabName ? 'block' : 'none';
        }
    });
}

// Post functions
function showPostEdit() {
    document.getElementById('posts-list').style.display = 'none';
    document.getElementById('post-edit').style.display = 'block';
}

function hidePostEdit() {
    document.getElementById('posts-list').style.display = 'block';
    document.getElementById('post-edit').style.display = 'none';
}

// Page functions
function showPageEdit() {
    document.getElementById('pages-list').style.display = 'none';
    document.getElementById('page-edit').style.display = 'block';
}

function hidePageEdit() {
    document.getElementById('pages-list').style.display = 'block';
    document.getElementById('page-edit').style.display = 'none';
}

// Chart period selector
document.querySelectorAll('.chart-period').forEach(btn => {
    btn.addEventListener('click', function() {
        this.parentElement.querySelectorAll('.chart-period').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        // In real app, this would update the chart data
    });
});

// Initialize Charts
function initCharts() {
    // Traffic Chart
    const trafficCtx = document.getElementById('trafficChart').getContext('2d');
    const trafficChart = new Chart(trafficCtx, {
        type: 'line',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'Page Views',
                data: [12500, 15200, 14800, 18500, 21200, 19800, 22500],
                borderColor: '#0d9488',
                backgroundColor: 'rgba(13, 148, 136, 0.1)',
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#0d9488',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 4
            }, {
                label: 'Unique Visitors',
                data: [8200, 9800, 9400, 12100, 14500, 13200, 15800],
                borderColor: '#1a365d',
                backgroundColor: 'rgba(26, 54, 93, 0.1)',
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#1a365d',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    align: 'end',
                    labels: {
                        color: '#9ca3af',
                        usePointStyle: true,
                        padding: 20
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        color: 'rgba(55, 65, 81, 0.5)',
                        drawBorder: false
                    },
                    ticks: {
                        color: '#9ca3af'
                    }
                },
                y: {
                    grid: {
                        color: 'rgba(55, 65, 81, 0.5)',
                        drawBorder: false
                    },
                    ticks: {
                        color: '#9ca3af',
                        callback: function(value) {
                            return value >= 1000 ? (value / 1000) + 'K' : value;
                        }
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            }
        }
    });

    // Country Chart (Doughnut)
    const countryCtx = document.getElementById('countryChart').getContext('2d');
    const countryChart = new Chart(countryCtx, {
        type: 'doughnut',
        data: {
            labels: ['United States', 'United Kingdom', 'Germany', 'France', 'Others'],
            datasets: [{
                data: [35, 22, 18, 12, 13],
                backgroundColor: [
                    '#0d9488',
                    '#1a365d',
                    '#8b5cf6',
                    '#f59e0b',
                    '#6b7280'
                ],
                borderColor: '#1f2937',
                borderWidth: 3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#9ca3af',
                        usePointStyle: true,
                        padding: 15,
                        font: {
                            size: 11
                        }
                    }
                }
            },
            cutout: '65%'
        }
    });
}

// Initialize charts when DOM is loaded
document.addEventListener('DOMContentLoaded', initCharts);
