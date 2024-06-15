import { Router } from "express";
import * as allRoutes from "./message.controllar.js";
import { asyncHandler } from "../../utils/errorHandling.js";

const router = Router();
router.post("/messageToAdmin", asyncHandler(allRoutes.sendMessageToAdmin));
router.post("/messageToUser", asyncHandler(allRoutes.addMessageToUser));
router.get("/messageUser/:id", asyncHandler(allRoutes.getAllMessagesToUser));
router.get("/messageAdmin", asyncHandler(allRoutes.getAllMessagesToAdmin));

export default router;
