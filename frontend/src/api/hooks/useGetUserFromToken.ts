import { useEffect, useState } from "react";
import { User } from "../../utils/types";
import usersApi from "../usersApi";

export const useGetUserFromToken = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      setLoadingUser(true);
      try {
        const fetchedUser = (await usersApi.users().getProfile()).data;
        setUser(fetchedUser);
      } catch (error: unknown) {
        setUser(null)
      }
      setLoadingUser(false);
    };

    fetchUser();
  }, []);

  return { user, setUser, loadingUser };
};
