import React from "react";
import ModalImage from "react-modal-image";
import laptop from "../../images/laptop-pic-1.jpg";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  CloseOutlined,
} from "@ant-design/icons";

const ProductCardInCheckout = ({ product }) => {
  const colors = ["Black", "Brown", "Silver", "White", "Blue"];
  const dispatch = useDispatch();

  const handleColorChange = (e) => {
    console.log("color changed", e.target.value);

    let cart = [];
    if (typeof window !== undefined) {
      if (localStorage.getItem("cart")) {
        cart = JSON.parse(localStorage.getItem("cart"));
      }
      cart.map((cartProduct, i) => {
        if (cartProduct._id === product._id) {
          cart[i].color = e.target.value;
        }
      });
      localStorage.setItem("cart", JSON.stringify(cart));
      dispatch({
        type: "ADD_TO_CART",
        payload: cart,
      });
    }
  };

  const handleQualityChange = (e) => {
    console.log("Available quantity", product.quantity);
    let count = e.target.value < 1 ? 1 : e.target.value;
    let cart = [];

    if (count > product.quantity) {
      toast.error(`Max available quantity: ${product.quantity}`);
      return;
    }
    if (typeof window !== undefined) {
      if (localStorage.getItem("cart")) {
        cart = JSON.parse(localStorage.getItem("cart"));
      }
      cart.map((cartProduct, i) => {
        if (cartProduct._id === product._id) {
          cart[i].count = count;
        }
      });
      localStorage.setItem("cart", JSON.stringify(cart));
      dispatch({
        type: "ADD_TO_CART",
        payload: cart,
      });
    }
  };

  const handleRemove = () => {
    let cart = [];

    if (typeof window !== undefined) {
      if (localStorage.getItem("cart")) {
        cart = JSON.parse(localStorage.getItem("cart"));
      }

      cart.map((cartProduct, i) => {
        if (cartProduct._id === product._id) {
          cart.splice(i, 1);
        }
      });
      localStorage.setItem("cart", JSON.stringify(cart));
      dispatch({
        type: "ADD_TO_CART",
        payload: cart,
      });
    }
  };

  return (
    <tbody>
      <tr>
        <td>
          <div style={{ width: "100px", height: "auto" }}>
            {product.images.length ? (
              <ModalImage
                small={product.images[0].url}
                large={product.images[0].url}
              />
            ) : (
              <ModalImage small={laptop} large={laptop} />
            )}
          </div>
        </td>
        <td>{product.title}</td>
        <td>{product.price}</td>
        <td>{product.brand.name}</td>
        <td>
          <select
            onChange={handleColorChange}
            name="color"
            className="form-control"
          >
            {product.color ? (
              <option>{product.color}</option>
            ) : (
              <option>Select</option>
            )}
            {colors
              .filter((color) => color !== product.color)
              .map((color) => (
                <option key={color}>{color}</option>
              ))}
          </select>
        </td>
        <td className="text-center">
          <input
            type="number"
            className="form-control"
            value={product.count}
            onChange={handleQualityChange}
          />
        </td>
        <td className="text-center">
          {product.shipping === "Yes" ? (
            <CheckCircleOutlined className="text-success" />
          ) : (
            <CloseCircleOutlined className="text-danger" />
          )}
        </td>
        <td className="text-center">
          <CloseOutlined
            onClick={handleRemove}
            className="text-danger pointer"
          />
        </td>
      </tr>
    </tbody>
  );
};

export default ProductCardInCheckout;
