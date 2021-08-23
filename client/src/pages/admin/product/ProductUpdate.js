import React, { useState, useEffect } from "react";
import AdminNav from "../../../components/nav/AdminNav";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { getProduct, updateProduct } from "../../../functions/product";
import { getCategories, getCategorySubs } from "../../../functions/category";
import FileUpload from "../../../components/forms/FileUpload";
import { LoadingOutlined } from "@ant-design/icons";
import ProductUpdateForm from "../../../components/forms/ProductUpdateForm";

const initialState = {
  title: "",
  description: "",
  price: "",
  category: "",
  brand: "",
  shipping: "",
  quantity: "",
  images: [],
  colors: ["Black", "Brown", "Silver", "White", "Blue"],
  color: "",
};

const ProductUpdate = ({ match, history }) => {
  // state
  const [values, setValues] = useState(initialState);
  const { user } = useSelector((state) => ({ ...state }));

  const [subOptions, setSubOptions] = useState([]);
  const [selectedImages, setSelectedImages] = useState([])
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  const { slug } = match.params;

  useEffect(() => {
    loadProduct();
    loadCategories();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    values.category = selectedCategory ? selectedCategory : values.category;

    console.log(selectedImages)
    updateProduct(slug, values, user.token)
      .then((res) => {
        setLoading(false);
        toast.success(`${res.data.title} is updated successfully!`)
        history.push("/admin/products");
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
        //toast.error(error.response.data.error);
      });
  };

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const loadProduct = () => {
    getProduct(slug).then((product) => {
      // load images
      setSelectedImages(product.data.images)
      // load single product
      setValues({ ...values, ...product.data });
      // load single product category subs
      getCategorySubs(product.data.category._id).then((res) => {
        setSubOptions(res.data); // on first load, show default subs
      });
      // prepare array of sub category ids to show as default sub values in antd Select
    });
  };

  const loadCategories = () =>
    getCategories().then((category) => {
      setCategories(category.data);
    });

  const handleCategoryChange = (e) => {
    e.preventDefault();
    setValues({ ...values, subs: [] });
    setSelectedCategory(e.target.value);
    getCategorySubs(e.target.value).then((res) => {
      setSubOptions(res.data);
    });

    // if user clicks back to the original category
    // show its sub categories in default
    if (values.category._id === e.target.value) {
      loadProduct();
    }
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2">
          <AdminNav />
        </div>
        <div className="col-md-10">
          <h4>Product update</h4>
          <hr />

          <div className="p-3">
            {loading ? <LoadingOutlined className="text-danger h2" /> : ""}
            <FileUpload
              values={values}
              setValues={setValues}
              selectedImages={selectedImages}
              setSelectedImages={setSelectedImages}
              setLoading={setLoading}
            />
          </div>
          <ProductUpdateForm
            handleSubmit={handleSubmit}
            handleChange={handleChange}
            values={values}
            setValues={setValues}
            handleCategoryChange={handleCategoryChange}
            categories={categories}
            subOptions={subOptions}
            selectedCategory={selectedCategory}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductUpdate;
