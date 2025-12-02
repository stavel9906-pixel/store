import * as React from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import { Orders } from "../components/Orders";
import { AddressForm } from "../components/AddressForm/AddressForm";
import { CreditCardForm } from "../components/Payment/Payment";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { Typography } from "@mui/material";
import { useNavigate } from "react-router";
import { useOrderId } from "../context/OrderId";
import { useProductsAmountCart } from "../context/ProductsAmountCart";

const steps = ["Cart", "Place Order", "Pay", "Order Complete"];
const CART_STEP = 0;
const DETAILS_STEP = 1;
const PAYMENT_STEP = 2;
const COMPLETED_PAGE = 3;

export default function HorizontalLinearStepper() {
  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set<number>());
  const { setOrderId } = useOrderId();
  const { setProductsAmountCart } = useProductsAmountCart();
  
  const navigate = useNavigate();

  const isStepSkipped = (step: number) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <Box sx={{ width: "100%", mt: 5 }}>
      <Stepper activeStep={activeStep}>
        {steps.map((label, index) => {
          const stepProps: { completed?: boolean } = {};
          const labelProps: {
            optional?: React.ReactNode;
          } = {};
          if (isStepSkipped(index)) {
            stepProps.completed = false;
          }
          return (
            <Step
              key={label}
              {...stepProps}
            >
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      {activeStep === CART_STEP && <Orders handleNext={handleNext} />}
      {activeStep === DETAILS_STEP && (
        <AddressForm
          handleNext={handleNext}
          handleBack={handleBack}
        />
      )}
      {activeStep === PAYMENT_STEP && (
        <Box
          sx={{
            minHeight: "60vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CreditCardForm handleNext={handleNext} />
        </Box>
      )}
      {activeStep === COMPLETED_PAGE && (
        <>
          <CheckCircleOutlineIcon sx={{ fontSize: "10rem" }} />
          <Typography sx={{ fontSize: "5rem" }}>Payment Successful!</Typography>
          <h4>your payment has been completed</h4>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#9900ffff",
              paddingInline: "5rem",
              fontSize: "1.5rem",
              mt: 2,
            }}
            onClick={() => {
              navigate("/dashboard");
              setOrderId(null);
              setProductsAmountCart(0);
            }}
          >
            Finish
          </Button>
          <Typography sx={{mt: 2, color: "gray"}}>* We will try to meet the delivery times you requested. If this will not be possible, we will contact you!</Typography>
        </>
      )}
    </Box>
  );
}
