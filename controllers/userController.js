import { check, validationResult } from "express-validator";
import User from "../models/User.js";

const loginForm = (req, res) => {
  res.render("auth/login", {
    page: "Iniciar sesión",
  });
};

const registryForm = async (req, res) => {
  res.render("auth/registry", {
    page: "Crear cuenta",
  });
};

const registry = async (req, res) => {
  await check("name")
    .notEmpty()
    .withMessage("El nombre no puede estar vacío.")
    .run(req);
  await check("email").isEmail().withMessage("Correo no valido.").run(req);
  await check("password")
    .isLength({ min: 6 })
    .withMessage("El password debe tener al menos 6 caracteres.")
    .run(req);
  if (req.body["confirm_password"] !== req.body["password"]) {
    await check("confirm_password")
      .equals("password")
      .withMessage("Las contraseñas no son iguales")
      .run(req);
  }

  let result = validationResult(req);

  if (!result.isEmpty()) {
    return res.render("auth/registry", {
      page: "Crear cuenta",
      errors: result.array(),
      user: {
        name: req.body.name,
        email: req.body.email,
      },
    });
  }

  const user = await User.create(req.body);
  res.json(user);
};

const forgotPasswordForm = (req, res) => {
  res.render("auth/forgot-password", {
    page: "Recuperar contraseña",
  });
};

export { loginForm, registryForm, registry, forgotPasswordForm };
