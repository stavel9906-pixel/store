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
  Tooltip,
} from "@mui/material";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import React from "react";
import { useChangeAmount } from "../../hooks/useChangeAmount";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { ProductForm } from "../ProductForm/ProductForm";

interface ProductCardProps {
  product: Product;
  isAdmin: boolean;
  handleRemove: () => Promise<void>;
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
}

export const ProductCard: FC<ProductCardProps> = ({
  product,
  isAdmin,
  handleRemove,
  setProducts,
}) => {
  const [openDetails, setOpenDetails] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const handleCloseForm = () => setOpenForm(false);
  const changeAmount = useChangeAmount(product.productId);

  return (
    <Card
      sx={{
        width: 320,
        m: 2,
        position: "relative",
        flexWrap: "wrap",
        borderRadius: 10,
      }}
    >

      <Tooltip title="add to cart">
        <IconButton
          aria-label="addCart"
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            backgroundColor: "#008cffff",
            color: "white",
            "&:hover": { backgroundColor: "#008cffff" },
          }}
          onClick={() => changeAmount(1)}
        >
          <AddShoppingCartIcon />
        </IconButton>
      </Tooltip>
      {isAdmin && (
        <>
          <Tooltip title="delete product">
            <IconButton
              sx={{
                position: "absolute",
                left: "2%",
                top: "2%",
                backgroundColor: "white",
                color: "gray",
                "&:hover": { backgroundColor: "white" },
              }}
              onClick={handleRemove}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="edit product">
            <IconButton
              sx={{
                position: "absolute",
                left: "17%",
                top: "2%",
                backgroundColor: "white",
                color: "gray",
                "&:hover": { backgroundColor: "white" },
              }}
              onClick={() => setOpenForm(true)}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
          <ProductForm
            open={openForm}
            handleClose={handleCloseForm}
            product={product}
            setProducts={setProducts}
          />
        </>
      )}
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
          onClick={() => setOpenDetails(true)}
        >
          Details
        </Button>
      </CardContent>
      <React.Fragment>
        <Dialog
          open={openDetails}
          onClose={() => setOpenDetails(false)}
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
              onClick={() => setOpenDetails(false)}
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
