import { Router } from "express";
const router = Router();
import * as CategoryController from "./category.controller.js";
import { asyncHandler } from "../../utils/errorHandling.js";
import { myMulter } from "../../services/multer.js";
import allowedExtensions from "../../utils/allowedExtention.js";
import * as validations from "./category.validation.js";
import { validation } from "../../middleware/validation.js";

router.post(
  "/create",

  myMulter().single("image"),

  asyncHandler(CategoryController.createCategory)
);

router.put(
  "/update",

  myMulter(allowedExtensions.Image).single("image"),

  asyncHandler(CategoryController.updateCategory)
);
router.delete("/delete", asyncHandler(CategoryController.deleteCategory));
router.get("/", asyncHandler(CategoryController.getAllCategory));

export default router;
