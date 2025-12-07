import { Box } from "@mui/system";
import { useGetOrderById } from "../api/hooks/useGetOrderById";
import { CartCard } from "./CartCard/CartCard";
import {
  Alert,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fab,
  FormHelperText,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import { useProductsAmountCart } from "../context/ProductsAmountCart";
import SellOutlinedIcon from "@mui/icons-material/SellOutlined";
import { FC, useEffect, useState } from "react";
import purchasesApi from "../api/purchasesApi";
import { useGetShippingFee } from "../api/hooks/useGetShippingFee";
import Swal from "sweetalert2";
import { useGetIsAdmin } from "../api/hooks/useGetIsAdmin";
import EditIcon from "@mui/icons-material/Edit";
import adminApi from "../api/adminApi";
import { useOrderId } from "../context/OrderId";

interface OrdersProps {
  handleNext: () => void;
}
export const Orders: FC<OrdersProps> = ({ handleNext }) => {
  const { order, setOrder } = useGetOrderById();
  const { orderId } = useOrderId();
  const { productsAmountCart } = useProductsAmountCart();
  const { shippingFee, setShippingFee } = useGetShippingFee();
  const [sumPrice, setSumPrice] = useState<number>(0);
  const { isAdmin } = useGetIsAdmin();
  const [openShippingModal, setOpenShippingModal] = useState(false);
  const [newShippingPrice, setNewShippingPrice] = useState<number>(0);
  const [shippingFeeError, setShippingFeeError] = useState("");
  const [errorAlert, setErrorAlert] = useState(false);

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

  const handleShippingFeeUpdate = async (newPrice: number) => {
    if (newShippingPrice < 0) {
      setShippingFeeError("Shipping fee needs to be a positive number");
      return;
    }

    setShippingFeeError("");

    try {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      await adminApi.admin().updateShippingFee(token, newPrice);
      setShippingFee(newPrice);
      setOpenShippingModal(false);
    } catch (err) {
      setErrorAlert(true);
    }
  };

  useEffect(() => {
    if (!order || !shippingFee) return;

    const total = order.purchaseProducts.reduce(
      (sum, p) => sum + p.amount * p.currentPrice,
      shippingFee
    );

    setSumPrice(Number(total.toFixed(2)));
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
            {order &&
              order.purchaseProducts.map((productPur) => (
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
                  Shipping Fee: <strong>${(isAdmin || !orderId) ? shippingFee : order?.shippingFee}</strong>
                  {isAdmin && shippingFee && (
                    <>
                      <Fab
                        color="success"
                        aria-label="edit"
                        sx={{ width: "2.2rem", ml: 2, height: "1.5rem" }}
                        onClick={() => {
                          setNewShippingPrice(shippingFee);
                          setOpenShippingModal(true);
                        }}
                      >
                        <EditIcon />
                      </Fab>
                      <Dialog
                        open={openShippingModal}
                        onClose={() => setOpenShippingModal(false)}
                      >
                        <DialogTitle>Update Shipping Fee</DialogTitle>
                        <DialogContent>
                          <TextField
                            label="Shipping Price"
                            type="number"
                            fullWidth
                            value={newShippingPrice}
                            onChange={(e) =>
                              setNewShippingPrice(Number(e.target.value))
                            }
                            sx={{ mt: 2 }}
                            error={!!shippingFeeError}
                          />
                          {shippingFeeError && (
                            <FormHelperText sx={{ color: "red" }}>
                              {shippingFeeError}
                            </FormHelperText>
                          )}
                        </DialogContent>
                        <DialogActions>
                          <Button
                            onClick={() => setOpenShippingModal(false)}
                            color="inherit"
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={async () => {
                              await handleShippingFeeUpdate(newShippingPrice);
                            }}
                            color="success"
                            variant="contained"
                          >
                            Save
                          </Button>
                        </DialogActions>
                      </Dialog>
                      <Snackbar
                        open={errorAlert}
                        onClose={() => setErrorAlert(false)}
                        autoHideDuration={3000}
                        anchorOrigin={{ vertical: "top", horizontal: "center" }}>
                        <Alert severity="error">
                          Error Accured While Saving New Shipping Fee. Update
                          Failed!
                        </Alert>
                      </Snackbar>
                    </>
                  )}
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
                  if (order) {
                    handleNext();
                  } else {
                    Swal.fire(
                      "Oops!",
                      "There are no products for checkout. Please try again.",
                      "error"
                    );
                  }
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
