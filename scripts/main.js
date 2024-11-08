// Simple cursor blink animation
function initCursor() {
    const cursor = document.querySelector('.cursor');
    if (cursor) {
        setInterval(() => {
            cursor.style.opacity = cursor.style.opacity === '0' ? '1' : '0';
        }, 500);
    }
}

// Navigation handling
function initNavigation() {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            const href = e.currentTarget.getAttribute('data-href');
            if (href) {
                window.location.href = href;
            }
        });
    });
}

// Initialize when document is ready
document.addEventListener('DOMContentLoaded', () => {
    initCursor();
    initNavigation();
});
