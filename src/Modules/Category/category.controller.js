import { nanoid } from "nanoid";
import { categoryModel } from "../../../DB/Models/category.model.js";
import cloudinary from "../../utils/cloudinaryConfigration.js";
import slugify from "slugify";
import productModel from "../../../DB/Models/product.model.js";

// =============================craete category======================
export const createCategory = async (req, res, next) => {
  const { name } = req.body;
  const isNameDublicated = await categoryModel.findOne({ name });
  if (isNameDublicated) {
    return next(new Error("category name is duplicated", { cause: 404 }));
  }
  const slug = slugify(name, "_"); // slug the name
  if (!req.file) {
    return next(new Error("please upload your picture", { cause: 400 }));
  }
  const customId = nanoid(5); //random id
  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.file.path,
    {
      folder: `${process.env.ECOMMERCE_FOLDER}/Categories/${customId}`,
    }
  );

  const categoryObject = {
    name,
    slug,
    image: {
      secure_url,
      public_id,
    },
    customId,
  };
  const createCtegory = await categoryModel.create(categoryObject);
  if (!createCategory) {
    await cloudinary.uploader.destroy(public_id); //delete the image
    await cloudinary.api.delete_folder(
      `${process.env.ECOMMERCE_FOLDER}/Categories/${customId}` ///delete folder  'api.delete'
    );
    return next(new Error("fail", { cause: 400 }));
  }
  res.status(201).json({
    message: "category created successfuly",
    category: createCategory,
  });
};

// ========================update category============================

export const updateCategory = async (req, res, next) => {
  const { categoryId } = req.query;
  const category = await categoryModel.findById(categoryId);
  if (!category) {
    return next(new Error("invalid category id ", { cause: 404 }));
  }

  // ======================  change name =======================
  const { name } = req.body;

  if (name) {
    // new category name not same old name
    if (name.toLowerCase() == category.name) {
      return next(
        new Error("new name same old name please enter anothe name ", {
          cause: 404,
        })
      );
    }

    // new name not dublicated

    const isDublicated = await categoryModel.findOne({ name });
    if (isDublicated) {
      return next(new Error("category name is duplicated", { cause: 404 }));
    }

    const slug = slugify(name);
    category.name = name;
    category.slug = slug;
  }

  //   ==========================change image====================

  if (req.file) {
    //if need to change image for category
    // add new image
    const { secure_url, public_id } = await cloudinary.uploader.upload(
      req.file.path,
      {
        folder: `${process.env.ECOMMERCE_FOLDER}/Categories/${category.customId}`,
      }
    );
    // delete old image===
    await cloudinary.uploader.destroy(category.image.public_id);
    //add new url  in DB
    category.image = { secure_url, public_id };
  }
  // save all changes
  await category.save();

  res.status(200).json({
    message: "category update successfuly",
    category,
  });
};

// ====================delete category=================
export const deleteCategory = async (req, res, next) => {
  const { categoryId } = req.query;
  const category = await categoryModel.findByIdAndDelete(categoryId);
  if (!category) {
    return next(new Error("invalid category id ", { cause: 404 }));
  }

  // === delete in DB ===
  // TODO delete subcategory link with this category
  const deleteproduct = await productModel.deleteMany({ categoryId });
  if (!deleteproduct.deletedCount) {
    return next(new Error("fail please try again", { cause: 500 }));
  }

  // ===delete from host ===
  await cloudinary.api.delete_resources_by_prefix(
    `${process.env.ECOMMERCE_FOLDER}/Categories/${category.customId}`
  );
  await cloudinary.api.delete_folder(
    `${process.env.ECOMMERCE_FOLDER}/Categories/${category.customId}`
  );

  res.status(200).json({
    message: "category delete successfuly",
  });
};

// ============== get all categories ===============
export const getAllCategory = async (req, res, next) => {
  const categories = await categoryModel.find().populate({
    path: "products",
    select: "title _id",
  });

  if (categories.length) {
    return res.status(200).json({
      message: "Done",
      categories,
    });
  }
  res.status(200).json({
    message: "No Items",
  });
};
