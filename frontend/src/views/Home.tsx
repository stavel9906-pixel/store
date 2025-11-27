import { useEffect, useMemo, useRef, useState } from "react";
import { useGetProducts } from "../api/hooks/useGetProducts";
import { useNavigate } from "react-router";
import { ProductCard } from "../components/ProductCard/ProductCard";
import { Box, Button } from "@mui/material";
import { SearchBar } from "../components/SearchBar";
import { useSearch } from "../hooks/useSearch";
import { CheapList } from "../components/CheapList/CheapList";
import { useGetProductsType } from "../api/hooks/useGetProductsType";
import SortIcon from "@mui/icons-material/Sort";
import SortByAlphaIcon from "@mui/icons-material/SortByAlpha";

export const Home = () => {
  const { products } = useGetProducts();
  const { productsType } = useGetProductsType();
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const {
    filteredArray: filteredProducts,
    search,
    onSearch,
    selectedTypes,
    setSelectedTypes,
  } = useSearch(products);
  const [sortBy, setSortBy] = useState<"price" | "name" | null>(null);
  const [priceAsc, setPriceAsc] = useState(false);
  const [nameAsc, setNameAsc] = useState(false);

  const sortedProducts = useMemo(() => {
    if (!sortBy) return filteredProducts;

    return [...filteredProducts].sort((a, b) => {
      if (sortBy === "price") {
        return priceAsc ? a.price - b.price : b.price - a.price;
      }
      if (sortBy === "name") {
        return nameAsc
          ? a.productName.localeCompare(b.productName)
          : b.productName.localeCompare(a.productName);
      }
      return 0;
    });
  }, [filteredProducts, nameAsc, priceAsc, sortBy]);

  useEffect(() => {
    if (!localStorage.getItem("token") && !sessionStorage.getItem("token")) {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div className="mt-4">
      <Button
        sx={{
          margin: 2,
          backgroundColor: "#ddb3e6ff",
          color: "black",
        }}
        onClick={() => {
          setSortBy("price");
          setPriceAsc(!priceAsc);
        }}
      >
        <SortIcon />
        <span>price</span>
      </Button>
      <Button
        sx={{
          margin: 2,
          backgroundColor: "#ddb3e6ff",
          color: "black",
        }}
        onClick={() => {
          setSortBy("name");
          setNameAsc(!nameAsc);
        }}
      >
        <SortByAlphaIcon />
        <span> name</span>
      </Button>

      <section className="search-input">
        <SearchBar
          ref={inputRef}
          searchAction={onSearch}
          searchResult={search}
          placeHolder={"Search"}
        />
      </section>
      <CheapList
        productsType={productsType}
        selected={selectedTypes}
        setSelected={setSelectedTypes}
      />
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap", // מאפשר מעבר שורה
          justifyContent: "center", // מרכז את כל השורה
          gap: 3, // רווח בין כרטיסים
          mt: 5,
        }}
      >
        {sortedProducts &&
          sortedProducts.map((product) => (
            <ProductCard
              key={product.productId}
              product={product}
            />
          ))}
      </Box>
    </div>
  );
};
