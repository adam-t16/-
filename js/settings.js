class Settings {
    constructor(storageManager) {
        this.storage = storageManager;
        this.setupSettingsUI();
    }

    setupSettingsUI() {
        const settingsButton = document.createElement('button');
        settingsButton.className = 'settings-button';
        settingsButton.innerHTML = '⚙️';
        settingsButton.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 20px;
            z-index: 1000;
            background: var(--primary-color);
            color: white;
            border: none;
            border-radius: 50%;
            width: 50px;
            height: 50px;
            cursor: pointer;
            font-size: 24px;
        `;

        document.body.appendChild(settingsButton);
        settingsButton.addEventListener('click', () => this.showSettingsModal());
    }

    showSettingsModal() {
        const user = JSON.parse(localStorage.getItem('quranTracker_currentUser'));
        const settings = user ? user.settings : { dailyGoal: 5, theme: 'light' };

        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.display = 'block';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close-modal">&times;</span>
                <h2>الإعدادات</h2>
                <form id="settingsForm">
                    <div class="form-group">
                        <label for="dailyGoal">الهدف اليومي (عدد الآيات)</label>
                        <input type="number" id="dailyGoal" value="${settings.dailyGoal}" min="1">
                    </div>
                    <div class="form-group">
                        <label for="theme">المظهر</label>
                        <select id="theme">
                            <option value="light" ${settings.theme === 'light' ? 'selected' : ''}>فاتح</option>
                            <option value="dark" ${settings.theme === 'dark' ? 'selected' : ''}>داكن</option>
                        </select>
                    </div>
                    <button type="submit" class="button">حفظ الإعدادات</button>
                </form>
            </div>
        `;

        document.body.appendChild(modal);
        this.setupModalListeners(modal);

        const settingsForm = document.getElementById('settingsForm');
        settingsForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveSettings({
                dailyGoal: parseInt(settingsForm.querySelector('#dailyGoal').value),
                theme: settingsForm.querySelector('#theme').value
            });
            modal.remove();
        });
    }

    setupModalListeners(modal) {
        const closeBtn = modal.querySelector('.close-modal');
        closeBtn.addEventListener('click', () => modal.remove());
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });
    }

    saveSettings(newSettings) {
        const currentUser = JSON.parse(localStorage.getItem('quranTracker_currentUser'));
        if (currentUser) {
            currentUser.settings = newSettings;
            localStorage.setItem('quranTracker_currentUser', JSON.stringify(currentUser));
            
            // Apply theme immediately
            this.applyTheme(newSettings.theme);
        }
    }

    applyTheme(theme) {
        document.body.classList.remove('theme-light', 'theme-dark');
        document.body.classList.add(`theme-${theme}`);
    }
}