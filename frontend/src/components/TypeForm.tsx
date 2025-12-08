import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormHelperText,
  Snackbar,
  TextField,
} from "@mui/material";
import { useState } from "react";
import { ProductType } from "../utils/types";
import adminApi from "../api/adminApi";

type TypeFormProps = {
  open: boolean;
  handleClose: () => void;
  setProductType: React.Dispatch<React.SetStateAction<ProductType[]>>;
};

export const TypeForm = ({
  open,
  handleClose,
  setProductType,
}: TypeFormProps) => {
  const [newTypeName, setNewTypeName] = useState("");
  const [error, setError] = useState("");
  const [errorAlert, setErrorAlert] = useState(false);

  const handleAdd = async () => {
    const validName = /^[A-Za-z\s]+$/.test(newTypeName.trim());
    if (!validName) {
      setError("Type name can only contain letters");
      return;
    }

    setError("");
    try {
      const productType: ProductType = (
        await adminApi.admin().addNewProductType(newTypeName)
      ).data;
      setProductType((prev) => [...prev, productType]);
      setNewTypeName("");
      handleClose();
    } catch {
        setErrorAlert(true);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        sx: {
          borderRadius: 3,
          p: 2,
          backgroundColor: "#f3f0ff",
          minWidth: 400,
        },
      }}
    >
      <DialogTitle sx={{ fontWeight: "bold", color: "#5c2d91" }}>
        Add New Product Type
      </DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Type Name"
          fullWidth
          variant="outlined"
          value={newTypeName}
          onChange={(e) => setNewTypeName(e.target.value)}
          error={!!error}
        />
        {error && (
          <FormHelperText sx={{ color: "red" }}>{error}</FormHelperText>
        )}
      </DialogContent>
      <DialogActions sx={{ justifyContent: "space-between", px: 3, pb: 2 }}>
        <Button
          onClick={handleClose}
          sx={{
            color: "#5c2d91",
            borderColor: "#5c2d91",
            borderRadius: 2,
            "&:hover": {
              backgroundColor: "#e6e0ff",
              borderColor: "#5c2d91",
            },
          }}
          variant="outlined"
        >
          Cancel
        </Button>
        <Button
          onClick={handleAdd}
          sx={{
            bgcolor: "#5c2d91",
            color: "white",
            borderRadius: 2,
            "&:hover": {
              bgcolor: "#4b2080",
            },
          }}
          variant="contained"
        >
          Add
        </Button>
      </DialogActions>
      <Snackbar
        open={errorAlert}
        onClose={() => setErrorAlert(false)}
        autoHideDuration={3000}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="error">
          Error Accured While Saving Product Type. Saving Failed!
        </Alert>
      </Snackbar>
    </Dialog>
  );
};
