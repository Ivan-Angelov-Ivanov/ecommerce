const Category = require("../models/category");
const Sub = require("../models/sub");
const slugify = require("slugify");
const Product = require("../models/product");

exports.list = async (req, res) => {
  const list = await Category.find().sort({ createdAt: -1 }).exec();
  res.json(list);
};

exports.create = async (req, res) => {
  try {
    const { name } = req.body;
    const category = await new Category({ name, slug: slugify(name) }).save();
    res.json(category);
  } catch (error) {
    console.log(error);
    res.status(400).send("Create category failed");
  }
};
exports.read = async (req, res) => {
  let category = await Category.findOne({ slug: req.params.slug }).exec();
  // res.json(category);
  const products = await Product.find({ category })
    .populate("category")
    .exec();
    res.json({
      category,
      products
    })
};

exports.update = async (req, res) => {
  const { name } = req.body;
  try {
    const updated = await Category.findOneAndUpdate(
      { slug: req.params.slug },
      { name, slug: slugify(name) },
      { new: true }
    );
    res.json(updated);
  } catch (error) {
    res.status(400).send("Failed updating category");
  }
};

exports.remove = async (req, res) => {
  try {
    const deleted = await Category.findOneAndDelete({ slug: req.params.slug });
    res.json(deleted);
  } catch (error) {
    res.status(400).send("Failed deleting category");
  }
};

exports.getSubs = (req, res) => {
  Sub.find({ parents: req.params._id }).exec((error, subs) => {
    if (error) console.log(error);
    res.json(subs);
  });
};
