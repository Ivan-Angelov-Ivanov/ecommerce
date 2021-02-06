import React, { useState, useEffect } from "react";
import { getSub } from "../../functions/sub";
import { Link } from "react-router-dom";
import ProductCard from "../../components/cards/ProductCard";
import SubList from "../../components/sub/SubList";

const SubHome = ({ match }) => {
  const [sub, setSub] = useState({});
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const { slug } = match.params;

  useEffect(() => {
    setLoading(true);
    getSub(slug).then((res) => {
      console.log(JSON.stringify(res.data, null, 4));
      setSub(res.data.sub);
      setProducts(res.data.products);
      console.log(res.data.sub);
      setLoading(false);
    });
  }, [slug]);

  return (
    <div className="container">
      <div className="row">
        <div className="col">
          {loading ? (
            <h4 className="text-center text-danger p-3 mt-5 mb-5d display-4 jumbotron">
              Loading...
            </h4>
          ) : (
            <h4 className="text-center   p-3 mt-5 mb-5d display-4 jumbotron">
              {products.length !== 1
                ? `${products.length} Products`
                : `${products.length} Product`}{" "}
              in "{sub.name}" sub category
            </h4>
          )}
        </div>
      </div>
      <div className="row">
        {products.map((product) => (
          <div key={product._id} className="col-md-4">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubHome;
