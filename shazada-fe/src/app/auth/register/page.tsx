import RegisterIndex from "@/components/Auth/Register";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Shazada - Sign Up | Welcome, Selamat Datang",
  description: "Selamat Datang di Shazada, Silahkan Daftar",
};
const RegisterPage = () => {
  return <RegisterIndex />;
};

export default RegisterPage;
