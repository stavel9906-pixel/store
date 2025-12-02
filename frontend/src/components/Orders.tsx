import { Box } from "@mui/system";
import { useGetOrderById } from "../api/hooks/useGetOrderById";
import { CartCard } from "./CartCard/CartCard";
import { Button, Card, CardContent, Typography } from "@mui/material";
import { useProductsAmountCart } from "../context/ProductsAmountCart";
import SellOutlinedIcon from "@mui/icons-material/SellOutlined";
import { FC, useEffect, useState } from "react";
import purchasesApi from "../api/purchasesApi";
import { useGetShippingFee } from "../api/hooks/useGetShippingFee";
import Swal from "sweetalert2";

interface OrdersProps {
  handleNext: () => void;
}
export const Orders: FC<OrdersProps> = ({ handleNext }) => {
  const { order, setOrder } = useGetOrderById();
  const { productsAmountCart } = useProductsAmountCart();
  const {shippingFee} = useGetShippingFee();
  const [sumPrice, setSumPrice] = useState<number>(0);

  const handleRemoveProduct = async (id: number) => {
    if (order) {
      await purchasesApi.purchases().removeProductFromPurchase(order?.id, id);
    }
    setOrder((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        purchaseProducts: prev.purchaseProducts.filter(
          (p) => p.product.productId !== id
        ),
      };
    });
  };
  console.log(order)

  useEffect(() => {
    if (!order || !shippingFee) return;

    const total = order.purchaseProducts.reduce(
      (sum, p) => sum + p.amount * p.product.price,
      shippingFee
    );

    setSumPrice(total);
  }, [order, shippingFee]);

  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="flex-start"
        width="100%"
        px={4}
        mt={5}
      >
        <Box
          flex={1}
          mr={4}
        >
          <Card sx={{ display: "flex", width: "38vw", ml: 4 }}>
            <CardContent sx={{ fontSize: 30, fontWeight: "bold" }}>
              <SellOutlinedIcon
                sx={{ marginBlock: "auto", mr: 1, fontSize: 40 }}
              />
              All Items ({productsAmountCart})
            </CardContent>
          </Card>

          <Box mb={5}>
            {order && order.purchaseProducts.map((productPur) => (
              <CartCard
                key={productPur.id}
                product={productPur}
                setSumPrice={setSumPrice}
                onRemove={handleRemoveProduct}
              />
            ))}
          </Box>
        </Box>
        <Box width={"100%"}>
          <Card
            sx={{
              width: "35%",
              height: "50%",
              p: 4,
              display: "flex",
              flexDirection: "column",
              borderRadius: 10,
              boxShadow: 20,
              position: "fixed",
            }}
          >
            <CardContent
              sx={{
                p: 0,
                display: "flex",
                flexDirection: "column",
                flexGrow: 1,
              }}
            >
              <Typography
                variant="h4"
                sx={{ fontSize: 40, fontWeight: "bold", mb: 3 }}
              >
                Order Summary
              </Typography>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Typography variant="h6">
                  Shipping Fee: <strong>${shippingFee}</strong>
                </Typography>

                <Typography variant="h6">Total Price:</Typography>
                <Typography
                  variant="h1"
                  sx={{ fontWeight: "bold", fontSize: 40 }}
                >
                  ${sumPrice}
                </Typography>
              </Box>

              <Button
                variant="contained"
                color="success"
                sx={{
                  mt: "auto",
                  alignSelf: "center",
                  width: "65%",
                  height: "30%",
                  fontSize: 30,
                  fontWeight: "bold",
                  borderRadius: 20,
                }}
                onClick={() => {
                  if(order){
                    handleNext();
                  } else {
                    Swal.fire("Oops!", "There are no products for checkout. Please try again.", "error")
                  }
                }
                }
              >
                Checkout Now
              </Button>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </>
  );
};
