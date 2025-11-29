import {
  Box,
  Card,
  CardContent,
  TextField,
  Typography,
  Divider,
  InputLabel,
  Select,
  MenuItem,
  FormControl,
  Button,
  FormHelperText,
} from "@mui/material";
import { FC, useState } from "react";
import { formFields } from "./addressFormFields";

interface AddressFormProps {
  handleNext: () => void;
  handleBack: () => void;
}
export const AddressForm: FC<AddressFormProps> = ({
  handleNext,
  handleBack,
}) => {
  const [formData, setFormData] = useState(formFields);

  const handleChange = (name: string, value: string) => {
    setFormData((prev) =>
      prev.map((field) => (field.name === name ? { ...field, value } : field))
    );
  };
  
  

  const handleSubmit = () => {
    let allValid = true;

    const newFormData = formData.map(field => {
    const valid = field.validate(field.value);
    if (!valid) allValid = false;

    return {
      ...field,
      showError: !valid, 
    };
  });

  setFormData(newFormData);

    if (allValid) {
      console.log("Form data:", formData);
      handleNext();
    } else {
      console.log("Validation errors exist");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "80vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        px: 2,
      }}
    >
      <Card
        sx={{
          width: "70%",
          mt: "2%",
          borderRadius: 4,
          boxShadow: 6,
          p: 4,
        }}
      >
        <Box>
          <CardContent sx={{ textAlign: "start" }}>
            <Typography sx={{ fontSize: 40, fontWeight: "bold", mb: 3 }}>
              Shipping Details
            </Typography>
            <Divider sx={{ mb: 3 }} />

            {/* Country Select */}
            <Typography sx={{ fontSize: "1.2rem", fontWeight: "bold", mb: 1 }}>
              Country/region
            </Typography>
            <FormControl
              fullWidth
              sx={{ mb: "2rem" }}
              className="col-md-5"
            >
              <InputLabel id="country-label" error={formData[0].showError}>{formData[0].name}</InputLabel>
              <Select
                labelId="country-label"
                value={formData[0].value}
                label={formData[0].name}
                onChange={(e) => handleChange(formData[0].name, e.target.value)}
                error={formData[0].showError}
              >
                <MenuItem value="USA">USA</MenuItem>
                <MenuItem value="Canada">Canada</MenuItem>
                <MenuItem value="Mexico">Mexico</MenuItem>
              </Select>
              {formData[0].showError && (
                <FormHelperText sx={{ color: "#e00202ff" }}>
                  {formData[0].errorMessage}
                </FormHelperText>
              )}
            </FormControl>
            <Typography sx={{ fontSize: "1.2rem", fontWeight: "bold", mb: 1 }}>
              Contant Information
            </Typography>
            <TextField
              key={formData[1].name}
              label={formData[1].name}
              value={formData[1].value}
              error={formData[1].showError}
              helperText={
                formData[1].showError ? formData[1].errorMessage : ""
              }
              onChange={(e) => handleChange(formData[1].name, e.target.value)}
              sx={{ mb: 2, width: "45%", mr: 2 }}
            />
            <TextField
              key={formData[2].name}
              label={formData[2].name}
              value={formData[2].value}
              onChange={(e) => handleChange(formData[2].name, e.target.value)}
              sx={{ mb: 2, width: "45%" }}
              error={formData[2].showError}
              helperText={
                formData[2].showError ? formData[2].errorMessage : ""
              }
            />
            <TextField
            type="tel"
              key={formData[3].name}
              label={formData[3].name}
              value={formData[3].value}
              onChange={(e) => handleChange(formData[3].name, e.target.value)}
              sx={{ mb: 2, width: "60%", ml: "20%" }}
              error={formData[3].showError}
              helperText={
                formData[3].showError ? formData[3].errorMessage : ""
              }
            />
            <Typography sx={{ fontSize: "1.2rem", fontWeight: "bold", mb: 1 }}>
              Address
            </Typography>
            <FormControl
              fullWidth
              sx={{ mr: "2rem", width: "30%" }}
            >
              <InputLabel id="country-label" error={formData[4].showError}>{formData[4].name}</InputLabel>
              <Select
                labelId="country-label"
                value={formData[4].value}
                label={formData[4].name}
                onChange={(e) => handleChange(formData[4].name, e.target.value)}
                error={formData[4].showError}
              >
                <MenuItem value="US">US</MenuItem>
                <MenuItem value="Canad">Canad</MenuItem>
                <MenuItem value="Mexic">Mexic</MenuItem>
              </Select>
              {formData[4].showError && (
                <FormHelperText sx={{ color: "#e00202ff" }}>
                  {formData[4].errorMessage}
                </FormHelperText>
              )}
            </FormControl>
            <TextField
              key={formData[5].name}
              label={formData[5].name}
              value={formData[5].value}
              onChange={(e) => handleChange(formData[5].name, e.target.value)}
              sx={{ width: "30%", mr: "2rem" }}
              error={formData[5].showError}
              helperText={
                formData[5].showError ? formData[5].errorMessage : ""
              }
            />
            <TextField
              type="number"
              key={formData[6].name}
              label={formData[6].name}
              value={formData[6].value}
              onChange={(e) => handleChange(formData[6].name, e.target.value)}
              sx={{ width: "25%" }}
              error={formData[6].showError}
              helperText={
                formData[6].showError ? formData[6].errorMessage : ""
              }
            />
            <Box
              justifyContent={"center"}
              mt={"2rem"}
              textAlign="center"
            >
              <Button
                variant="outlined"
                size="large"
                sx={{
                  borderRadius: "2rem",
                  color: "gray",
                  borderColor: "gray",
                  mr: 1,
                }}
                onClick={handleBack}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                size="large"
                color="success"
                sx={{ borderRadius: "2rem", boxShadow: 6 }}
                onClick={handleSubmit}
              >
                Confirm
              </Button>
            </Box>
          </CardContent>
        </Box>
      </Card>
    </Box>
  );
};
