import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CreditCardOutlinedIcon from "@mui/icons-material/CreditCardOutlined";
import { creditCardFormFields } from "./paymentFields";
import { FC, useState } from "react";
import { CreditCardField, PurchaseStatus } from "../../utils/enums";
import purchasesApi from "../../api/purchasesApi";
import Swal from "sweetalert2";
import { useOrderId } from "../../context/OrderId";

interface CreditCardFormProps {
  handleNext: () => void;
}

export const CreditCardForm: FC<CreditCardFormProps> = ({ handleNext }) => {
  const [formData, setFormData] = useState(creditCardFormFields);
  const { orderId } = useOrderId();

  const handleChange = (name: string, value: string) => {
    setFormData((prev) =>
      prev.map((field) => (field.name === name ? { ...field, value } : field))
    );
  };

  const handleSubmit = async () => {
    let allValid = true;

    const newFormData = formData.map((field) => {
      const valid = field.validate(field.value);
      if (!valid) allValid = false;

      return {
        ...field,
        showError: !valid,
      };
    });

    setFormData(newFormData);

    if (allValid) {
      //payment action
      try {
        await purchasesApi
          .purchases()
          .updateStatus(orderId, PurchaseStatus.PAID);
        handleNext();
      } catch (err) {
        Swal.fire(
          "Oops!",
          "There seems to be a problem to pay. Please try again.",
          "error"
        );
      }
    }
  };

  return (
    <Card
      variant="outlined"
      sx={{
        maxHeight: "max-content",
        maxWidth: "100%",
        mx: "auto",
        overflow: "auto",
        resize: "horizontal",
        width: "70%",
        mt: "2%",
        borderRadius: 4,
        boxShadow: 6,
        px: 4,
      }}
    >
      <Typography
        variant="h4"
        component="div"
        sx={{ display: "flex", alignItems: "center", mb: 2, mt: "2rem" }}
      >
        <InfoOutlinedIcon sx={{ mr: 1, fontSize: "2rem" }} />
        Pay With Credit Card
      </Typography>
      <Divider />
      <CardContent
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: 2,
          mt: 2,
        }}
      >
        <TextField
          label={formData[CreditCardField.CARD_NUMBER].name}
          fullWidth
          value={formData[CreditCardField.CARD_NUMBER].value}
          onChange={(e) =>
            handleChange(
              formData[CreditCardField.CARD_NUMBER].name,
              e.target.value
            )
          }
          error={formData[CreditCardField.CARD_NUMBER].showError}
          helperText={
            formData[CreditCardField.CARD_NUMBER].showError
              ? formData[CreditCardField.CARD_NUMBER].errorMessage
              : ""
          }
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <CreditCardOutlinedIcon />
              </InputAdornment>
            ),
          }}
          sx={{ gridColumn: "1/-1" }}
        />
        <TextField
          label={formData[CreditCardField.EXPIRY_DATE].name}
          fullWidth
          value={formData[CreditCardField.EXPIRY_DATE].value}
          onChange={(e) =>
            handleChange(
              formData[CreditCardField.EXPIRY_DATE].name,
              e.target.value
            )
          }
          error={formData[CreditCardField.EXPIRY_DATE].showError}
          helperText={
            formData[CreditCardField.EXPIRY_DATE].showError
              ? formData[CreditCardField.EXPIRY_DATE].errorMessage
              : ""
          }
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <CreditCardOutlinedIcon />
              </InputAdornment>
            ),
          }}
        />
        <TextField
          label={formData[CreditCardField.CVC].name}
          fullWidth
          value={formData[CreditCardField.CVC].value}
          onChange={(e) =>
            handleChange(formData[CreditCardField.CVC].name, e.target.value)
          }
          error={formData[CreditCardField.CVC].showError}
          helperText={
            formData[CreditCardField.CVC].showError
              ? formData[CreditCardField.CVC].errorMessage
              : ""
          }
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <InfoOutlinedIcon />
              </InputAdornment>
            ),
          }}
        />
        <TextField
          label={formData[CreditCardField.CARD_HOLDER_NAME].name}
          placeholder="Enter cardholder's full name"
          fullWidth
          value={formData[CreditCardField.CARD_HOLDER_NAME].value}
          onChange={(e) =>
            handleChange(
              formData[CreditCardField.CARD_HOLDER_NAME].name,
              e.target.value
            )
          }
          error={formData[CreditCardField.CARD_HOLDER_NAME].showError}
          helperText={
            formData[CreditCardField.CARD_HOLDER_NAME].showError
              ? formData[CreditCardField.CARD_HOLDER_NAME].errorMessage
              : ""
          }
          sx={{ gridColumn: "1/-1" }}
        />
        <CardActions sx={{ gridColumn: "1/-1" }}>
          <button
            type="button"
            className="btn btn-primary btn-lg btn-block"
            onClick={handleSubmit}
          >
            Save
          </button>
        </CardActions>
      </CardContent>
    </Card>
  );
};
