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
  id: number;
  name: string;
}
export type Summary = {
  balance: number;
  income: number;
  expenses: number;
};
