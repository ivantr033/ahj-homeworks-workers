import NewsWidget from './NewsWidget';
import HasherWidget from './HasherWidget';

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Movie News Widget
    const newsRoot = document.getElementById('news-widget-root');
    if (newsRoot) {
        const newsApp = new NewsWidget(newsRoot);
        newsApp.init();
    }

    // Initialize Hasher Widget
    const hasherRoot = document.getElementById('hasher-widget-root');
    if (hasherRoot) {
        const hasherApp = new HasherWidget(hasherRoot);
        hasherApp.init();
    }

    // Automatic Service Worker Registration in the Web App
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            // Register the file by pointing directly to its source path in the development environment
            navigator.serviceWorker.register('./service-worker.js')
                .then(reg => console.log('✅ Service Worker loaded manually. Scope: ', reg.scope))
                .catch(err => console.error('❌ Registration error: ', err));
        });
    }
});
