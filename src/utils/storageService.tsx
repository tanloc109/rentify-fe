const storageService = {
    setItem<T>(key: string, value: T): void {
        localStorage.setItem(key, JSON.stringify(value));
    },
    getItem<T>(key: string): T | null {
        const value = localStorage.getItem(key);
        return value ? JSON.parse(value) as T : null;
    },
    removeItem(key: string): void {
        localStorage.removeItem(key);
    },
};

export default storageService;