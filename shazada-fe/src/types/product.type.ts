export interface ProductProps {
  id: string;
  category_id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  price: number;
  category_title?: string;
  stock: number;
  created_at: string;
  updated_at: string;
}
export const initialProductValue: ProductProps = {
  id: "",
  category_id: "",
  title: "",
  description: null,
  image_url: null,
  price: 0,
  stock: 0,
  created_at: "",
  updated_at: "",
};
