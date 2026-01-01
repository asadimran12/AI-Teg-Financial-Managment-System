import { redirect } from "react-router-dom";

export const protectedLoader = () => {
  const token = localStorage.getItem("aiteg_token");

  if (!token) {
    return redirect("/"); 
  }

  return null;
};
