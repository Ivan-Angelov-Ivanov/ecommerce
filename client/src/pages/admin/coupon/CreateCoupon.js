import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import DatePicker from "react-datepicker";
import {
  getCoupons,
  createCoupon,
  removeCoupon,
} from "../../../functions/coupon";
import "react-datepicker/dist/react-datepicker.css";
import { DeleteOutlined } from "@ant-design/icons";
import AdminNav from "../../../components/nav/AdminNav";
import LocalSearch from "../../../components/forms/LocalSearch";

const CreateCoupon = () => {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [discount, setDiscount] = useState("");
  const [keyword, setKeyword] = useState("");
  const [coupons, setCoupons] = useState([]);

  // redux
  const { user } = useSelector((state) => ({ ...state }));

  useEffect(() => {
    loadAllCoupons();
  }, []);

  const loadAllCoupons = () => {
    getCoupons().then((res) => setCoupons(res.data));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    createCoupon({ name, expiry, discount }, user.token)
      .then((res) => {
        console.log(res);
        setLoading(false);
        loadAllCoupons();
        setName("");
        setDiscount("");
        setExpiry("");
        toast.success(`Coupon "${res.data.name}" is added successfully!`);
      })
      .catch((error) => {
        console.log("Create coupon error --->", error);
      });
  };

  const handleRemove = async (couponId) => {
    if (window.confirm("Delete?")) {
      setLoading(true);
      removeCoupon(couponId, user.token)
        .then((res) => {
          loadAllCoupons();
          setLoading(false);
          toast.error(`${res.data.name} deleted!`);
        })
        .catch((error) => {
          setLoading(false);
          console.log(error);
        });
    }
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2">
          <AdminNav />
        </div>
        <div className="col-md-10">
          {loading ? (
            <h4 className="text-danger">Loading...</h4>
          ) : (
            <h4>Coupon</h4>
          )}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="text-muted">Name</label>
              <input
                type="text"
                className="form-control"
                onChange={(e) => setName(e.target.value)}
                value={name}
                autoFocus
                required
              />
            </div>
            <div className="form-group">
              <label className="text-muted">Discount %</label>
              <input
                type="text"
                className="form-control"
                onChange={(e) => setDiscount(e.target.value)}
                value={discount}
                required
              />
            </div>
            <div className="form-group">
              <label className="text-muted">Expiry</label>
              <br />
              <DatePicker
                className="form-control"
                selected={expiry}
                value={expiry}
                required
                onChange={(date) => setExpiry(date)}
              />
            </div>
            <button className="btn btn-outline-primary">Save</button>
          </form>

          <LocalSearch keyword={keyword} setKeyword={setKeyword} />

          <br />
          <h4>{coupons.length} Coupons</h4>
          <table className="table table-bordered">
            <thead className="thead-light">
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Expiry</th>
                <th scope="col">Discount</th>
                <th scope="col">Action</th>
              </tr>
            </thead>

            <tbody>
              {coupons.map((coupon) => (
                <tr key={coupon._id}>
                  <td>{coupon.name}</td>
                  <td>{new Date(coupon.expiry).toLocaleDateString()}</td>
                  <td>{coupon.discount}%</td>
                  <td>
                    <DeleteOutlined
                      onClick={() => handleRemove(coupon._id)}
                      className="text-danger pointer"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CreateCoupon;
