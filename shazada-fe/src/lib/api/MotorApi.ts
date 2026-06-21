import { MotorProps } from "@/types/dealer.type";
import { axiosUmmi } from "./axiosInstance";

const getAllMotor = async (token: string) => {
  return await axiosUmmi.get("/motor", {
    headers: { Authorization: `Bearer ${token}` },
  });
};

const getOneMotor = async (token: string, motorId: string) => {
  return await axiosUmmi.get(`/motor/${motorId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

const createMotor = async (token: string, body: MotorProps) => {
  return await axiosUmmi.post("/motor", body, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

const deleteMotor = async (token: string, motorId: string) => {
  return await axiosUmmi.delete(`/motor/${motorId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export { getAllMotor, getOneMotor, createMotor, deleteMotor };
