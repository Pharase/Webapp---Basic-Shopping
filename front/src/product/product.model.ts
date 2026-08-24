export interface Product {
  id: number;
  name: string;
  detail: string;
  price: number;
  imageUrl: string | null;
  stock: number;
  category?: {
    id: number;
    name: string;
    description?: string;
  } | null;
}
