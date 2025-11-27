import { useEffect } from "react";
import { useGetProducts } from "../api/hooks/useGetProducts";
import { useNavigate } from "react-router";
import { ProductCard } from "../components/ProductCard";

export const Home = () => {
  const { products, setProducts } = useGetProducts();
  const navigate = useNavigate();
  console.log(products)

  useEffect(() => {
    if (!localStorage.getItem("token") && !sessionStorage.getItem("token")) {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <>
      {products &&
        products.map((product) => {
          <ProductCard product={product} />;
        })}
    </>
  );
};
