import { styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import Badge, { badgeClasses } from "@mui/material/Badge";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCartOutlined";
import { useProductsAmountCart } from "../../context/ProductsAmountCart";

const CartBadge = styled(Badge)`
  & .${badgeClasses.badge} {
    top: -12px;
    right: -6px;
  }
`;

export default function IconButtonWithBadge() {
  const { productsAmountCart } = useProductsAmountCart();

  return (
    <IconButton>
      <ShoppingCartIcon fontSize="small" />
      <CartBadge
        badgeContent={productsAmountCart}
        color="primary"
        overlap="circular"
      />
    </IconButton>
  );
}
