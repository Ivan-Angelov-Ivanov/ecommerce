import React, { useState, useEffect } from "react";
import {
  getUserCart,
  emptyUserCart,
  saveUserAddress,
  applyCoupon,
  createCashOrderForUser,
} from "../functions/user";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const Checkout = ({ history }) => {
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [address, setAddress] = useState("");
  const [addressSaved, setAddressSaved] = useState(false);
  const [coupon, setCoupon] = useState("");

  //discount price
  const [totalAfterDiscount, setTotalAfterDiscount] = useState(0);
  const [discountError, setDiscountError] = useState("");

  const dispatch = useDispatch();
  const { user, COD } = useSelector((state) => ({ ...state }));
  const couponTrueOrFalse = useSelector((state) => state.coupon);

  useEffect(() => {
    getUserCart(user.token).then((res) => {
      //console.log("user cart res", JSON.stringify(res.data, null, 4));
      setProducts(res.data.products);
      setTotal(res.data.cartTotal);
    });
  }, [user.token]);
  const saveAddressToDB = () => {
    saveUserAddress(user.token, address).then((res) => {
      if (res.data.ok) {
        setAddressSaved(true);
        toast.success("Address saved");
      }
    });
  };

  const emptyCart = () => {
    // remove from local storage
    if (typeof window !== undefined) {
      localStorage.removeItem("cart");
    }
    // remove from redux
    dispatch({
      type: "ADD_TO_CART",
      payload: [],
    });
    //remove from back end
    emptyUserCart(user.token).then((res) => {
      setProducts([]);
      setTotal(0);
      setTotalAfterDiscount(0);
      setCoupon("");
      toast.success("Cart is empty. Continue shopping");
    });
  };

  const showAddress = () => (
    <>
      <ReactQuill theme="snow" value={address} onChange={setAddress} />
      <button className="btn btn-primary mt-2" onClick={saveAddressToDB}>
        Save
      </button>
    </>
  );

  const showProductSummary = () => (
    <>
      <p>List of products</p>
      {products.map((p, i) => (
        <div key={i}>
          <p>
            {p.product.title} ({p.color}) x {p.count} ={" "}
            {p.product.price * p.count}
          </p>
        </div>
      ))}
    </>
  );

  const showApplyCoupon = () => (
    <>
      <input
        onChange={(e) => {
          setCoupon(e.target.value);
          setDiscountError("");
        }}
        type="text"
        className="form-control"
      />
      <button onClick={applyDiscountCoupon} className="btn btn-primary mt-2">
        Apply
      </button>
    </>
  );

  const applyDiscountCoupon = () => {
    console.log("sent coupon to back end", coupon);
    applyCoupon(user.token, coupon).then((res) => {
      console.log(res.data);
      if (res.data) {
        setTotalAfterDiscount(res.data);
        // update redux coupon applied true/false
        dispatch({
          type: "COUPON_APPLIED",
          payload: true,
        });
      }
      if (res.data.error) {
        setDiscountError(res.data.error);
        // update redux coupon applied
        dispatch({
          type: "COUPON_APPLIED",
          payload: false,
        });
      }
    });
  };

  const createCashOrder = () => {
    createCashOrderForUser(user.token, COD, couponTrueOrFalse).then((res) => {
      console.log("User cash order created", res);
      // empty cart from redux, local storage, reset coupon, reset COD, redirect to user history
      if (res.data.ok) {
        // empty cart from local storage
        if (typeof window !== undefined) localStorage.removeItem("cart");
        // empty cart from redux
        dispatch({
          type: "ADD_TO_CART",
          payload: [],
        });
        // reset coupon to false
        dispatch({
          type: "COUPON_APPLIED",
          payload: false,
        });
        // empty cash on delivery
        dispatch({
          type: "CASH_ON_DELIVERY",
          payload: false,
        });
        // empty cart from database
        emptyUserCart(user.token);
        //redirect
        setTimeout(() => {
          history.push("/user/history");
        }, 2000);
      }
    });
  };

  return (
    <div className="row">
      <div className="col-md-6">
        <h4>Delivery Address</h4>
        <br />
        <br />
        {showAddress()}
        <hr />
        <h4>Got Coupon?</h4>
        <br />
        {showApplyCoupon()}
        <br />
        {discountError && (
          <p className="bg-danger text-light text-center m-2  p-2">
            {discountError}
          </p>
        )}
      </div>
      <div className="col-md-6">
        <h4>Order Summary</h4>
        <hr />
        <p>Products {products.length}</p>
        <hr />
        {showProductSummary()}
        <hr />
        <p>Cart Total: ${total}</p>
        {totalAfterDiscount > 0 && (
          <p className="bg-success text-light text-center m-2  p-2">
            Discount applied! Total payable: ${totalAfterDiscount}
          </p>
        )}
        <div className="row">
          <div className="col-md-6">
            {COD ? (
              <button
                disabled={!addressSaved || !products.length}
                className="btn btn-primary"
                onClick={createCashOrder}
              >
                Place Order
              </button>
            ) : (
              <button
                disabled={!addressSaved || !products.length}
                className="btn btn-primary"
                onClick={() => history.push("/payment")}
              >
                Place Order
              </button>
            )}
          </div>
          <div className="col-md-6">
            <button
              disabled={!products.length}
              onClick={emptyCart}
              className="btn btn-danger"
            >
              Empty Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
