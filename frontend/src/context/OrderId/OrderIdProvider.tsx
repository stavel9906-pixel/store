import { FC } from "react";
import { OrderIdContext } from "./OrderIdContext";
import { useGetPendingOrderByUser } from "../../api/hooks/useGetPendingOrderByUser";

export const OrderIdProvider: FC<{
  children: JSX.Element[] | JSX.Element;
}> = ({ children }) => {
  const { orderId, setOrderId } = useGetPendingOrderByUser();

  return (
    <OrderIdContext.Provider
      value={{
        orderId,
        setOrderId,
      }}
    >
      {children}
    </OrderIdContext.Provider>
  );
};
