import React from "react";
import { Card } from "antd";
import { EyeOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import laptop from "../../images/laptop-pic-1.jpg";
import { showAverage } from "../../functions/rating";

const { Meta } = Card;

const ProductCard = ({ product }) => {
  const { title, description, images, slug } = product;
  return (
    <div>
      <>
        {product && product.ratings && product.ratings.length > 0 ? (
          showAverage(product)
        ) : (
          <div className="text-center pt-1 pb-3">No rating yet</div>
        )}
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
              <EyeOutlined className="text-info" /> <br /> View Product
            </Link>,
            <>
              <ShoppingCartOutlined className="text-success" /> <br /> Add to
              cart
            </>,
          ]}
        >
          <Meta
            title={title}
            description={`${description && description.substr(0, 35)}...`}
          />
        </Card>
      </>
    </div>
  );
};

export default ProductCard;
