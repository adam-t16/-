document.addEventListener('DOMContentLoaded', () => {
    const storage = new StorageManager();
    const navigation = new Navigation();
    const progress = new ProgressTracker(storage);
});