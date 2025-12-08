import { useEffect, useRef, useState } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  MenuItem,
  Button,
  Grid,
  Divider,
  FormControl,
  InputLabel,
  InputAdornment,
  OutlinedInput,
  FormHelperText,
  Snackbar,
  Alert,
} from "@mui/material";
import { motion } from "framer-motion";
import { Product } from "../../utils/types";
import { useGetProductsType } from "../../api/hooks/useGetProductsType";
import { productFormFields } from "./productsFormField";
import { ProductField } from "../../utils/enums";
import adminApi from "../../api/adminApi";

type ProductFormProps = {
  open: boolean;
  handleClose: () => void;
  product: Product | null;
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
};

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "60%",
  height: "90%",
  bgcolor: "#f8e6ff",
  borderRadius: 12,
  border: "2px solid #b45eff",
  p: 4,
  boxShadow: 24,
  overflowY: "auto",
};

export const ProductForm = ({
  open,
  handleClose,
  product,
  setProducts,
}: ProductFormProps) => {
  const [form, setForm] = useState(productFormFields);
  const { productsType } = useGetProductsType();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [errorAlert, setErrorAlert] = useState(false);

  useEffect(() => {
    if (product && product.productType) {
      setForm((prev) =>
        prev.map((field) => {
          switch (field.name) {
            case "productName":
              return { ...field, value: product.productName || "" };
            case "productType":
              return {
                ...field,
                value: product.productType?.id
                  ? product.productType.id.toString()
                  : "",
              };
            case "price":
              return { ...field, value: product.price.toString() || "" };
            case "image":
              return { ...field, value: product.imageUrl || "" };
            case "description":
              return { ...field, value: product.description || "" };
            default:
              return field;
          }
        })
      );
    } else {
      setForm(productFormFields.map((f) => ({ ...f, value: "" })));
    }
  }, [product]);

  const handleChange = (name: string, value: string) => {
    setForm((prev) =>
      prev.map((field) => (field.name === name ? { ...field, value } : field))
    );
  };

  const handleSubmit = async () => {
    let allValid = true;

    const newFormData = form.map((field) => {
      const valid = field.validate(field.value);
      if (!valid) allValid = false;

      return {
        ...field,
        showError: !valid,
      };
    });

    setForm(newFormData);

    if (allValid) {
      const formData = new FormData();
      if (fileInputRef.current?.files?.[0]) {
        formData.append("image", fileInputRef.current.files[0]);
      }

      formData.append("productName", form[ProductField.PRODUCT_NAME].value);
      formData.append("productType", form[ProductField.PRODUCT_TYPE].value);
      formData.append("price", form[ProductField.PRICE].value);
      formData.append("description", form[ProductField.DESCRIPTION].value);

      try {
        if (product) {
          formData.append("productId", product.productId.toString());
          const updatedProduct: Product = (
            await adminApi.admin().updateProduct(formData)
          ).data;
          setProducts((prev) =>
            prev.map((p) =>
              p.productId === updatedProduct.productId ? updatedProduct : p
            )
          );
        } else {
          const newProduct: Product = (
            await adminApi.admin().addProduct(formData)
          ).data;
          setProducts((prev) => [...prev, newProduct]);
        }
        setForm(productFormFields.map((field) => ({ ...field, value: "" }))); // Empty the fields
        if (fileInputRef.current) fileInputRef.current.value = "";
 
        handleClose();
      } catch (err) {
        setErrorAlert(true);
      }
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
    >
      <Box sx={style}>
        <motion.div
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          <Typography
            variant="h4"
            fontWeight="bold"
            textAlign="center"
            color="#5d00ff"
            mb={3}
          >
            {product ? "Edit Product" : "Add Product"}
          </Typography>
        </motion.div>

        <Grid
          container
          spacing={4}
          sx={{ display: "flex", flexDirection: "row", gap: 5 }}
        >
          <Box
            sx={{
              width: "100%",
              height: "45vh",
              borderRadius: "20%",
              border: "2px solid #b45eff",
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mt: "3rem",
              flexDirection: "column",
            }}
            className="col-md-5"
          >
            <input
              type="file"
              accept="image/*"
              id="upload-profile"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;

                const imageUrl = URL.createObjectURL(file);

                setForm((prev) =>
                  prev.map((field) =>
                    field.name === form[ProductField.IMAGE].name
                      ? { ...field, value: imageUrl }
                      : field
                  )
                );
              }}
            />

            <label
              htmlFor="upload-profile"
              style={{ cursor: "pointer" }}
            >
              {form[ProductField.IMAGE].value ? (
                <img
                  src={form[ProductField.IMAGE].value}
                  alt="preview"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <Typography
                  color="#5d00ff"
                  fontWeight="bold"
                >
                  Image preview
                </Typography>
              )}
            </label>
            {form[ProductField.IMAGE].showError && (
              <Typography color="error">
                {form[ProductField.IMAGE].errorMessage}
              </Typography>
            )}
          </Box>

          {/* FORM FIELDS */}
          <Box className="col-md-6">
            <TextField
              label="Product Name"
              name={form[ProductField.PRODUCT_NAME].name}
              value={form[ProductField.PRODUCT_NAME].value}
              onChange={(e) =>
                handleChange(
                  form[ProductField.PRODUCT_NAME].name,
                  e.target.value
                )
              }
              error={form[ProductField.PRODUCT_NAME].showError}
              helperText={
                form[ProductField.PRODUCT_NAME].showError
                  ? form[ProductField.PRODUCT_NAME].errorMessage
                  : ""
              }
              fullWidth
              sx={{ mt: "3rem", color: "black" }}
            />

            <TextField
              select
              label="Product Type"
              name={form[ProductField.PRODUCT_TYPE].name}
              value={form[ProductField.PRODUCT_TYPE].value}
              onChange={(e) =>
                handleChange(
                  form[ProductField.PRODUCT_TYPE].name,
                  e.target.value
                )
              }
              fullWidth
              sx={{ mt: "3rem" }}
              error={form[ProductField.PRODUCT_TYPE].showError}
              helperText={
                form[ProductField.PRODUCT_TYPE].showError
                  ? form[ProductField.PRODUCT_TYPE].errorMessage
                  : ""
              }
            >
              {productsType.map((t) => (
                <MenuItem
                  key={t.id}
                  value={t.id}
                >
                  {t.name}
                </MenuItem>
              ))}
            </TextField>

            <FormControl
              fullWidth
              sx={{ mt: "3rem" }}
            >
              <InputLabel htmlFor="outlined-adornment-amount">Price</InputLabel>
              <OutlinedInput
                id="outlined-adornment-amount"
                startAdornment={
                  <InputAdornment position="start">$</InputAdornment>
                }
                label="Price"
                type="number"
                name={form[ProductField.PRICE].name}
                value={form[ProductField.PRICE].value}
                onChange={(e) =>
                  handleChange(form[ProductField.PRICE].name, e.target.value)
                }
                error={form[ProductField.PRICE].showError}
              />
              {form[ProductField.PRICE].showError && (
                <FormHelperText sx={{color: "red"}}>
                  {form[ProductField.PRICE].errorMessage}
                </FormHelperText>
              )}
            </FormControl>

            <TextField
              label="Description"
              multiline
              minRows={4}
              name={form[ProductField.DESCRIPTION].name}
              value={form[ProductField.DESCRIPTION].value}
              onChange={(e) =>
                handleChange(
                  form[ProductField.DESCRIPTION].name,
                  e.target.value
                )
              }
              fullWidth
              sx={{ mt: "3rem" }}
              error={form[ProductField.DESCRIPTION].showError}
              helperText={
                form[ProductField.DESCRIPTION].showError
                  ? form[ProductField.DESCRIPTION].errorMessage
                  : ""
              }
            />
          </Box>
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Box
          sx={{ display: "flex", justifyContent: "center", gap: 3, mt: "5rem" }}
        >
          <Button
            variant="contained"
            onClick={handleSubmit}
            sx={{
              bgcolor: "#b45eff",
              px: 6,
              py: 1.2,
              fontSize: "1rem",
              borderRadius: 2,
            }}
          >
            Save
          </Button>

          <Button
            variant="outlined"
            onClick={handleClose}
            sx={{
              color: "#5d00ff",
              borderColor: "#5d00ff",
              px: 4,
              py: 1.2,
              fontSize: "1rem",
              borderRadius: 2,
            }}
          >
            Cancel
          </Button>
        </Box>
        <Snackbar
          open={errorAlert}
          onClose={() => setErrorAlert(false)}
          autoHideDuration={3000}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert severity="error">
            Error Accured While Saving Product. Saving Failed!
          </Alert>
        </Snackbar>
      </Box>
    </Modal>
  );
};
