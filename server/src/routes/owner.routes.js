import express from "express";
import { dashboard, getStore, getRatings } from "../controllers/owner.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/authorize.middleware.js";

const router = express.Router();

router.use(authMiddleware, authorize("OWNER"));

router.get("/dashboard", dashboard);
router.get("/store", getStore);
router.get("/ratings", getRatings);

export default router;
