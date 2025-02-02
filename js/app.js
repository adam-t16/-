document.addEventListener('DOMContentLoaded', () => {
    const storage = new StorageManager();
    const navigation = new Navigation();
    const progress = new ProgressTracker(storage);
    const auth = new Auth();
    const settings = new Settings(storage);
    const quiz = new QuizManager(storage);

    // Apply user's theme preference if logged in
    const currentUser = auth.getCurrentUser();
    if (currentUser && currentUser.settings) {
        settings.applyTheme(currentUser.settings.theme);
    }

    // Setup search functionality
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'البحث عن سورة...';
    searchInput.className = 'search-input';
    document.querySelector('#surahs .container').insertBefore(
        searchInput,
        document.querySelector('#surahs .daily-progress')
    );

    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const surahCards = document.querySelectorAll('.surah-card');
        
        surahCards.forEach(card => {
            const surahName = card.querySelector('.surah-name').textContent.toLowerCase();
            card.style.display = surahName.includes(searchTerm) ? 'flex' : 'none';
        });
    });

    // Setup notifications if supported
    if ('Notification' in window) {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                // Schedule daily reminder
                setInterval(() => {
                    const currentUser = auth.getCurrentUser();
                    if (currentUser) {
                        const now = new Date();
                        if (now.getHours() === 9) { // 9 AM reminder
                            new Notification('تذكير بالحفظ', {
                                body: 'حان وقت مراجعة حفظك اليومي!',
                                icon: 'téléchargement.jpg'
                            });
                        }
                    }
                }, 3600000); // Check every hour
            }
        });
    }

    // Add bookmark functionality
    const bookmarkSurah = (surahId) => {
        const currentUser = auth.getCurrentUser();
        if (currentUser) {
            if (!currentUser.bookmarks) currentUser.bookmarks = [];
            
            const index = currentUser.bookmarks.indexOf(surahId);
            if (index === -1) {
                currentUser.bookmarks.push(surahId);
            } else {
                currentUser.bookmarks.splice(index, 1);
            }
            
            localStorage.setItem('quranTracker_currentUser', JSON.stringify(currentUser));
            progress.renderSurahList(); // Refresh the list to show updated bookmarks
        } else {
            alert('يجب تسجيل الدخول لإضافة إشارات مرجعية');
        }
    };

    // Add bookmark buttons to surah cards
    const addBookmarkButtons = () => {
        const surahCards = document.querySelectorAll('.surah-card');
        const currentUser = auth.getCurrentUser();
        
        surahCards.forEach(card => {
            const surahName = card.querySelector('.surah-name').textContent;
            const surah = surahs.find(s => s.name === surahName);
            
            const bookmarkBtn = document.createElement('button');
            bookmarkBtn.className = 'bookmark-button';
            bookmarkBtn.innerHTML = currentUser?.bookmarks?.includes(surah.id) 
                ? '★' 
                : '☆';
            
            bookmarkBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                bookmarkSurah(surah.id);
            });
            
            card.querySelector('.surah-actions').prepend(bookmarkBtn);
        });
    };

    // Call addBookmarkButtons after rendering surah list
    const originalRenderSurahList = progress.renderSurahList.bind(progress);
    progress.renderSurahList = () => {
        originalRenderSurahList();
        addBookmarkButtons();
    };
    
    // Initial render
    progress.renderSurahList();
});