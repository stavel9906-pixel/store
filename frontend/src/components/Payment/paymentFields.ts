import { FormField } from "../../utils/types";

export const creditCardFormFields: FormField[] = [
  {
    name: "Card Number",
    value: "",
    validate: (value: string) => /^[0-9]{16}$/.test(value),
    errorMessage: "Card number must be 16 digits",
    showError: false,
    focusField: "number",
  },
  {
    name: "Expiry Date",
    value: "",
    validate: (value: string) => {
      const regex = /^(0[1-9]|1[0-2])\/(\d{2})$/;
      if (!regex.test(value)) return false;

      const [monthStr, yearStr] = value.split("/");
      const month = parseInt(monthStr, 10);
      const year = parseInt(yearStr, 10);

      const now = new Date();
      const currentMonth = now.getMonth() + 1; 
      const currentYear = now.getFullYear() % 100; 

      if (year < currentYear ||
        (year === currentYear && month <= currentMonth))
       {
        return false;
      }

      return true;
    },
    errorMessage: "Expiry date must be in MM/YY format",
    showError: false,
    focusField: "expiry",
  },
  {
    name: "CVC/CVV",
    value: "",
    validate: (value: string) => /^[0-9]{3,4}$/.test(value),
    errorMessage: "CVC must be 3 or 4 digits",
    showError: false,
    focusField: "cvc",
  },
  {
    name: "Card Holder Name",
    value: "",
    validate: (value: string) => /^[A-Za-z]+$/.test(value),
    errorMessage: "Card holder name is required",
    showError: false,
    focusField: "name",
  },
];
