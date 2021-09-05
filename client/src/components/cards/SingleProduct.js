import React, { useState } from "react";
import { Card, Tabs, Tooltip } from "antd";
import { HeartOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import laptop from "../../images/laptop-pic-1.jpg";
import ProductListItems from "./ProductListItems";
import StarRatings from "react-star-ratings";
import RatingModal from "../modal/RatingModal";
import { showAverage } from "../../functions/rating";
import { useSelector, useDispatch } from "react-redux";
import _ from "lodash";
import { addToWishlist } from "../../functions/user";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";

const { TabPane } = Tabs;

// this is children component of Product page
const SingleProduct = ({ product, onStarClick, star }) => {
  const [tooltip, setTooltip] = useState("Click to add");
  const { title, images, description } = product;

  // redux
  const { user, cart } = useSelector((state) => ({ ...state }));
  const dispatch = useDispatch();
  let history = useHistory();

  const handleAddToCart = () => {
    // create cart array
    let cart = [];
    if (typeof window !== "undefined") {
      // if cart is in local storage GET it
      if (localStorage.getItem("cart")) {
        cart = JSON.parse(localStorage.getItem("cart"));
      }
      // push new product to cart
      cart.push({
        ...product,
        count: 1,
      });
      // remove duplicates
      let unique = _.uniqWith(cart, _.isEqual);
      // save to local storage
      // console.log("Unique", unique);
      localStorage.setItem("cart", JSON.stringify(unique));
      // show tooltip
      setTooltip("Added");

      // add to redux state
      dispatch({
        type: "ADD_TO_CART",
        payload: unique,
      });
      //show cart items in side drawer
      dispatch({
        type: "SET_VISIBLE",
        payload: true,
      });
    }
  };
  const handleAddToWishlist = (e) => {
    e.preventDefault();
    addToWishlist(product._id, user.token).then((res) => {
      toast.success("Added to Wishlist!");
      history.push("/user/wishlist");
    });
  };

  return (
    <>
      <div className="card p-3 m-4 col-md-6">
        {images && images.length ? (
          <Carousel showArrows={true} autoPlay infiniteLoop>
            {images &&
              images.map((image) => (
                <img
                  className="bg-white"
                  alt={title}
                  src={image.url}
                  key={image.public_id}
                  style={{ objectFit: "contain" }}
                />
              ))}
          </Carousel>
        ) : (
          <Card
            cover={<img alt={title} src={laptop} className="mb-3 card-image" />}
          ></Card>
        )}

        <Tabs type="card" defaultActiveKey="1">
          <TabPane style={{ whiteSpace: "pre-wrap" }} tab="Description" key="1">
            {description && description}
          </TabPane>
          <TabPane tab="More" key="2">
            Call us on xxxx-xxx-xxx to learn more about the product
          </TabPane>
        </Tabs>
      </div>

      <div className="card p-3 m-4 col-md-5 bg-light">
        <h1 className="bg-info p-3 rounded-top">{title}</h1>
        {product && product.ratings && product.ratings.length > 0 ? (
          showAverage(product)
        ) : (
          <div className="text-center pt-1 pb-3">No rating yet</div>
        )}
        <Card
          actions={[
            <Tooltip title={tooltip}>
              <a disabled={product.quantity < 1} onClick={handleAddToCart}>
                <ShoppingCartOutlined className="text-success" /> <br />
                {product.quantity < 1 ? "Out of Stock" : "Add to cart"}
              </a>
            </Tooltip>,
            <a onClick={handleAddToWishlist}>
              <HeartOutlined className="text-info" />
              <br />
              Add to Wishlist
            </a>,
            <RatingModal>
              <StarRatings
                name={product._id}
                numberOfStar={5}
                rating={star}
                changeRating={onStarClick}
                isSelectable={true}
                starRatedColor="red"
              />
            </RatingModal>,
          ]}
        >
          <ProductListItems product={product} />
        </Card>
      </div>
    </>
  );
};

export default SingleProduct;
