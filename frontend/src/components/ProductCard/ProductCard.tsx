import { FC } from "react";
import { Product } from "../../utils/types";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  IconButton,
} from "@mui/material";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";

interface ProductCardProps {
  product: Product;
}

export const ProductCard: FC<ProductCardProps> = ({ product }) => {
  return (
    <Card sx={{ width: 320, m: 2, position: "relative", flexWrap: "wrap" }}>
      <IconButton
        aria-label="addCart"
        sx={{
          position: "absolute",
          top: 8,
          right: 8,
          backgroundColor: "#008cffff",
        }}
      >
        <AddShoppingCartIcon />
      </IconButton>
      <CardMedia
        component="img"
        height={300}
        image={product.imageUrl}
        alt={product.productName}
        sx={{ objectFit: "cover" }}
      />
      <CardContent>
        <Typography variant="h6">{product.productName}</Typography>
        <Typography
          variant="body2"
          color="text.secondary"
        >
          {product.productType.name}
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{ mt: 1 }}
        >
          ${product.price}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 1 }}
        >
          Details
        </Button>
      </CardContent>
    </Card>
  );
};
