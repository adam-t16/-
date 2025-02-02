class ProgressTracker {
    constructor(storageManager) {
        this.storage = storageManager;
        this.modal = document.getElementById('surahModal');
        this.setupEventListeners();
        this.renderSurahList();
        this.updateProgress();
    }

    setupEventListeners() {
        document.getElementById('addProgress').addEventListener('click', () => {
            const input = document.getElementById('dailyAyat');
            const ayatCount = parseInt(input.value);
            if (ayatCount > 0) {
                this.addDailyProgress(ayatCount);
                input.value = '';
            }
        });

        document.querySelector('.close-modal').addEventListener('click', () => {
            this.modal.style.display = 'none';
        });

        window.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.modal.style.display = 'none';
            }
        });

        document.getElementById('markComplete').addEventListener('click', () => {
            const surahId = parseInt(this.modal.getAttribute('data-surah-id'));
            this.completeSurah(surahId);
        });
    }

    renderSurahList() {
        const data = this.storage.getData();
        const container = document.getElementById('surahList');
        container.innerHTML = '';

        data.surahs.forEach(surah => {
            const surahElement = document.createElement('div');
            surahElement.className = 'surah-card';
            surahElement.innerHTML = `
                <div class="surah-info">
                    <h3 class="surah-name">${surah.name}</h3>
                    <p class="surah-meta">${surah.memorized}/${surah.ayahs} آية محفوظة</p>
                </div>
                <div class="surah-actions">
                    <button class="button" ${surah.isComplete ? 'disabled' : ''}>
                        ${surah.isComplete ? 'مكتمل' : 'عرض'}
                    </button>
                    <a href="${surah.quranUrl}" class="button secondary" target="_blank">
                        قراءة السورة
                    </a>
                </div>
            `;

            const viewButton = surahElement.querySelector('button');
            if (!surah.isComplete) {
                viewButton.addEventListener('click', () => {
                    this.showSurahDetails(surah);
                });
            }

            container.appendChild(surahElement);
        });
    }

    showSurahDetails(surah) {
        const modalTitle = document.getElementById('modalSurahName');
        const progressBar = document.getElementById('surahProgress');
        const progressText = progressBar.nextElementSibling;
        const readFullSurah = document.getElementById('readFullSurah');
        
        modalTitle.textContent = surah.name;
        this.modal.setAttribute('data-surah-id', surah.id);
        
        const progress = (surah.memorized / surah.ayahs) * 100;
        progressBar.style.width = `${progress}%`;
        progressText.textContent = `${Math.round(progress)}%`;
        
        readFullSurah.href = surah.quranUrl;
        
        document.getElementById('markComplete').style.display = 
            surah.isComplete ? 'none' : 'block';
        
        this.modal.style.display = 'block';
    }

    completeSurah(surahId) {
        const data = this.storage.updateSurah(surahId, {
            isComplete: true,
            memorized: this.storage.getData().surahs.find(s => s.id === surahId).ayahs
        });
        this.updateProgress();
        this.renderSurahList();
        this.modal.style.display = 'none';
    }

    addDailyProgress(ayatCount) {
        const data = this.storage.addDailyProgress(ayatCount);
        this.updateProgress();
        this.renderProgressHistory();
    }

    updateProgress() {
        const data = this.storage.getData();
        const totalAyat = data.totalAyat;
        const totalPossibleAyat = data.surahs.reduce((sum, surah) => sum + surah.ayahs, 0);
        
        const progress = (totalAyat / totalPossibleAyat) * 100;
        const progressBar = document.getElementById('totalProgress');
        const progressText = progressBar.nextElementSibling;
        
        progressBar.style.width = `${progress}%`;
        progressText.textContent = `${Math.round(progress)}%`;
        
        document.getElementById('totalAyat').textContent = totalAyat;
        document.getElementById('completedSurahs').textContent = 
            data.surahs.filter(s => s.isComplete).length;
        
        this.updateDailyAverage(data);
    }

    updateDailyAverage(data) {
        if (data.dailyProgress.length === 0) {
            document.getElementById('dailyAverage').textContent = '0';
            return;
        }

        const total = data.dailyProgress.reduce((sum, day) => sum + day.ayahsMemorized, 0);
        const average = Math.round(total / data.dailyProgress.length);
        document.getElementById('dailyAverage').textContent = average;
    }

    renderProgressHistory() {
        const data = this.storage.getData();
        const container = document.getElementById('progressHistory');
        container.innerHTML = '';

        data.dailyProgress.slice(-7).reverse().forEach(day => {
            const dayElement = document.createElement('div');
            dayElement.className = 'history-item';
            dayElement.innerHTML = `
                <p>${day.date}: تم حفظ ${day.ayahsMemorized} آية</p>
            `;
            container.appendChild(dayElement);
        });
    }
}