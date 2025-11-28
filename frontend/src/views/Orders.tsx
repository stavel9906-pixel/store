import { Box } from "@mui/system";
import { useGetOrderById } from "../api/hooks/useGetOrderById";
import { CartCard } from "../components/CartCard/CartCard";
import { Button, Card, CardContent, Typography } from "@mui/material";
import { useProductsAmountCart } from "../context/ProductsAmountCart";
import SellOutlinedIcon from "@mui/icons-material/SellOutlined";
import { useEffect, useState } from "react";
import purchasesApi from "../api/purchasesApi";
import Stepper from "../components/Stepper/Stepper";
import HorizontalLinearStepper from "../components/Stepper/Stepper";

const SHIPPING_PRICE: number = 2;
export const Orders = () => {
  const { order, setOrder } = useGetOrderById();
  const { productsAmountCart } = useProductsAmountCart();
  const [sumPrice, setSumPrice] = useState<number>(SHIPPING_PRICE);

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

  useEffect(() => {
    if (!order) return;

    const total = order.purchaseProducts.reduce(
      (sum, p) => sum + p.amount * p.product.price,
      SHIPPING_PRICE
    );

    setSumPrice(total);
  }, [order]);

  return (
    <>
    <HorizontalLinearStepper />
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="flex-start"
        width="100%"
        px={4}
        mt={5}
      >
        {/* LEFT SIDE */}
        <Box
          flex={1}
          mr={4}
        >
          <Card sx={{ display: "flex", width: 700, ml: 4 }}>
            <CardContent sx={{ fontSize: 30, fontWeight: "bold" }}>
              <SellOutlinedIcon
                sx={{ marginBlock: "auto", mr: 1, fontSize: 40 }}
              />
              All Items ({productsAmountCart})
            </CardContent>
          </Card>

          <Box mb={5}>
            {order?.purchaseProducts.map((productPur) => (
              <CartCard
                key={productPur.id}
                product={productPur}
                setSumPrice={setSumPrice}
                onRemove={handleRemoveProduct}
              />
            ))}
          </Box>
        </Box>
        {/* RIGHT SIDE */}
        <Box width={800}>
          <Card
            sx={{
              height: 500,
              p: 4,
              display: "flex",
              flexDirection: "column",
              borderRadius: 10,
              boxShadow: 20,
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
                  Shipping Fee: <strong>${SHIPPING_PRICE}</strong>
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
                  width: 400,
                  height: 100,
                  fontSize: 30,
                  fontWeight: "bold",
                  borderRadius: 20,
                }}
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
