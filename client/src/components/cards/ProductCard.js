import React from "react";
import { Card } from "antd";
import { EyeOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import laptop from "../../images/laptop-pic-1.jpg";

const { Meta } = Card;

const ProductCard = ({ product }) => {
  const { title, description, images, slug } = product;
  return (
    <div>
      <Card
        cover={
          <img
            alt={title}
            src={images && images.length ? images[0].url : laptop}
            style={{ height: "150px", objectFit: "cover" }}
            className="p-1"
          />
        }
        actions={[
          <Link to={`/product/${slug}`}>
            <EyeOutlined className="text-warning" /> <br /> View Product
          </Link>,
          <>
            <ShoppingCartOutlined className="text-danger" /> <br /> Add to cart
          </>,
        ]}
      >
        <Meta
          title={title}
          description={`${description && description.substr(0, 35)}...`}
        />
      </Card>
    </div>
  );
};

export default ProductCard;
