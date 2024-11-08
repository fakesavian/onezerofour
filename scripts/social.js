document.addEventListener('DOMContentLoaded', function() {
    function createFeedItem(item, index) {
        const delay = index * 500;
        setTimeout(() => {
            const feedItem = document.createElement('div');
            feedItem.className = 'feed-item';
            feedItem.innerHTML = `
                <div class="feed-item-header">
                    <span class="feed-item-timestamp">${item.timestamp}</span>
                    <span class="feed-item-status" data-status="${item.status}">${item.status}</span>
                </div>
                <div class="feed-item-content">
                    ${item.content}
                </div>
                <div class="feed-item-stats">
                    <div class="stat-item">
                        <span class="stat-icon">◈</span>
                        <span>LIKES: ${item.likes}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-icon">◊</span>
                        <span>SHARES: ${item.shares}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-icon">□</span>
                        <span>${item.type}</span>
                    </div>
                </div>
            `;
            document.getElementById('feed-items').appendChild(feedItem);
        }, delay);
    }

    // Initialize feed with loading message
    const feedContainer = document.getElementById('feed-items');
    feedContainer.innerHTML = '<div class="loading-text">Establishing neural link...</div>';

    // Load feed items after delay
    setTimeout(() => {
        feedContainer.innerHTML = '';
        feedItems.forEach(createFeedItem);
    }, 2000);
});
