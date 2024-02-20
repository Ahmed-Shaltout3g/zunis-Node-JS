import { Router } from "express";
const router = Router();
import * as CategoryController from "./category.controller.js";
import { asyncHandler } from "../../utils/errorHandling.js";
import { myMulter } from "../../services/multer.js";
import allowedExtensions from "../../utils/allowedExtention.js";
import * as validations from "./category.validation.js";
import { validation } from "../../middleware/validation.js";
import { Auth, authorization } from "../../middleware/auth.js";
import { systemRoles } from "../../utils/systemRoles.js";

router.post(
  "/create",
  Auth(),
  authorization([systemRoles.ADMIN, systemRoles.USER]),
  myMulter().single("image"),
  validation(validations.createCategoryVaildation),
  asyncHandler(CategoryController.createCategory)
);

router.put(
  "/update",
  Auth(),
  authorization([systemRoles.ADMIN, systemRoles.USER]),
  myMulter(allowedExtensions.Image).single("image"),

  asyncHandler(CategoryController.updateCategory)
);
router.delete(
  "/delete",
  Auth(),
  authorization([systemRoles.ADMIN, systemRoles.USER]),
  asyncHandler(CategoryController.deleteCategory)
);
router.get("/", asyncHandler(CategoryController.getAllCategory));

export default router;
