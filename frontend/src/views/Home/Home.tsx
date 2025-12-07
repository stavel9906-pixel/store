import Carousel from "react-bootstrap/Carousel";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router";
import { useGetBestSellers } from "../../api/hooks/useGetBestSellers";
import CardGroup from "react-bootstrap/CardGroup";
import { BestSellerCard } from "../../components/BestSellersCard/BestSellerCard";

const AMOUNT_BEST_SELLER_PRODUCTS = 4;

export const Home = () => {
  const { bestSellers } = useGetBestSellers(AMOUNT_BEST_SELLER_PRODUCTS);
  const navigate = useNavigate();
  

  return (
    <div style={{ position: "relative" }}>
      <div
        style={{
          position: "absolute",
          top: "20%",
          left: "50%",
          transform: "translateX(-50%)",
          color: "white",
          zIndex: 10,
          textAlign: "center",
        }}
      >
        <h1>Welcome to The Mall</h1>
        <p>Here you can find evey type of food you want!</p>
        <Button
          variant="danger"
          size="lg"
          onClick={() => navigate("/products")}
        >
          {"Shop Now >"}
        </Button>
      </div>

      <Carousel>
        <Carousel.Item>
          <img
            alt="Firstslide"
            src="src/images/food.jpg"
            width="100%"
            height="600px"
            style={{ filter: "brightness(50%)" }}
          />
        </Carousel.Item>
        <Carousel.Item>
          <img
            alt="Secondslide"
            src="src/images/vegFruits.webp"
            width="100%"
            height="600px"
            style={{ filter: "brightness(50%)" }}
          />
        </Carousel.Item>
        <Carousel.Item>
          <img
            alt="Thirdslide"
            src="src/images/cakes.jpg"
            width="100%"
            height="600px"
            style={{ filter: "brightness(50%)" }}
          />
        </Carousel.Item>
      </Carousel>
      <div
        style={{
          color: "#3a00c1ff",
          zIndex: 10,
          textAlign: "center",
          fontFamily: "Cursive",
        }}
      >
        <h1
          style={{
            fontSize: "3rem",
            margin: 0,
            letterSpacing: "2px",
            marginTop: 10,
          }}
        >
          BEST SELLERS
        </h1>
        <CardGroup className="g-4">
          {bestSellers.map((product) => <BestSellerCard key={product.productId} product={product} />)}
        </CardGroup>
      </div>
    </div>
  );
};
