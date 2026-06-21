export interface CategoryProps {
  id: string;
  title: string;
  description: string | null;
  icon_url: string | null;
  created_at: string;
  updated_at: string;
}

export const initialCategoryValue: CategoryProps = {
  id: "",
  title: "",
  description: null,
  icon_url: null,
  created_at: "",
  updated_at: "",
};
