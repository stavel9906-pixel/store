import AspectRatio from "@mui/joy/AspectRatio";
import Card from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import Chip from "@mui/joy/Chip";
import Typography from "@mui/joy/Typography";
import Link from "@mui/joy/Link";
import Button from "@mui/joy/Button";
import Input from "@mui/joy/Input";
import { FC, useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { Box } from "@mui/system";
import { CssVarsProvider } from "@mui/joy/styles";
import { PurchaseProduct } from "../../utils/types";
import { useChangeAmount } from "../../hooks/useChangeAmount";
import IconButton from "@mui/joy/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import { useProductsAmountCart } from "../../context/ProductsAmountCart";

interface CartCardProps {
  productPurchase: PurchaseProduct;
  setSumPrice: React.Dispatch<React.SetStateAction<number>> | null;
  onRemove: ((productId: number) => void) | null;
}

export const CartCard: FC<CartCardProps> = ({
  productPurchase,
  setSumPrice,
  onRemove,
}) => {
  const [currentAmount, setCurrentAmount] = useState(productPurchase.amount);
  const { setProductsAmountCart } = useProductsAmountCart();

  useEffect(() => {
    setCurrentAmount(productPurchase.amount);
  }, [productPurchase.amount]);

  const changeAmount = useChangeAmount(productPurchase.product.productId);

  return (
    <CssVarsProvider>
      {productPurchase.amount > 0 && (
        <Box
          display="flex"
          px={4}
          marginTop={5}
        >
          <Card
            variant="outlined"
            orientation="horizontal"
            sx={{
              width: "38vw",
              height: "12.5rem",
              position: "relative",
              "&:hover": {
                boxShadow: "md",
                borderColor: "neutral.outlinedHoverBorder",
              },
              pointerEvents: "auto",
              overflow: "hidden",
            }}
          >
            {!productPurchase.product.forSale && (
              <Box
                sx={{
                  position: "absolute",
                  top: "1.25rem",
                  left: "-5rem",
                  width: "14rem",
                  bgcolor: "danger.solidBg",
                  color: "danger.solidColor",
                  transform: "rotate(-45deg)",
                  textAlign: "center",
                  fontSize: "0.85rem",
                  fontWeight: "lg",
                  py: "0.3rem",
                  boxShadow: "md",
                  zIndex: 20,
                  pointerEvents: "none",
                }}
              >
                OUT SALE
              </Box>
            )}

            <AspectRatio
              ratio={1}
              sx={{ width: "10rem" }}
            >
              <img
                src={productPurchase.product.imageUrl}
                alt={productPurchase.product.productName}
              />
            </AspectRatio>

            <CardContent
              sx={{
                textAlign: "left",
                alignItems: "flex-start",
                gap: 1,
                pointerEvents: "auto",
              }}
            >
              <Typography
                level="title-lg"
                sx={{ fontSize: "2rem", fontWeight: "bold" }}
              >
                {productPurchase.product.productName}
              </Typography>
              <Typography
                level="body-sm"
                sx={{ mb: 1 }}
              >
                <Link
                  overlay={false}
                  underline="none"
                  href="#"
                  sx={{
                    color: "text.tertiary",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {productPurchase.product.description || "Description not available"}
                </Link>
              </Typography>

              <Chip
                variant="outlined"
                color="primary"
                size="sm"
                sx={{ pointerEvents: "none" }}
              >
                {productPurchase.product.productType.name}
              </Chip>
              <Typography
                level="title-lg"
                sx={{ fontSize: "1.25rem", ml: 1, mt: 1 }}
              >
                ${productPurchase.currentPrice}
              </Typography>
            </CardContent>

            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              sx={{ ml: "auto", mr: 2 }}
            >
              {onRemove && (
                <IconButton
                  variant="plain"
                  color="neutral"
                  size="lg"
                  sx={{ ml: "auto", mb: "auto" }}
                  onClick={() => {
                    onRemove(productPurchase.product.productId);
                    setCurrentAmount((curr) => curr - productPurchase.amount);
                    if (setSumPrice) {
                      setSumPrice(
                        (curr) => curr - productPurchase.currentPrice * productPurchase.amount
                      );
                    }
                    setProductsAmountCart(
                      (current) => current - productPurchase.amount
                    );
                  }}
                >
                  <DeleteIcon sx={{ fontSize: "1.5rem" }} />
                </IconButton>
              )}
              <Box
                display="flex"
                alignItems="center"
                sx={{ pointerEvents: "auto", mt: "auto" }}
              >
                {!onRemove ? (
                  <h5>amount: </h5>
                ) : (
                  <Button
                    size="sm"
                    onClick={() => {
                      changeAmount(-1);
                      if (setSumPrice) {
                        setSumPrice((curr) =>
                          Number((+curr - +productPurchase.currentPrice).toFixed(2))
                        );
                      }
                      setCurrentAmount((curr) => curr - 1);
                    }}
                    disabled={currentAmount === 0}
                    sx={{ minWidth: 0 }}
                  >
                    <RemoveIcon fontSize="small" />
                  </Button>
                )}

                <Input
                  type="number"
                  value={currentAmount}
                  disabled={!onRemove}
                  sx={{ width: "3.75rem", mx: 1, textAlign: "center" }}
                  onChange={(event) => {
                    const newAmount = Math.max(
                      Number(event.currentTarget.value),
                      0
                    );
                    const diff = newAmount - currentAmount;
                    changeAmount(diff);
                    if (setSumPrice) {
                      setSumPrice((curr) =>
                        Number(
                          (+curr + diff * +productPurchase.currentPrice).toFixed(2)
                        )
                      );
                    }
                    setCurrentAmount(newAmount);
                  }}
                />

                {onRemove && (
                  <Button
                    size="sm"
                    onClick={() => {
                      changeAmount(1);
                      if (setSumPrice) {
                        setSumPrice((curr) =>
                          Number((+curr + +productPurchase.currentPrice).toFixed(2))
                        );
                      }
                      setCurrentAmount((curr) => curr + 1);
                    }}
                    sx={{ minWidth: 0 }}
                  >
                    <AddIcon fontSize="small" />
                  </Button>
                )}
              </Box>
            </Box>
          </Card>
        </Box>
      )}
    </CssVarsProvider>
  );
};
