import { IProduct } from "./IProduct";

export interface IItem {
  id: string;
  quantidade: string;
  product: IProduct;
}