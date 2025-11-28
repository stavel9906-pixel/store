import { FC } from "react";
import { OrderIdContext } from "./OrderIdContext";
import { useGetOrderByUser } from "../../api/hooks/useGetOrderByUser";

export const OrderIdProvider: FC<{
  children: JSX.Element[] | JSX.Element;
}> = ({ children }) => {
  const { orderId, setOrderId } = useGetOrderByUser();

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
