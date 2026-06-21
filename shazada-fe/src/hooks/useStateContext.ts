import { StateContext } from "@/context/StateProvider";
import { useContext } from "react";

export const useStateContext = () => {
  const context = useContext(StateContext);
  if (!context) {
    throw new Error("useStateContext must be used within UserProvider");
  }
  return context;
};
