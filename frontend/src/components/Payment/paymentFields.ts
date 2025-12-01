import { FormField } from "../../utils/types";

export const creditCardFormFields: FormField[] = [
  {
    name: "Card Number",
    value: "",
    validate: (value: string) => /^[0-9]{16}$/.test(value),
    errorMessage: "Card number must be 16 digits",
    showError: false,
  },
  {
    name: "Expiry Date",
    value: "",
    validate: (value: string) => /^(0[1-9]|1[0-2])\/\d{2}$/.test(value),
    errorMessage: "Expiry date must be in MM/YY format",
    showError: false,
  },
  {
    name: "CVC/CVV",
    value: "",
    validate: (value: string) => /^[0-9]{3,4}$/.test(value),
    errorMessage: "CVC must be 3 or 4 digits",
    showError: false,
  },
  {
    name: "Card Holder Name",
    value: "",
    validate: (value: string) => /^[A-Za-z]+$/.test(value),
    errorMessage: "Card holder name is required",
    showError: false,
  },
];