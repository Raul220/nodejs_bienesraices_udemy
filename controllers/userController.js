import User from "../models/User.js";

const loginForm = (req, res) => {
  res.render("auth/login", {
    page: "Iniciar sesión",
  });
};

const registryForm = (req, res) => {
  res.render("auth/registry", {
    page: "Crear cuenta",
  });
};

const registry = async (req, res) => {
  const user = await User.create(req.body);
  res.json(user);
};

const forgotPasswordForm = (req, res) => {
  res.render("auth/forgot-password", {
    page: "Recuperar contraseña",
  });
};

export { loginForm, registryForm, registry, forgotPasswordForm };
