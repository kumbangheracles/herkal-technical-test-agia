export interface AuthProps {
  username: string;
  password: string;
}

export interface UserProps {
  id: string | null;
  fullName: string | null;
  username: string | null;
  email: string | null;
  password: string | null;
}
