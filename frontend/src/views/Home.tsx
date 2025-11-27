import { useEffect, useRef } from "react";
import { useGetProducts } from "../api/hooks/useGetProducts";
import { useNavigate } from "react-router";
import { ProductCard } from "../components/ProductCard/ProductCard";
import { Box } from "@mui/material";
import { SearchBar } from "../components/SearchBar";
import { useSearch } from "../hooks/useSearch";

export const Home = () => {
  const { products } = useGetProducts();
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const {
    filteredArray: filteredProducts,
    search,
    onSearch,
  } = useSearch(products);

  useEffect(() => {
    if (!localStorage.getItem("token") && !sessionStorage.getItem("token")) {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div className="mt-4">
      <section className="search-input">
        <SearchBar
          ref={inputRef}
          searchAction={onSearch}
          searchResult={search}
          placeHolder={"סנן שדות"}
        />
      </section>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap", // מאפשר מעבר שורה
          justifyContent: "center", // מרכז את כל השורה
          gap: 3, // רווח בין כרטיסים
          mt: 5,
        }}
      >
        {filteredProducts &&
          filteredProducts.map((product) => (
            <ProductCard
              key={product.productId}
              product={product}
            />
          ))}
      </Box>
    </div>
  );
};
