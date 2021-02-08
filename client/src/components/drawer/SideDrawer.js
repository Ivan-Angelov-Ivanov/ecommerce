import React from "react";
import { Drawer, Button } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import laptop from "../../images/laptop-pic-1.jpg";

const SideDrawer = () => {
  const dispatch = useDispatch();
  const { drawer, cart } = useSelector((state) => ({ ...state }));
  const imageStyle = {
    width: "100%",
    height: "50px",
    objectFit: "cover",
  };

  return (
    <Drawer
      className="text-center"
      title={`Cart / ${
        cart.length !== 1 ? `${cart.length} Products` : "1 Product"
      }`}
      onClose={() => {
        dispatch({
          type: "SET_VISIBLE",
          payload: false,
        });
      }}
      visible={drawer}
    >
      {cart.map((cartProduct) => (
        <div key={cartProduct._id} className="row">
          <div className="col">
            {cartProduct.images[0] ? (
              <>
                <img
                  alt={cartProduct.title}
                  src={cartProduct.images[0].url}
                  style={imageStyle}
                />
                <p className="text-center bg-secondary text-light">
                  {cartProduct.title} x {cartProduct.count}
                </p>
              </>
            ) : (
              <>
                <img alt="default" src={laptop} style={imageStyle} />
                <p className="text-center bg-secondary text-light">
                  {cartProduct.title} x {cartProduct.count}
                </p>
              </>
            )}
          </div>
        </div>
      ))}
      <Link to="/cart">
        <button
          onClick={() =>
            dispatch({
              type: "SET_VISIBLE",
              payload: false,
            })
          }
          className="text-center btn btn-primary btn-raised btn-block"
        >GO TO CART</button>
      </Link>
    </Drawer>
  );
};

export default SideDrawer;
