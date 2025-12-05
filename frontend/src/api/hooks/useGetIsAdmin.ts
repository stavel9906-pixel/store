import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import usersApi from "../usersApi";

export const useGetIsAdmin = () => {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    const fetchIsAdmin = async () => {
      try {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");

        if(!token) return;
        
        const fetchedIsAdmin = (await usersApi.users().isAdmin(token)).data;
        setIsAdmin(fetchedIsAdmin);
      } catch (error: unknown) {
        Swal.fire("Oops!", "There seems to be a problem. Please try again.", "error");
      }
    };

    fetchIsAdmin();
  }, []);

  return { isAdmin };
};
