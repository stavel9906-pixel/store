import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { User } from "../../utils/types";
import usersApi from "../usersApi";

export const useGetUserFromToken = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");

        if(!token) return;
        
        const fetchedUser = (await usersApi.users().getProfile(token)).data;
        setUser(fetchedUser);
      } catch (error: unknown) {
        Swal.fire("Oops!", "There seems to be a problem. Please try again.", "error");
      }
    };

    fetchUser();
  }, []);

  return { user, setUser };
};
