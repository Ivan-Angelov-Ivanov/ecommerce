import React, { useEffect, useState } from "react";
import { getProduct, productStar, getRelated } from "../functions/product";
import SingleProduct from "../components/cards/SingleProduct";
import { useSelector } from "react-redux";
import ProductCard from "../components/cards/ProductCard";
import Comments from "../components/cards/Comments";

const Product = ({ match }) => {
  const [product, setProduct] = useState("");
  const [star, setStar] = useState(0);
  const [related, setRelated] = useState([]);

  const { slug } = match.params;
  // redux
  const { user } = useSelector((state) => ({ ...state }));

  useEffect(() => {
    loadSingleProduct();
  }, [slug]);

  useEffect(() => {
    if (product.ratings && user) {
      let existingRatingObject = product.ratings.find(
        (element) => element.postedBy.toString() === user._id.toString()
      );
      existingRatingObject && setStar(existingRatingObject.star);
    }
  }, []);

  const loadSingleProduct = () => {
    getProduct(slug).then((res) => {
      setProduct(res.data);
      // load related
      getRelated(res.data._id).then((res) => setRelated(res.data));
    });
  };

  const onStarClick = (newRating, name) => {
    setStar(newRating);
    productStar(name, newRating, user.token).then((res) => {
      console.log(res.data);
      loadSingleProduct(); // if you want to show updated rating in real time
    });
  };

  return (
    <div className="container-fluid">
      <div className="row pt-4">
        <SingleProduct
          product={product}
          onStarClick={onStarClick}
          star={star}
        />
      </div>
      <div className="row">
        <div className="col text-center pt-5 pb-5">
          <hr />
          <h4>Related products</h4>
          <hr />
        </div>
      </div>
      <div className="row pb-5">
        {related.length ? (
          related.map((r) => (
            <div key={r._id} className="col-md-4">
              <ProductCard product={r} />
            </div>
          ))
        ) : (
          <div className="text-center col">No products found</div>
        )}
      </div>
      <div className="row">
        <div className="col text-center pt-5 pb-5">
          <hr />
          <h4>Comments</h4>
          <hr />
        </div>
      </div>
      <div>
        <Comments user={user} product={product} />
      </div>
    </div>
  );
};

export default Product;
