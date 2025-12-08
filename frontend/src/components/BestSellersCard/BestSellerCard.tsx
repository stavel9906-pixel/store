import { FC } from "react";
import { Product } from "../../utils/types";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { useChangeAmount } from "../../hooks/useChangeAmount";

type BestSellerCardProp = {
  product: Product;
};

export const BestSellerCard: FC<BestSellerCardProp> = ({ product }) => {
  const changeAmount = useChangeAmount(product.productId);

  return (
    <>
      <Card
        className="m-4"
        style={{ borderRadius: "20px", backgroundColor: "#cdcdcdff" }}
      >
        <Card.Img
          variant="top"
          src={product.imageUrl}
          height={"400rem"}
          style={{ borderRadius: "20px" }}
        />
        <Card.Body>
          <Card.Title color="light">{product.productName}</Card.Title>
          <Card.Text>${product.price}</Card.Text>
        </Card.Body>
        <Button
          color="dark"
          className="m-4"
          onClick={() => changeAmount(1)}
        >
          ADD TO CART
        </Button>
      </Card>
    </>
  );
};
