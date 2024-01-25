import cloudinary from "../../utils/cloudinaryConfigration.js";
import productModel from "./../../../DB/Models/product.model.js";
// import commentModel from "./../../../DB/model/comment.model.js";
// import userModel from "../../../DB/model/user.model.js";
// import { pagination } from "../../services/pagination.js";
import { categoryModel } from "../../../DB/Models/category.model.js";
import slugify from "slugify";
import { nanoid } from "nanoid";

// =================create product=================

export const createProduct = async (req, res, next) => {
  const { title, caption, price, size, weight, discount } = req.body;
  const { categoryId } = req.query;
  const category = await categoryModel.findById(categoryId);
  if (!category) {
    return next(new Error("invalid category id ", { cause: 404 }));
  }
  const slug = slugify(title, {
    replacement: "_",
    lower: true,
    trim: true,
  });

  const priceAfterDiscount = price * (1 - (discount || 0) / 100);

  if (!req.files.length) {
    return next(new Error("please upload product images", { cause: 400 }));
  }

  const customId = nanoid(5); //random id

  let imagesArr = [];
  let publicIdsArr = [];
  for (const file of req.files) {
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      file.path,
      {
        folder: `${process.env.ECOMMERCE_FOLDER}/Categories/${category.customId}/products/${customId}`,
      }
    );
    imagesArr.push({ secure_url, public_id });
    publicIdsArr.push(public_id);
  }

  const productObject = {
    title,
    caption,
    slug,
    size,
    customId,
    weight,
    price,
    discount,
    priceAfterDiscount,
    Images: imagesArr,
    categoryId,
  };

  const createProduct = await productModel.create(productObject);
  if (!createProduct) {
    await cloudinary.api.delete_resources_by_prefix(
      `${process.env.ECOMMERCE_FOLDER}/Categories/${category.customId}/products/${customId}` ///delete folder  'api.delete'
    ); //delete the image
    await cloudinary.api.delete_folder(
      `${process.env.ECOMMERCE_FOLDER}/Categories/${category.customId}/products/${customId}` ///delete folder  'api.delete'
    );
    return next(new Error("fail", { cause: 400 }));
  }
  res.status(201).json({
    message: " created successfuly",
    products: createProduct,
  });
};

// ============================update product ====================

export const updateproduct = async (req, res, next) => {
  const { title, caption, price, size, weight, discount } = req.body;
  const { productId, categoryId } = req.query;
  const category = await categoryModel.findById(categoryId);
  if (!category) {
    return next(new Error("invalid category id ", { cause: 404 }));
  }
  const product = await productModel.findById(productId);
  if (!product) {
    return next(new Error("invalid product id ", { cause: 404 }));
  }

  if (title) {
    const slug = slugify(title, {
      replacement: "_",
      lower: true,
      trim: true,
    });
    product.title = title;
    product.slug = slug;
  }

  // ================  change price ==================

  if (discount && price) {
    const priceAfterDiscount = price * (1 - (discount || 0) / 100);
    product.price = price;
    product.priceAfterDiscount = priceAfterDiscount;
    product.discount = discount;
  } else if (price) {
    const priceAfterDiscount = price * (1 - (product.discount || 0) / 100);
    product.price = price;
    product.priceAfterDiscount = priceAfterDiscount;
  } else if (discount) {
    const priceAfterDiscount = product.price * (1 - (discount || 0) / 100);

    product.priceAfterDiscount = priceAfterDiscount;
    product.discount = discount;
  }

  //   =============change image==============

  if (req.files?.length) {
    //if need to change image for category
    // add new image
    let imagesArr = [];
    // let publicIdsArr = [];
    for (const file of req.files) {
      const { secure_url, public_id } = await cloudinary.uploader.upload(
        file.path,
        {
          folder: `${process.env.ECOMMERCE_FOLDER}/Categories/${category.customId}/products/${product.customId}`,
        }
      );
      imagesArr.push({ secure_url, public_id });
      // publicIdsArr.push(public_id);
    }

    // delete images in host
    let publicIdsArr = [];
    for (const image of product.Images) {
      publicIdsArr.push(image.public_id);
    }
    await cloudinary.api.delete_resources(publicIdsArr);

    product.Images = imagesArr;
  }

  if (caption) product.caption = caption;
  if (size) product.size = size;
  if (weight) product.weight = weight;
  // save all changes
  await product.save();

  res.status(200).json({
    message: "product update successfuly",
    product,
  });
};

// ======================delete product ==================

export const deleteProduct = async (req, res, next) => {
  const { productId, categoryId } = req.query;
  const category = await categoryModel.findById(categoryId);
  if (!category) {
    return next(new Error("invalid category id ", { cause: 404 }));
  }

  const product = await productModel.findByIdAndDelete(productId);
  if (!product) {
    return next(new Error("invalid category id ", { cause: 404 }));
  }

  // ===delete from host ===
  await cloudinary.api.delete_resources_by_prefix(
    `${process.env.ECOMMERCE_FOLDER}/Categories/${category.customId}/products/${product.customId}`
  );
  await cloudinary.api.delete_folder(
    `${process.env.ECOMMERCE_FOLDER}/Categories/${category.customId}/products/${product.customId}`
  );

  res.status(200).json({
    message: "product deleted successfuly",
  });
};

// ===================get All product==============

export const getAllProducts = async (req, res, next) => {
  const products = await productModel.find();

  if (products.length) {
    return res.status(200).json({
      message: "Done",
      products,
    });
  }
  res.status(200).json({
    message: "No Items yet",
  });
};

// ===================get  product by category name==============

export const getProductsByCategory = async (req, res, next) => {
  const { categoryName } = req.params;
  const category = await categoryModel.findOne({
    slug: categoryName.toLowerCase(),
  });
  if (!category) {
    return next(new Error("invalid category Name ", { cause: 404 }));
  }

  const products = await productModel.aggregate([
    {
      $match: { categoryId: category._id },
    },
  ]);

  if (products.length) {
    return res.status(200).json({
      message: "Done",
      products,
    });
  }
  res.status(200).json({
    message: "Invalid",
  });
};

// ====================get product details==============
export const getProductDetails = async (req, res, next) => {
  const { categoryName, productId } = req.params;
  const category = await categoryModel.findOne({
    slug: categoryName.toLowerCase(),
  });
  if (!category) {
    return next(new Error("invalid category Name ", { cause: 404 }));
  }
  const product = await productModel.findById(productId);
  if (!product) {
    return next(new Error("invalid product id ", { cause: 404 }));
  }

  const products = await productModel.findOne({
    $and: [{ categoryId: category._id }, { _id: productId }],
  });
  if (products) {
    return res.status(200).json({
      message: "Done",
      products,
    });
  }
  res.status(200).json({
    message: "invalid",
  });
};
