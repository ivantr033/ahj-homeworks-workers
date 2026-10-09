export default class NewsWidget {
    constructor(container) {
        this.container = container;
        this.feedBox = container.querySelector('#news-feed-container');
        this.refreshBtn = container.querySelector('#btn-trigger-refresh');
        this.errorMask = container.querySelector('#news-network-error-mask');
        this.apiUrl = 'http://localhost:7070/api/news';
    }

    init() {
        this.refreshBtn.addEventListener('click', () => this.fetchNewsFromServer());
        this.fetchNewsFromServer(); // Initial load upon opening the page
    }

    renderSkeletons() {
        this.errorMask.style.display = 'none';
        this.feedBox.innerHTML = '';

        // Inject 3 rows of gray mock-ups.
        for (let i = 0; i < 3; i++) {
            const skel = document.createElement('div');
            skel.className = 'news-item-row skeleton-active';
            skel.innerHTML = `
        <div class="skeleton-line-date"></div>
        <div class="news-item-content">
          <div class="skeleton-box-avatar"></div>
          <div class="skeleton-text-block">
            <div class="skeleton-text-row w-full"></div>
            <div class="skeleton-text-row w-half"></div>
          </div>
        </div>
      `;
            this.feedBox.appendChild(skel);
        }
    }

    async fetchNewsFromServer() {
        this.renderSkeletons(); // Turn on the gray flashing immediately

        try {
            const response = await fetch(this.apiUrl);

            // If the Buggy Service returns a 500, we force the exception
            if (!response.ok) {
                throw new Error(`Server returned code ${response.status}`);
            }

            const result = await response.json();
            if (result.status === 'ok') {
                this.renderRealNews(result.data);
            }
        } catch (err) {
            console.warn('Buggy Service falló. Activando contenedor fuera de línea...', err);
            // If the internet goes down or the server returns a 500 error, the central notification appears
            this.feedBox.innerHTML = '';
            this.errorMask.style.display = 'flex';
        }
    }

    renderRealNews(newsArray) {
        this.errorMask.style.display = 'none';
        this.feedBox.innerHTML = '';

        newsArray.forEach(news => {
            const item = document.createElement('div');
            item.className = 'news-item-row';
            item.innerHTML = `
        <div class="news-item-date">${news.date}</div>
        <div class="news-item-content">
          <div class="news-avatar-mock"></div>
          <div class="news-text-desc">${news.title}</div>
        </div>
      `;
            this.feedBox.appendChild(item);
        });
    }
}
