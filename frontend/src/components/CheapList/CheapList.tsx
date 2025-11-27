import CheckIcon from "@mui/icons-material/Check";
import Box from "@mui/joy/Box";
import Checkbox from "@mui/joy/Checkbox";
import Chip from "@mui/joy/Chip";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import * as React from "react";
import { ProductType } from "../../utils/types";
import { FC } from "react";
import { CssVarsProvider } from "@mui/joy/styles";
import Button from "@mui/joy/Button";
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

interface CheapListProps {
  productsType: ProductType[];
  selected: string[];
  setSelected: React.Dispatch<React.SetStateAction<string[]>>
}

const MAX_PRODUCTS_TYPE_LINE = 10;

export const CheapList: FC<CheapListProps> = ({ productsType, selected, setSelected }) => {
  const [expanded, setExpanded] = React.useState(false);

  const visibleCount = expanded ? productsType.length : MAX_PRODUCTS_TYPE_LINE;

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
            {productsType.slice(0, visibleCount).map(({ name }) => {
              const checked = selected.includes(name);
              return (
                <Chip
                  key={name}
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
                      setSelected((names) =>
                        !event.target.checked
                          ? names.filter((n) => n !== name)
                          : [...names, name]
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
