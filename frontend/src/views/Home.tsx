import { useEffect, useMemo, useRef, useState } from "react";
import { useGetProducts } from "../api/hooks/useGetProducts";
import { useNavigate } from "react-router";
import { ProductCard } from "../components/ProductCard/ProductCard";
import { Box, Button, IconButton, Tooltip } from "@mui/material";
import { SearchBar } from "../components/SearchBar";
import { useSearch } from "../hooks/useSearch";
import { CheapList } from "../components/CheapList/CheapList";
import { useGetProductsType } from "../api/hooks/useGetProductsType";
import SortIcon from "@mui/icons-material/Sort";
import SortByAlphaIcon from "@mui/icons-material/SortByAlpha";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { useGetIsAdmin } from "../api/hooks/useGetIsAdmin";
import adminApi from "../api/adminApi";
import Swal from "sweetalert2";
import { ProductForm } from "../components/ProductForm/ProductForm";

export const Home = () => {
  const { products, setProducts } = useGetProducts();
  const { isAdmin } = useGetIsAdmin();
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
  const [openForm, setOpenForm] = useState(false);
  const handleCloseForm = () => setOpenForm(false);

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

  const handleRemove = async (productId: number) => {
    try {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      await adminApi.admin().deleteProduct(token, productId);
      setProducts(
        (prev) => prev?.filter((p) => p.productId !== productId) || []
      );
    } catch (err) {
      Swal.fire(
        "Oops!",
        "There seems to be a problem deleting the product. Please try again.",
        "error"
      );
    }
  };

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
          backgroundColor: "#ffecffff",
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
          backgroundColor: "#ffecffff",
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
      {isAdmin && (
        <>
        <Tooltip title="add product">
          <IconButton
            sx={{
              position: "fixed",
              right: "2%",
              color: "#5d00ffff",
              zIndex: 1,
            }}
            onClick={() => setOpenForm(true)}
          >
            <AddCircleIcon sx={{ fontSize: "5rem" }} />
          </IconButton>
        </Tooltip>
        <ProductForm open={openForm} handleClose={handleCloseForm} product={null} setProducts={setProducts}/>
        </>
      )}

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
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 3,
          mt: 5,
        }}
      >
        {sortedProducts &&
          sortedProducts.map((product) => (
            <ProductCard
              key={product.productId}
              product={product}
              isAdmin={isAdmin}
              handleRemove={() => handleRemove(product.productId)}
            />
          ))}
      </Box>
    </div>
  );
};
