import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import adminApi from "../adminApi";

export const useGetUsersAmount = (isAdmin: boolean) => {
  const [usersAmount, setUsersAmount] = useState<number>(0);

  useEffect(() => {
    if (!isAdmin) return;

    const fetchUsersAmount = async () => {
      try {
        const fetchedUsersAmount = (
          await adminApi.admin().getUsersAmount()
        ).data;

        setUsersAmount(fetchedUsersAmount);
      } catch (error: unknown) {
        Swal.fire(
          "Oops!",
          "There seems to be a problem displaying the users amount. Please try again.",
          "error"
        );
      }
    };

    fetchUsersAmount();
  }, [isAdmin]);

  return { usersAmount, setUsersAmount };
};
