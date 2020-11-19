import AsyncStorage from "@react-native-community/async-storage";
import deepmerge from "deepmerge";

export async function get<T>(key: string): Promise<T | undefined> {
  try {
    const stored = await AsyncStorage.getItem(key);
    if (!stored) return undefined;
    return JSON.parse(stored);
  } catch (e) {
    return undefined;
  }
}

export async function set(key: string, value: any) {
  try {
    let _value: string;
    if (typeof value === "string") {
      _value = value;
    } else {
      _value = JSON.stringify(value);
    }
    await AsyncStorage.setItem(key, _value);
  } catch (e) {}
}

export async function update(key: string, value: any) {
  try {
    let _value: string;
    if (typeof value === "string") {
      _value = value;
    } else {
      const stored = (await get(key)) as any;
      _value = JSON.stringify(deepmerge(stored, value));
    }
    await AsyncStorage.setItem(key, _value);
  } catch (e) {}
}

export async function remove(key: string) {
  return AsyncStorage.removeItem(key);
}
