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
  product: PurchaseProduct;
  setSumPrice: React.Dispatch<React.SetStateAction<number>>;
  onRemove: (productId: number) => void;
}

export const CartCard: FC<CartCardProps> = ({
  product,
  setSumPrice,
  onRemove,
}) => {
  const [currentAmount, setCurrentAmount] = useState(product.amount);
  const { setProductsAmountCart } = useProductsAmountCart();

  useEffect(() => {
    setCurrentAmount(product.amount);
  }, []);

  const changeAmount = useChangeAmount(product.product.productId);

  return (
    <CssVarsProvider>
      {product.amount > 0 && (
        <Box
          display="flex"
          px={4}
          marginTop={5}
        >
          <Card
            variant="outlined"
            orientation="horizontal"
            sx={{
              width: 700,
              height: 200,
              position: "relative",
              "&:hover": {
                boxShadow: "md",
                borderColor: "neutral.outlinedHoverBorder",
              },
              pointerEvents: "auto",
            }}
          >
            <AspectRatio
              ratio={1}
              sx={{ width: 160 }}
            >
              <img
                src={product.product.imageUrl}
                alt={product.product.productName}
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
                sx={{ fontSize: 30, fontWeight: "bold" }}
              >
                {product.product.productName}
              </Typography>
              <Typography
                level="body-sm"
                sx={{ mb: 1 }}
              >
                <Link
                  overlay={false}
                  underline="none"
                  href="#"
                  sx={{ color: "text.tertiary" }}
                >
                  {product.product.description || "Description not available"}
                </Link>
              </Typography>
              <Chip
                variant="outlined"
                color="primary"
                size="sm"
                sx={{ pointerEvents: "none" }}
              >
                {product.product.productType.name}
              </Chip>
              <Typography
                level="title-lg"
                sx={{ fontSize: 20, ml: 1, mt: 1 }}
              >
                ${product.currentPrice}
              </Typography>
            </CardContent>

            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              sx={{ ml: "auto", mr: 2 }}
            >
              <IconButton
                variant="plain"
                color="neutral"
                size="lg"
                sx={{ ml: "auto", mb: "auto" }}
                onClick={() => {
                  onRemove(product.product.productId);
                  setCurrentAmount((curr) => curr - product.amount);
                  setSumPrice(
                    (curr) => curr - product.product.price * product.amount
                  );
                  setProductsAmountCart((current) => current - product.amount);
                }}
              >
                <DeleteIcon sx={{ fontSize: "1.5rem" }} />
              </IconButton>
              <Box
                display="flex"
                alignItems="center"
                sx={{ pointerEvents: "auto", mt: "auto" }}
              >
                <Button
                  size="sm"
                  onClick={() => {
                    changeAmount(-1)
                    setSumPrice((curr) => curr - product.product.price);
                    setCurrentAmount((curr) => curr - 1);
                  }}
                  disabled={currentAmount === 0}
                  sx={{ minWidth: 0 }}
                >
                  <RemoveIcon fontSize="small" />
                </Button>

                <Input
                  type="number"
                  value={currentAmount}
                  min={0}
                  sx={{ width: 60, mx: 1, textAlign: "center" }}
                  onChange={(event) => {
                    const newAmount = Math.max(Number(event.currentTarget.value), 0);
                    const diff = newAmount - currentAmount;
                    changeAmount(diff);
                    setSumPrice((curr) => curr + diff * product.product.price);
                    setCurrentAmount(newAmount);
                  }}
                />

                <Button
                  size="sm"
                  onClick={() => {
                    console.log("increase");
                    changeAmount(1);
                    setSumPrice((curr) => curr + product.product.price);
                    setCurrentAmount((curr) => curr + 1);
                  }}
                  sx={{ minWidth: 0 }}
                >
                  <AddIcon fontSize="small" />
                </Button>
              </Box>
            </Box>
          </Card>
        </Box>
      )}
    </CssVarsProvider>
  );
};
