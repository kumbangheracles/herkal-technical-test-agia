import axios from "axios";
import { BASE_API_URL } from "../environtments";
// import { toast } from "sonner";
export const axiosUmmi = axios.create({
  baseURL: `${BASE_API_URL}`,
  timeout: 50000,
});
// axiosUmmi.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error?.response?.status === 401) {
//       toast.error("Sesi habis, silakan login ulang");
//     }
//     return Promise.reject(error);
//   },
// );
