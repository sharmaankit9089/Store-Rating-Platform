
import express from "express";
import { listStores, getStore, submitRating, updateRating } from "../controllers/user.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/authorize.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { ratingSchema } from "../validators/user.validation.js";

const router = express.Router();

router.use(authMiddleware, authorize("USER"));

router.get("/stores", listStores);
router.get("/stores/:id", getStore);
router.post("/ratings", validate(ratingSchema), submitRating);
router.put("/ratings/:storeId", validate(ratingSchema), updateRating);

export default router;
