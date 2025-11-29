export const formFields = [
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
    errorMessage: "First name must contain only letters (2–20 characters)",
    showError: false,
  },
  {
    name: "last Name",
    value: "",
    validate: (value: string) => /^[A-Za-z]{2,20}$/.test(value),
    errorMessage: "Last name must contain only letters (2–20 characters)",
    showError: false,
  },

  {
    name: "phoneNumber",
    value: "",
    validate: (value: string) => /^[0-9]{9,10}$/.test(value),
    errorMessage: "Phone number must be 9–10 digits",
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
    name: "houseNumber",
    value: "",
    validate: (value: string) => /^[0-9]+$/.test(value),
    errorMessage: "House number must be a number",
    showError: false,
  },
];