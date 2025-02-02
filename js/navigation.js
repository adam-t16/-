class Navigation {
    constructor() {
        this.pages = document.querySelectorAll('.page');
        this.links = document.querySelectorAll('.nav-link');
        this.setupEventListeners();
    }

    setupEventListeners() {
        this.links.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const pageId = link.getAttribute('data-page');
                this.navigateToPage(pageId);
            });
        });

        window.addEventListener('hashchange', () => {
            const hash = window.location.hash.slice(1) || 'home';
            this.navigateToPage(hash);
        });

        // Handle initial load
        const initialHash = window.location.hash.slice(1) || 'home';
        this.navigateToPage(initialHash);
    }

    navigateToPage(pageId) {
        this.pages.forEach(page => {
            page.classList.remove('active');
        });
        this.links.forEach(link => {
            link.classList.remove('active');
        });

        document.getElementById(pageId).classList.add('active');
        document.querySelector(`[data-page="${pageId}"]`).classList.add('active');
        window.location.hash = pageId;
    }
}