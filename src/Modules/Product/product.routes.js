import { Router } from "express";
import * as allRoutes from "./product.controller.js";
import { asyncHandler } from "../../utils/errorHandling.js";
import { validation } from "../../middleware/validation.js";
import { myMulter } from "../../services/multer.js";
// import { Auth, authorization } from "../../middlewares/Auth.js";
// import { systemRoles } from "../../utils/systemRoles.js";
// import * as validations from "./product.validation.js";

const router = Router();
router.post(
  "/create",

  myMulter({}).array("image", 10),
  asyncHandler(allRoutes.createProduct)
);
router.put(
  "/update",

  myMulter({}).array("image", 10),
  asyncHandler(allRoutes.updateproduct)
);
router.delete(
  "/delete",

  asyncHandler(allRoutes.deleteProduct)
);

router.get("/", asyncHandler(allRoutes.getAllProducts));
router.get("/:categoryName", asyncHandler(allRoutes.getProductsByCategory));
router.get(
  "/:categoryName/:productId",

  asyncHandler(allRoutes.getProductDetails)
);

export default router;
