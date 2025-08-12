import { useState } from "react";

export default function useLocalStorage(key, initialValue) {
    const [storedvalue, setStoredValue] = useState(() => {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.warn('Error in reading local storage', error);
            return initialValue;
        }
    })

    const setValue = (value) => {
        try{
            const valueToStore = value instanceof Function ? value(storedvalue) : value;
            setStoredValue(valueToStore);
            localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch(error) {
            console.warn('Error in setting local storage', error);
        }
    }
  return [storedvalue, setValue]
}