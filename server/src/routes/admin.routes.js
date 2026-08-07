import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/authorize.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import {
  createUserSchema,
  createStoreSchema,
  updateUserSchema,
  updateStoreSchema,
} from "../validators/admin.validation.js";
import * as adminController from "../controllers/admin.controller.js";

const router = Router();

// Protect all admin routes
router.use(authMiddleware);
router.use(authorize("ADMIN"));

// Dashboard
router.get("/dashboard", adminController.getDashboard);

// Users CRUD
router
  .route("/users")
  .get(adminController.getUsers)
  .post(validate(createUserSchema), adminController.createUser);

router
  .route("/users/:id")
  .get(adminController.getUser)
  .put(validate(updateUserSchema), adminController.updateUser)
  .delete(adminController.deleteUser);

// Stores CRUD
router
  .route("/stores")
  .get(adminController.getStores)
  .post(validate(createStoreSchema), adminController.createStore);

router
  .route("/stores/:id")
  .get(adminController.getStore)
  .put(validate(updateStoreSchema), adminController.updateStore)
  .delete(adminController.deleteStore);

export default router;
