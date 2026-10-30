import AsyncStorage from "@react-native-async-storage/async-storage";

const ITEMS_KEY = "cache_items";

export async function saveItemsCache(items) {
    const payload = { items, savedAt: new Date().toISOString() };
    await AsyncStorage.setItem(ITEMS_KEY, JSON.stringify(payload));
}

export async function loadItemsCache() {
    const raw = await AsyncStorage.getItem(ITEMS_KEY);
    return raw ? JSON.parse(raw) : null;
}

export async function clearItemsCache() {
    await AsyncStorage.removeItem(ITEMS_KEY);
}