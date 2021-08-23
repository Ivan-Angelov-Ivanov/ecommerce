const Product = require("../models/product");
const slugify = require("slugify");
const User = require("../models/user");

exports.create = async (req, res) => {
  try {
    console.log(req.body);
    req.body.slug = slugify(req.body.title);
    const newProduct = await new Product(req.body).save();
    res.json(newProduct);
  } catch (error) {
    console.log(error);
    // res.status(400).send("Create product failed");
    res.status(400).json({
      error: error.message,
    });
  }
};

exports.listAll = async (req, res) => {
  let products = await Product.find({})
    .limit(parseInt(req.params.count))
    .populate("category")
    .populate("brand")
    .sort([["createdAt", "desc"]])
    .exec();
  res.json(products);
};

exports.remove = async (req, res) => {
  try {
    const deleted = await Product.findOneAndRemove({
      slug: req.params.slug,
    }).exec();
    res.json(deleted);
  } catch (error) {
    console.log(error);
    return res.status(400).send("Failed deleting product!");
  }
};

exports.read = async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug })
    .populate("category")
    .populate("brand")
    .exec();

  return res.json(product);
};

exports.update = async (req, res) => {
  try {
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    const updated = await Product.findOneAndUpdate(
      { slug: req.params.slug },
      req.body,
      { new: true }
    ).exec();
    res.json(updated);
  } catch (error) {
    console.log("Prouct Update Error ----->", error);
    return res.status(400).send("Product Update failed");
  }
};

// Without pagination
// exports.list = async (req, res) => {
//   try {
//     // createdAt/updatedAt, desc/asc, limit
//     const { sort, order, limit } = req.body;
//     const products = await Product.find({})
//       .populate("category")
//       .populate("subs")
//       .sort([[sort, order]])
//       .limit(limit)
//       .exec();

//     res.json(products);
//   } catch (error) {
//     console.log(error);
//   }
// };

// With pagination
exports.list = async (req, res) => {
  try {
    // createdAt/updatedAt, desc/asc, limit
    const { sort, order, page } = req.body;
    const currentPage = page || 1;
    const perPage = 3;

    const products = await Product.find({})
      .skip((currentPage - 1) * perPage)
      .populate("category")
      .populate("brand")
      .sort([[sort, order]])
      .limit(perPage)
      .exec();

    res.json(products);
  } catch (error) {
    console.log(error);
  }
};

exports.productsCount = async (req, res) => {
  let total = await Product.find({}).estimatedDocumentCount().exec();
  res.json(total);
};

exports.productStar = async (req, res) => {
  const product = await Product.findById(req.params.productId).exec();
  const user = await User.findOne({ email: req.user.email }).exec();
  const { star } = req.body;

  // who is updating?
  // check if currently logged in user have already added rating to this product?
  let existingRatingObject = product.ratings.find(
    (element) => element.postedBy.toString() === user._id.toString()
  );

  if (existingRatingObject === undefined) {
    // if user havent left rating yet, push it
    let ratingAdded = await Product.findByIdAndUpdate(
      product._id,
      {
        $push: {
          ratings: {
            star: star,
            postedBy: user._id,
          },
        },
      },
      { new: true }
    ).exec();
    console.log(ratingAdded);
    res.json(ratingAdded);
  } else {
    // if use have already left rating, update it
    const ratingUpdated = await Product.updateOne(
      {
        ratings: { $elemMatch: existingRatingObject },
      },
      { $set: { "ratings.$.star": star } },
      { new: true }
    ).exec();
    console.log("Rating Updated", ratingUpdated);
    res.json(ratingUpdated);
  }
};

exports.listRelated = async (req, res) => {
  const product = await Product.findById(req.params.productId).exec();

  const related = await Product.find({
    _id: { $ne: product._id },
    category: product.category,
  })
    .limit(3)
    .populate("category")
    .populate("brand")
    .populate("postedBy")
    .exec();

  res.json(related);
};

// SEARCH / FILTER
const handleQuery = async (req, res, query) => {
  const products = await Product.find({ $text: { $search: query } })
    .populate("category", "_id name")
    .populate("brand", "_id name")
    .populate("postedBy", "_id name")
    .limit(12)
    .exec();

  res.json(products);
};

// filter by price
const handlePrice = async (req, res, price) => {
  try {
    let products = await Product.find({
      price: {
        $gte: price[0],
        $lte: price[1],
      },
    })
      .populate("category", "_id name")
      .populate("brand", "_id name")
      .populate("postedBy", "_id name")
      .limit(12)
      .exec();

    res.json(products);
  } catch (error) {
    console.log(error);
  }
};

// filter by category
const handleCategory = async (req, res, category) => {
  try {
    let products = await Product.find({ category })
      .populate("category", "_id name")
      .populate("brand", "_id name")
      .populate("postedBy", "_id name")
      .limit(12)
      .exec();

    res.json(products);
  } catch (error) {
    console.log(error);
  }
};

// filter by rating
const handleStar = (req, res, stars) => {
  Product.aggregate([
    {
      $project: {
        document: "$$ROOT",
        floorAverage: {
          $floor: {
            $avg: "$ratings.star",
          },
        },
      },
    },
    { $match: { floorAverage: stars } },
  ])
    .limit(12)
    .exec((error, aggregates) => {
      if (error) console.log("Aggregates error", error);
      Product.find({ _id: aggregates })
        .populate("category", "_id name")
        .populate("brand", "_id name")
        .populate("postedBy", "_id name")
        .limit(12)
        .exec((error, products) => {
          if (error) console.log("Product aggregates error", error);
          res.json(products);
        });
    });
};


// filter by shipping
const handleShipping = async (req, res, shipping) => {
  const products = await Product.find({ shipping })
    .populate("category", "_id name")
    .populate("brand", "_id name")
    .populate("postedBy", "_id name")
    .limit(12)
    .exec();

  res.json(products);
};

// filter by color
const handleColor = async (req, res, color) => {
  const products = await Product.find({ color })
    .populate("category", "_id name")
    .populate("brand", "_id name")
    .populate("postedBy", "_id name")
    .limit(12)
    .exec();

  res.json(products);};

// filter by brand
const handleBrand = async (req, res, brand) => {
  const products = await Product.find({ brand })
    .populate("category", "_id name")
    .populate("brand", "_id name")
    .populate("postedBy", "_id name")
    .limit(12)
    .exec();

  res.json(products);};

exports.searchFilters = async (req, res) => {
  const {
    query,
    price,
    category,
    stars,
    shipping,
    color,
    brand,
  } = req.body;

  if (query) {
    console.log("Query", query);
    await handleQuery(req, res, query);
  }

  if (price !== undefined) {
    console.log("Price ==>", price);
    await handlePrice(req, res, price);
  }

  if (category) {
    console.log("Category --->", category);
    await handleCategory(req, res, category);
  }

  if (stars) {
    console.log("Stars --->", stars);
    await handleStar(req, res, stars);
  }

  if (shipping) {
    console.log("Shipping--->", shipping);
    await handleShipping(req, res, shipping);
  }

  if (color) {
    console.log("Color--->", color);
    await handleColor(req, res, color);
  }

  if (brand) {
    console.log("Brand--->", brand);
    await handleBrand(req, res, brand);
  }
};
