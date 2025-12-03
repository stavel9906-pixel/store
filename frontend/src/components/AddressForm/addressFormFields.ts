import { FormField } from "../../utils/types";

export const formFields: FormField[] = [
  {
    name: "country",
    value: "",
    validate: (value: string) => value.trim().length >= 3,
    errorMessage: "Country is required",
    showError: false,
  },
  {
    name: "first Name",
    value: "",
    validate: (value: string) => /^[A-Za-z]{2,20}$/.test(value),
    errorMessage: "First name must contain only letters (2-20 characters)",
    showError: false,
  },
  {
    name: "last Name",
    value: "",
    validate: (value: string) => /^[A-Za-z]{2,20}$/.test(value),
    errorMessage: "Last name must contain only letters (2-20 characters)",
    showError: false,
  },

  {
    name: "phone Number",
    value: "",
    validate: (value: string) => /^[0-9]{9,10}$/.test(value),
    errorMessage: "Phone number must be 9-10 digits",
    showError: false,
  },
  {
    name: "city",
    value: "",
    validate: (value: string) => value.trim().length > 0,
    errorMessage: "City is required",
    showError: false,
  },
  {
    name: "street",
    value: "",
    validate: (value: string) => value.trim().length >= 2,
    errorMessage: "Street name must be at least 2 characters",
    showError: false,
  },
  {
    name: "house Number",
    value: "",
    validate: (value: string) => +value > 0,
    errorMessage: "House number must be a positive number",
    showError: false,
  },
  {
    name: "requested Date",
    value: "",
    validate: (value: string) => {
      if (!value) return true;
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const inputDate = new Date(value);
      return inputDate >= today;
    },
    errorMessage: "Date cannot be in the past",
    showError: false,
  },
  {
    name: "requested Time From",
    value: "",
    validate: (value: string) => {
      if (!value) return true; 
      return /^([0-1]\d|2[0-3]):([0-5]\d)$/.test(value);
    },
    errorMessage: "Invalid start time",
    showError: false,
  },
  {
    name: "requested Time To",
    value: "",
    validate: (value: string, form?: FormField[]) => {
      if (!value) return true;
      if (!/^([0-1]\d|2[0-3]):([0-5]\d)$/.test(value)) return false;

      const fromField = form?.find((f) => f.name === "requested Time From");

      if (!fromField?.value) return true;

      return value > fromField.value;
    },
    errorMessage: "End time must be later than start time",
    showError: false,
  },
];
