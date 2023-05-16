import express from "express";
import {
  forgotPasswordForm,
  loginForm,
  registryForm,
  registry,
  confirm,
  resetPassword,
  checkToken,
  newPassword,
} from "../controllers/userController.js";

const router = express.Router();

router.get("/login", loginForm);

router.get("/registry", registryForm);
router.post("/registry", registry);

router.get("/confirm/:token", confirm);

router.get("/forgot-password", forgotPasswordForm);
router.post("/forgot-password", resetPassword);

//Almacenar ekl nuevo password
router.get("/forgot-password/:token", checkToken);
router.post("/forgot-password/:token", newPassword);

export default router;
