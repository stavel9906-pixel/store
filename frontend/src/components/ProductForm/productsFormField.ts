/* eslint-disable no-useless-escape */
import { FormField } from "../../utils/types";

export const productFormFields: FormField[] = [
  {
    name: "productName",
    value: "",
    validate: (value: string) =>
      /^(?!.* {2})[A-Za-z0-9][A-Za-z0-9 \-]{0,48}[A-Za-z0-9]$/.test(
        value.trim()
      ),
    errorMessage: "Invalid product name",
    showError: false,
  },
  {
    name: "productType",
    value: "",
    validate: (value: string) => value.toString().length > 0,
    errorMessage: "Product type is required",
    showError: false,
  },
  {
    name: "price",
    value: "",
    validate: (value: string) => +value > 0,
    errorMessage: "Price must be a positive number",
    showError: false,
  },

  {
    name: "description",
    value: "",
    validate: (value: string) => /^.{10,}$/.test(value.trim()),
    errorMessage: "Description must be at least 10 characters",
    showError: false,
  },
  {
    name: "image",
    value: "",
    validate: (value: string) => value.length > 0,
    errorMessage: "Image is required",
    showError: false,
  },
];
