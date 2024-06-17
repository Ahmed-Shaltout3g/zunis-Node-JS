import { Router } from "express";
import * as allRoutes from "./auth.controller.js";
import { asyncHandler } from "../../utils/errorHandling.js";
import { validation } from "../../middleware/validation.js";
import * as validations from "./auth.validation.js";

const router = Router();
router.post(
  "/signup",
  validation(validations.signUpVaildation),
  asyncHandler(allRoutes.signUp)
);

router.post(
  "/signin",
  validation(validations.signInVaildation),
  asyncHandler(allRoutes.login)
);
router.get("/confirmEmail/:token", asyncHandler(allRoutes.confirmEmail));
router.get("/forget", asyncHandler(allRoutes.forgetPass));

router.post("/resetpassword/:token", asyncHandler(allRoutes.resetPassword));
router.post(
  "/adminAddUser",
  validation(validations.signUpVaildation),
  asyncHandler(allRoutes.AdminAddUser)
);
export default router;
