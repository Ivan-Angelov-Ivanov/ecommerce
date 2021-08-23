import React, { useState, useEffect } from "react";
import AdminNav from "../../../components/nav/AdminNav";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { Select } from "antd";
import { updateSub, getSub } from "../../../functions/sub";
import { getCategories } from "../../../functions/category";
import CategoryForm from "../../../components/forms/CategoryForm";
import FileUpload from "../../../components/forms/FileUpload";

const { Option } = Select;

const SubUpdate = ({ match, history }) => {
  const { user } = useSelector((state) => ({ ...state }));
  const [name, setName] = useState("");
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [parents, setParents] = useState([]);

  useEffect(() => {
    loadCategories();
    loadSub();
  }, []);

  const loadCategories = () =>
    getCategories().then((category) => setCategories(category.data));

  const loadSub = () =>
    getSub(match.params.slug).then((sub) => {
      setName(sub.data.sub.name);
      setImages(sub.data.sub.images);
      setParents(sub.data.sub.parents);
    });

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    updateSub(match.params.slug, { name, images, parents }, user.token)
      .then((res) => {
        setLoading(false);
        setName("");
        toast.success(`"${res.data.name}" is updated successfully!`);
        history.push("/admin/sub");
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
        if (error.response.status === 400) toast.error(error.response.data);
      });
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2">
          <AdminNav />
        </div>
        <div className="col">
          {loading ? (
            <h4 className="text-danger">Loading...</h4>
          ) : (
            <h4>Update sub category</h4>
          )}

          <div className="p-3">
            <FileUpload
              selectedImages={images}
              setSelectedImages={setImages}
              setLoading={setLoading}
            />
          </div>

          <div className="form-group">
            <label>Parent category</label>
            <Select
              name="category"
              mode="multiple"
              className="form-control"
              onChange={(value) => setParents(value)}
              value={parents.map((parent) => parent.name)}
            >
              {categories.length > 0 &&
                categories.map((category) => (
                  <Option
                    key={category._id}
                    value={category._id}
                  >
                    {category.name}
                  </Option>
                ))}
            </Select>
          </div>

          <CategoryForm
            handleSubmit={handleSubmit}
            name={name}
            setName={setName}
          />
        </div>
      </div>
    </div>
  );
};

export default SubUpdate;
