class StorageManager {
    constructor() {
        this.STORAGE_KEY = 'quranTracker';
        this.initializeStorage();
    }

    initializeStorage() {
        if (!localStorage.getItem(this.STORAGE_KEY)) {
            const initialData = {
                surahs: surahs.map(surah => ({
                    ...surah,
                    memorized: 0,
                    isComplete: false
                })),
                dailyProgress: [],
                totalAyat: 0
            };
            this.saveData(initialData);
        }
    }

    getData() {
        return JSON.parse(localStorage.getItem(this.STORAGE_KEY));
    }

    saveData(data) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    }

    updateSurah(surahId, updates) {
        const data = this.getData();
        data.surahs = data.surahs.map(surah => 
            surah.id === surahId ? { ...surah, ...updates } : surah
        );
        this.saveData(data);
        return data;
    }

    addDailyProgress(ayatCount) {
        const data = this.getData();
        const today = new Date().toISOString().split('T')[0];
        
        data.dailyProgress.push({
            date: today,
            ayahsMemorized: ayatCount
        });
        
        data.totalAyat += ayatCount;
        this.saveData(data);
        return data;
    }
}