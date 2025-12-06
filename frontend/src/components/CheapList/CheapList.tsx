import CheckIcon from "@mui/icons-material/Check";
import Box from "@mui/joy/Box";
import Checkbox from "@mui/joy/Checkbox";
import Chip from "@mui/joy/Chip";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import * as React from "react";
import { ProductType } from "../../utils/types";
import { FC, SetStateAction } from "react";
import { CssVarsProvider } from "@mui/joy/styles";
import Button from "@mui/joy/Button";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ChipDelete from "@mui/joy/ChipDelete";
import { useGetIsAdmin } from "../../api/hooks/useGetIsAdmin";
import adminApi from "../../api/adminApi";
import Swal from "sweetalert2";

interface CheapListProps {
  productsType: ProductType[];
  selected: string[];
  setSelected: React.Dispatch<SetStateAction<string[]>>;
  setProductsType: React.Dispatch<React.SetStateAction<ProductType[]>>;
}

const MAX_PRODUCTS_TYPE_LINE = 10;

export const CheapList: FC<CheapListProps> = ({
  productsType,
  selected,
  setSelected,
  setProductsType,
}) => {
  const [expanded, setExpanded] = React.useState(false);
  const { isAdmin } = useGetIsAdmin();

  const visibleCount = expanded ? productsType.length : MAX_PRODUCTS_TYPE_LINE;

  const handleDelete = async (id: number) => {
    try {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      await adminApi.admin().deleteProductType(token, id);
      setProductsType((prev) => prev?.filter((type) => type.id !== id) || []);
    } catch (err) {
      Swal.fire(
        "Oops!",
        "There seems to be a problem deleting the product type. Please try again.",
        "error"
      );
    }
  };

  return (
    <CssVarsProvider>
      <Box sx={{ display: "flex", gap: 1, justifyContent: "center" }}>
        <div>
          <br />
          <Box
            role="group"
            aria-labelledby="fav-movie"
            sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}
          >
            {productsType.slice(0, visibleCount).map(({ id, name }) => {
              const checked = selected.includes(id.toString());
              return (
                <Chip
                  key={name}
                  endDecorator={isAdmin ? <ChipDelete onDelete={() => handleDelete(id)} /> : null}
                  variant="plain"
                  color={checked ? "primary" : "neutral"}
                  startDecorator={
                    checked && (
                      <CheckIcon sx={{ zIndex: 1, pointerEvents: "none" }} />
                    )
                  }
                >
                  <Checkbox
                    variant="outlined"
                    color={checked ? "primary" : "neutral"}
                    disableIcon
                    overlay
                    label={name}
                    checked={checked}
                    onChange={(event) => {
                      setSelected((ids) =>
                        !event.target.checked
                          ? ids.filter((n) => n !== id.toString())
                          : [...ids, id.toString()]
                      );
                    }}
                  />
                </Chip>
              );
            })}
          </Box>

          {productsType.length > MAX_PRODUCTS_TYPE_LINE && (
            <Button
              variant="outlined"
              color="neutral"
              size="sm"
              className="b-none"
              onClick={() => setExpanded((e) => !e)}
              sx={{ mt: 1 }}
            >
              {!expanded ? (
                <div>
                  <span>Show more</span>
                  <ExpandMoreIcon />
                </div>
              ) : (
                <div>
                  <span>Show less</span>
                  <ExpandLessIcon />
                </div>
              )}
            </Button>
          )}
        </div>
      </Box>
    </CssVarsProvider>
  );
};
