import cloudinary from "../../utils/cloudinaryConfigration.js";
import productModel from "./../../../DB/Models/product.model.js";

import { categoryModel } from "../../../DB/Models/category.model.js";
import slugify from "slugify";
import { nanoid } from "nanoid";
import { ApiFeature } from "../../utils/apiFeature.js";

// =================create product=================

export const createProduct = async (req, res, next) => {
  const { _id } = req.user;
  const {
    title,
    section,
    location,
    youtubeURL,
    descLocation,
    rentDeatils,
    propertyDesc,
    PaymentMethod,
    caption,
    price,
  } = req.body;
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
  req.ImagePath = `${process.env.ECOMMERCE_FOLDER}/Categories/${category.customId}/products/${customId}`;
  const productObject = {
    title,
    section,
    slug,
    location,
    youtubeURL,
    descLocation,
    rentDeatils,
    propertyDesc,
    PaymentMethod,
    caption,
    price,
    Images: imagesArr,
    createdBy: _id,
    categoryId,
  };

  const createProduct = await productModel.create(productObject);
  req.failedDocument = { model: productModel, _id: createProduct._id };

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
  const { _id } = req.user;
  const {
    title,
    section,
    location,
    youtubeURL,
    descLocation,
    rentDeatils,
    propertyDesc,
    status,
    caption,
    price,
  } = req.body;
  const { productId } = req.query;

  const product = await productModel.findById(productId);
  if (!product) {
    return next(new Error("invalid product id ", { cause: 404 }));
  }
  const category = await categoryModel.findById(product?.categoryId);
  if (!category) {
    return next(new Error("invalid category id ", { cause: 404 }));
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
  if (section) product.section = section;
  if (location) product.location = location;
  if (youtubeURL) product.youtubeURL = youtubeURL;
  if (descLocation) product.descLocation = descLocation;
  if (rentDeatils) product.rentDeatils = rentDeatils;
  if (propertyDesc) product.propertyDesc = propertyDesc;
  if (status) product.status = status;
  if (caption) product.caption = caption;
  if (price) product.price = price;
  product.updatedBy = _id;

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

  // save all changes
  await product.save();

  res.status(200).json({
    message: "product update successfuly",
    product,
  });
};

// ======================delete product ==================

export const deleteProduct = async (req, res, next) => {
  const { productId } = req.query;
  const product = await productModel.findOneAndDelete({
    _id: productId,
  });

  if (!product) {
    return next(new Error("invalid product id ", { cause: 404 }));
  }
  const category = await categoryModel.findById(product.categoryId);
  if (!category) {
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
  console.log(product);
};

// =========================accept product====================
export const acceptProduct = async (req, res, next) => {
  const { _id } = req.user;
  const { productId } = req.query;
  const product = await productModel.findOneAndUpdate(
    { _id: productId, isAccepted: false },
    {
      isAccepted: true,
    },
    {
      new: true,
    }
  );
  if (!product) {
    return next(
      new Error("invalid product  id OR it already accepted ", { cause: 404 })
    );
  }
  return res.status(200).json({
    message: "Done",
    product,
  });
};

// ===================get All product==============

export const getAllProducts = async (req, res, next) => {
  const apiFeaturesInistant = new ApiFeature(productModel.find(), req.query)
    .paginated()
    .sort()
    .select()
    .filters()
    .search();

  const products = await apiFeaturesInistant.mongooseQuery
    .populate({
      path: "createdBy",
      select: "email phoneNumber",
    })
    .populate({
      path: "categoryId",
      select: "name slug ",
    });
  const paginationInfo = await apiFeaturesInistant.paginationInfo;
  const all = await productModel.find().count();
  const totalPages = Math.ceil(all / paginationInfo.perPages);
  paginationInfo.totalPages = totalPages;
  if (products.length) {
    return res.status(200).json({
      message: "Done",
      data: products,
      paginationInfo,
    });
  }
  res.status(200).json({
    message: "No Items yet",
  });
};
// ===================get  product by category name==============

export const getProductsByCategory = async (req, res, next) => {
  const { categoryName } = req.params;
  const category = await categoryModel.findOne({ slug: categoryName });
  if (!category) {
    return next(new Error("invalid category name ", { cause: 404 }));
  }
  const apiFeaturesInistant = new ApiFeature(
    productModel.find({ categoryId: category._id }),
    req.query
  )
    .paginated()
    .sort()
    .select()
    .filters()
    .search();

  const products = await apiFeaturesInistant.mongooseQuery
    .populate({
      path: "createdBy",
      select: "email phoneNumber",
    })
    .populate({
      path: "categoryId",
      select: "name slug ",
    });
  const paginationInfo = await apiFeaturesInistant.paginationInfo;
  const all = await productModel.find().count();
  const totalPages = Math.ceil(all / paginationInfo.perPages);
  paginationInfo.totalPages = totalPages;
  if (products.length) {
    return res.status(200).json({
      message: "Done",
      data: products,
      paginationInfo,
    });
  }
  res.status(200).json({
    message: "No Items yet",
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

  const products = await productModel
    .findOne({
      $and: [{ categoryId: category._id }, { _id: productId }],
    })
    .populate({
      path: "categoryId",
      select: "name slug ",
    })
    .populate({
      path: "createdBy",
      select: "phoneNumber email ",
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
