import { AuthField } from "../../utils/enums";
import { FormField } from "../../utils/types";

export const authFormFields: FormField[] = [
  {
    name: "username",
    value: "",
    validate: (value: string) => value.trim().length >= 3,
  errorMessage: "Username must contain at least 3 characters",
    showError: false,
  },
  {
    name: "email",
    value: "",
    validate: (value: string) =>
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value),
    errorMessage: "Invalid email address",
    showError: false,
  },
  {
    name: "password",
    value: "",
    validate: (value: string) =>
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(value),
    errorMessage:
      "Password must be at least 8 characters, include uppercase, lowercase, number and special character",
    showError: false,
  },
  {
    name: "confirmedPassword",
    value: "",
    validate: (value: string, allFields?: FormField[]) => {
      return allFields ? value === allFields[AuthField.PASSWORD].value : false;
    },
    errorMessage: "Passwords do not match",
    showError: false,
  },
  {
    name: "profile",
    value: "",
    validate: () => true,
    errorMessage: "",
    showError: false,
  },
  {
    name: "currentPassword",
    value: "",
    validate: () => true,
    errorMessage:
      "",
    showError: false,
  },
];
