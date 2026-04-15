import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export function useAsyncStorage<T>(key: string, initialValue: T) {
    const [value, setValue] = useState<T>(initialValue);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const stored = await AsyncStorage.getItem(key);
                if (stored !== null) {
                    setValue(JSON.parse(stored));
                }
            } catch (e) {
                console.error("AsyncStorage load error:", e);
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [key]);

    const setStoredValue = async (newValue: T) => {
        try {
            setValue(newValue);
            await AsyncStorage.setItem(key, JSON.stringify(newValue));
        } catch (e) {
            console.error("AsyncStorage save error:", e);
        }
    };

    return { value, setValue: setStoredValue, loading };
}