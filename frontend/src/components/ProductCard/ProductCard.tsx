import { FC, useState } from "react";
import { Product } from "../../utils/types";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import React from "react";
import { useChangeAmount } from "../../hooks/useChangeAmount";

interface ProductCardProps {
  product: Product;
}

export const ProductCard: FC<ProductCardProps> = ({ product }) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const changeAmount = useChangeAmount(product.productId);

  return (
    <Card sx={{ width: 320, m: 2, position: "relative", flexWrap: "wrap", borderRadius: 10 }}>
      <IconButton
        aria-label="addCart"
        sx={{
          position: "absolute",
          top: 8,
          right: 8,
          backgroundColor: "#008cffff",
          color: "white",
        }}
        onClick={() => changeAmount(1)}
      >
        <AddShoppingCartIcon/>
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
          onClick={handleOpen}
        >
          Details
        </Button>
      </CardContent>
      <React.Fragment>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {product.productName}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {product.description}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleClose}
              color="secondary"
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    </Card>
  );
};
