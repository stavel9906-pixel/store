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
import { useGetCountries } from "../../api/hooks/useGetCountries";
import { useGetCities } from "../../api/hooks/useGetCities";
import { AddressField } from "../../utils/enums";
import { useOrderId } from "../../context/OrderId";
import addressOrderApi from "../../api/addressOrderApi";
import Swal from "sweetalert2";
import { OrderDetailsDTO } from "../../utils/DTOs";

interface AddressFormProps {
  handleNext: () => void;
  handleBack: () => void;
}
export const AddressForm: FC<AddressFormProps> = ({
  handleNext,
  handleBack,
}) => {
  const [formData, setFormData] = useState(formFields);
  const { countries } = useGetCountries();
  const { cities } = useGetCities();
  const { orderId } = useOrderId();

  const handleChange = (name: string, value: string) => {
    setFormData((prev) =>
      prev.map((field) => (field.name === name ? { ...field, value } : field))
    );
  };

  const handleSubmit = async () => {
    let allValid = true;

    const newFormData = formData.map((field) => {
      const valid =
        field.name === "requested Time To"
          ? field.validate(field.value, formData)
          : field.validate(field.value);
      if (!valid) allValid = false;

      return {
        ...field,
        showError: !valid,
      };
    });

    setFormData(newFormData);

    if (allValid) {
      const orderDetails: OrderDetailsDTO = {
        firstName: newFormData[AddressField.FIRST_NAME].value,
        lastName: newFormData[AddressField.LAST_NAME].value,
        phoneNumber: newFormData[AddressField.PHONE_NUMBER].value,
        city: newFormData[AddressField.CITY].value,
        street: newFormData[AddressField.STREET].value,
        houseNumber: +newFormData[AddressField.HOUSE_NUMBER].value,
        orderId: orderId!,
        date: newFormData[AddressField.DATE].value
          ? new Date(newFormData[AddressField.DATE].value)
          : undefined,
        timeFrom: newFormData[AddressField.TIME_FROM].value,
        timeTo: newFormData[AddressField.TIME_TO].value,
      };
      try {
        await addressOrderApi.purchaseAddress().insertAddress(orderDetails);
        handleNext();
      } catch (err) {
        Swal.fire(
          "Oops!",
          "Failed to save address. Please try again.",
          "error"
        );
      }
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
          mb: "2%",
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

            <Typography sx={{ fontSize: "1.2rem", fontWeight: "bold", mb: 1 }}>
              Country/region
            </Typography>
            <FormControl
              fullWidth
              sx={{ mb: "2rem" }}
              className="col-md-5"
            >
              <InputLabel
                id="country-label"
                error={formData[AddressField.COUNTRY].showError}
              >
                {formData[AddressField.COUNTRY].name}
              </InputLabel>
              <Select
                labelId="country-label"
                value={formData[AddressField.COUNTRY].value}
                label={formData[AddressField.COUNTRY].name}
                onChange={(e) =>
                  handleChange(
                    formData[AddressField.COUNTRY].name,
                    e.target.value
                  )
                }
                error={formData[AddressField.COUNTRY].showError}
              >
                {countries.map((country) => (
                  <MenuItem
                    key={country.id}
                    value={country.name}
                  >
                    {country.name}
                  </MenuItem>
                ))}
              </Select>
              {formData[AddressField.COUNTRY].showError && (
                <FormHelperText sx={{ color: "#e00202ff" }}>
                  {formData[AddressField.COUNTRY].errorMessage}
                </FormHelperText>
              )}
            </FormControl>
            <Typography sx={{ fontSize: "1.2rem", fontWeight: "bold", mb: 1 }}>
              Contant Information
            </Typography>
            <TextField
              key={formData[AddressField.FIRST_NAME].name}
              label={formData[AddressField.FIRST_NAME].name}
              value={formData[AddressField.FIRST_NAME].value}
              error={formData[AddressField.FIRST_NAME].showError}
              helperText={
                formData[AddressField.FIRST_NAME].showError
                  ? formData[AddressField.FIRST_NAME].errorMessage
                  : ""
              }
              onChange={(e) =>
                handleChange(
                  formData[AddressField.FIRST_NAME].name,
                  e.target.value
                )
              }
              sx={{ mb: 2, width: "45%", mr: 2 }}
            />
            <TextField
              key={formData[AddressField.LAST_NAME].name}
              label={formData[AddressField.LAST_NAME].name}
              value={formData[AddressField.LAST_NAME].value}
              onChange={(e) =>
                handleChange(
                  formData[AddressField.LAST_NAME].name,
                  e.target.value
                )
              }
              sx={{ mb: 2, width: "45%" }}
              error={formData[AddressField.LAST_NAME].showError}
              helperText={
                formData[AddressField.LAST_NAME].showError
                  ? formData[AddressField.LAST_NAME].errorMessage
                  : ""
              }
            />
            <TextField
              type="tel"
              key={formData[AddressField.PHONE_NUMBER].name}
              label={formData[AddressField.PHONE_NUMBER].name}
              value={formData[AddressField.PHONE_NUMBER].value}
              onChange={(e) =>
                handleChange(
                  formData[AddressField.PHONE_NUMBER].name,
                  e.target.value
                )
              }
              sx={{ mb: 2, width: "60%", ml: "20%" }}
              error={formData[AddressField.PHONE_NUMBER].showError}
              helperText={
                formData[AddressField.PHONE_NUMBER].showError
                  ? formData[AddressField.PHONE_NUMBER].errorMessage
                  : ""
              }
            />
            <Typography sx={{ fontSize: "1.2rem", fontWeight: "bold", mb: 1 }}>
              Address
            </Typography>
            <FormControl
              fullWidth
              sx={{ mr: "2rem", width: "30%" }}
            >
              <InputLabel
                id="country-label"
                error={formData[AddressField.CITY].showError}
              >
                {formData[AddressField.CITY].name}
              </InputLabel>
              <Select
                labelId="city-label"
                value={formData[AddressField.CITY].value}
                label={formData[AddressField.CITY].name}
                onChange={(e) =>
                  handleChange(formData[AddressField.CITY].name, e.target.value)
                }
                error={formData[AddressField.CITY].showError}
              >
                {cities
                  .filter(
                    (city) =>
                      city.country &&
                      city.country.name === formData[AddressField.COUNTRY].value
                  )
                  .map((city) => (
                    <MenuItem
                      key={city.id}
                      value={city.name}
                    >
                      {city.name}
                    </MenuItem>
                  ))}
              </Select>

              {formData[AddressField.CITY].showError && (
                <FormHelperText sx={{ color: "#e00202ff" }}>
                  {formData[AddressField.CITY].errorMessage}
                </FormHelperText>
              )}
            </FormControl>
            <TextField
              key={formData[AddressField.STREET].name}
              label={formData[AddressField.STREET].name}
              value={formData[AddressField.STREET].value}
              onChange={(e) =>
                handleChange(formData[AddressField.STREET].name, e.target.value)
              }
              sx={{ width: "30%", mr: "2rem" }}
              error={formData[5].showError}
              helperText={
                formData[AddressField.STREET].showError
                  ? formData[AddressField.STREET].errorMessage
                  : ""
              }
            />
            <TextField
              type="number"
              key={formData[AddressField.HOUSE_NUMBER].name}
              label={formData[AddressField.HOUSE_NUMBER].name}
              value={formData[AddressField.HOUSE_NUMBER].value}
              onChange={(e) =>
                handleChange(
                  formData[AddressField.HOUSE_NUMBER].name,
                  e.target.value
                )
              }
              sx={{ width: "25%" }}
              error={formData[AddressField.HOUSE_NUMBER].showError}
              helperText={
                formData[AddressField.HOUSE_NUMBER].showError
                  ? formData[AddressField.HOUSE_NUMBER].errorMessage
                  : ""
              }
            />
            <Typography sx={{ fontSize: "1.2rem", fontWeight: "bold", mt: 4 }}>
              Preferred Delivery Time
            </Typography>

            <Box
              display="flex"
              gap={3}
              mt={2}
            >
              <TextField
                label="Requested Date"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={formData[AddressField.DATE].value}
                onChange={(e) =>
                  handleChange(formData[AddressField.DATE].name, e.target.value)
                }
                error={formData[AddressField.DATE].showError}
                helperText={
                  formData[AddressField.DATE].showError
                    ? formData[AddressField.DATE].errorMessage
                    : ""
                }
                sx={{ width: "30%" }}
              />

              <TextField
                label="From"
                type="time"
                InputLabelProps={{ shrink: true }}
                value={formData[AddressField.TIME_FROM].value}
                onChange={(e) =>
                  handleChange(
                    formData[AddressField.TIME_FROM].name,
                    e.target.value
                  )
                }
                error={formData[AddressField.TIME_FROM].showError}
                helperText={
                  formData[AddressField.TIME_FROM].showError
                    ? formData[AddressField.TIME_FROM].errorMessage
                    : ""
                }
                sx={{ width: "30%" }}
              />

              <TextField
                label="To"
                type="time"
                InputLabelProps={{ shrink: true }}
                value={formData[AddressField.TIME_TO].value}
                onChange={(e) =>
                  handleChange(
                    formData[AddressField.TIME_TO].name,
                    e.target.value
                  )
                }
                error={formData[AddressField.TIME_TO].showError}
                helperText={
                  formData[AddressField.TIME_TO].showError
                    ? formData[AddressField.TIME_TO].errorMessage
                    : ""
                }
                sx={{ width: "30%" }}
              />
            </Box>

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
