export interface Transaction {
  id: number;
  title: string;
  amount: number;
  categoryId: number;
  userId: number;
  createdAt: Date;
  category?: Category;
}
export interface Category {
  id: string;
  name: string;
  icon: IconName;
}
export type Summary = {
  balance: number;
  income: number;
  expenses: number;
};
export type IconName =
  | "fast-food"
  | "cart"
  | "car"
  | "film"
  | "receipt"
  | "ellipsis-horizontal";
