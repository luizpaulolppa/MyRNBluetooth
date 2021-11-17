import AsyncStorage from "@react-native-async-storage/async-storage";
import { IItem } from "./IItem";
import { IProduct } from "./IProduct";

export async function getItems(): Promise<IItem[]> {
  const value = await AsyncStorage.getItem('@items');
  const itens: IItem[] = JSON.parse(value || '[]');
  return itens;
}

export async function deleteItem(itemId: string): Promise<void> {
  console.log(itemId);
  const value = await AsyncStorage.getItem('@items');
  const items: IItem[] = JSON.parse(value || '[]');
  const newItems = items.filter(item => item.id !== itemId);
  await AsyncStorage.setItem('@items', JSON.stringify(newItems));
}

export async function getProducts(): Promise<IProduct[]> {
  const value = await AsyncStorage.getItem('@products');
  const itens: IProduct[] = JSON.parse(value || '[]');
  return itens;
}

export async function getProductsById(id: string): Promise<IProduct | undefined> {
  const value = await AsyncStorage.getItem('@products');
  const itens: IProduct[] = JSON.parse(value || '[]');
  return itens.find(item => item.id === id);
}
