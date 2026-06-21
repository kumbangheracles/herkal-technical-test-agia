export type ProfileProps = {
  id: string;
  username: string;
  full_name: string;
  email: string;
  profile_image: string | null;
  role: "admin" | "customer";
  created_at: string;
  updated_at: string;
};
