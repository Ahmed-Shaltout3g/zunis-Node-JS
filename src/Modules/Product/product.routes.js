import { Router } from "express";
import * as allRoutes from "./product.controller.js";
import { asyncHandler } from "../../utils/errorHandling.js";
import { validation } from "../../middleware/validation.js";
import { myMulter } from "../../services/multer.js";
import { Auth, authorization } from "../../middleware/auth.js";
import { systemRoles } from "../../utils/systemRoles.js";
import * as validations from "./product.validation.js";

const router = Router();
router.post(
  "/create",
  Auth(),
  myMulter({}).array("image", 10),
  validation(validations.createProductVaildation),
  asyncHandler(allRoutes.createProduct)
);
router.put(
  "/update",
  Auth(),
  myMulter({}).array("image", 10),
  validation(validations.updateProductVaildation),

  asyncHandler(allRoutes.updateproduct)
);

router.put(
  "/accept",
  Auth(),
  authorization([systemRoles.ADMIN, systemRoles.SUPER_ADMIN]),
  asyncHandler(allRoutes.acceptProduct)
);

router.delete("/delete", Auth(), asyncHandler(allRoutes.deleteProduct));

router.get("/", asyncHandler(allRoutes.getAllProducts));
router.get("/:categoryName", asyncHandler(allRoutes.getProductsByCategory));
router.get(
  "/:categoryName/:productId",

  asyncHandler(allRoutes.getProductDetails)
);

export default router;
