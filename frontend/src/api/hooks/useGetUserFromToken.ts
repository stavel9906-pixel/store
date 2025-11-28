import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { User } from "../../utils/types";
import usersApi from "../usersApi";

export const useGetUserFromToken = () => {
  const [user, setUser] = useState<User | null>(null);

  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
        console.log(token)
        const fetchedUser = (await usersApi.users().getProfile(token)).data;
        setUser(fetchedUser);
      } catch (error: unknown) {
        Swal.fire("Oops!", "There seems to be a problem displaying the products. Please try again.", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return { user, loading, setUser };
};
