const Sub = require("../models/sub");
const slugify = require("slugify");
const Product = require("../models/product");

exports.list = async (req, res) => {
  const list = await Sub.find().populate("parents").sort({ createdAt: -1 }).exec();
  res.json(list);
};

exports.create = async (req, res) => {
  try {
    const { name, images, parents } = req.body;
    const sub = await new Sub({ name, images, parents, slug: slugify(name) }).save();
    res.json(sub);
  } catch (error) {
    res.status(400).send("Create sub-category failed");
  }
};
exports.read = async (req, res) => {
  let sub = await Sub.findOne({ slug: req.params.slug }).populate("parents").exec();
  //res.json(sub);

  const products = await Product.find({ brand: sub }).populate("brand").exec();
  res.json({
    sub,
    products,
  });
};

exports.update = async (req, res) => {
  const { name, images, parents } = req.body;
  try {
    const updated = await Sub.findOneAndUpdate(
      { slug: req.params.slug },
      { name, images, parents, slug: slugify(name) },
      { new: true }
    );
    res.json(updated);
  } catch (error) {
    res.status(400).send("Failed updating sub-category");
  }
};

exports.remove = async (req, res) => {
  try {
    const deleted = await Sub.findOneAndDelete({ slug: req.params.slug });
    res.json(deleted);
  } catch (error) {
    res.status(400).send("Failed deleting sub-category");
  }
};
