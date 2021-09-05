import React, { useState, useEffect } from "react";
import TypeWriter from "typewriter-effect";
import { getProducts } from "../../functions/product";
import { Carousel } from "react-responsive-carousel";
import { Link } from "react-router-dom";
import { Button } from "antd";

const Jumbotron = ({ text }) => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    loadAllProducts();
  }, []);

  const loadAllProducts = () => {
    getProducts("sold", "desc", page).then((res) => {
      setProducts(res.data);
    });
  };

  return (
    <div className="bg-light">
      <div className="h1 p-3 text-warning font-weight-bold">
        <TypeWriter
          options={{
            strings: text,
            autoStart: true,
            loop: true,
          }}
        />
      </div>
      <Carousel
        showArrows={true}
        autoPlay
        infiniteLoop
        showStatus={false}
        showThumbs={false}
        showIndicators={false}
        dynamicHeight={true}
      >
        {products.length &&
          products
            .filter((product) => product.sold > 3)
            .map((product, index) => (
              <div className={"carousel-image-background-" + index}>
                <div className="row p-4 ">
                  <div
                    className={
                      index === 2
                        ? "col font-weight-bold"
                        : "col text-white font-weight-bold"
                    }
                  >
                    <h2
                      className={
                        index === 2
                          ? "font-weight-bold"
                          : "text-white font-weight-bold"
                      }
                    >
                      {product.title.toUpperCase()}
                    </h2>
                    <p
                      className="text-left px-5"
                      style={{ whiteSpace: "pre-wrap" }}
                    >
                      {product.description}
                    </p>
                    <h2 className="text-white">{product.price}$</h2>
                    <button className="btn btn-info">
                      <Link
                        className="text-white"
                        to={`/product/${product.slug}`}
                      >
                        Learn More
                      </Link>
                    </button>
                  </div>
                  <img
                    className="col p-1"
                    alt={product.name}
                    src={product.images[0].url}
                    key={product._id}
                    style={{ objectFit: "contain" }}
                  />
                </div>
              </div>
            ))}
      </Carousel>
    </div>
  );
};

export default Jumbotron;
