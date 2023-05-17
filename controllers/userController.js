import { check, validationResult } from "express-validator";
import bcrypt from "bcrypt";
import User from "../models/User.js";
import { genarateId } from "../helpers/token.js";
import { registryEmail, forgotPasswordEmail } from "../helpers/emails.js";

/**
 * Renderiza la vista de login
 * @param {*} req peticion
 * @param {*} res respuesta
 */
const loginForm = (req, res) => {
  res.render("auth/login", {
    page: "Iniciar sesión",
    csrfToken: req.csrfToken(),
  });
};

/**
 * Inicia sesion de usuariio
 * @param {*} req peticion
 * @param {*} res respuesta
 * @returns 
 */
const authenticate = async (req, res) => {
  //Validacion
  await check("email").isEmail().withMessage("Correo no valido.").run(req);
  await check("password")
    .notEmpty()
    .withMessage("La contraseña es obligatoria.")
    .run(req);

  //Verificar que no hay errores en el form
  let result = validationResult(req);

  if (!result.isEmpty()) {
    // console.log(result)
    return res.render("auth/login", {
      page: "Iniciar sesión",
      errors: result.array(),
      csrfToken: req.csrfToken(),
    });
  }

  const { email, password } = req.body;
  //Verificar si el usuario existe
  const user = await User.findOne({ where: { email } })
  if (!user) {
    return res.render("auth/login", {
      page: "Iniciar sesión",
      errors: [{msg: "No existe ningun usuario con ese correo"}],
      csrfToken: req.csrfToken(),
    });
  }

  //Verificar si el usuario esta confirmado
  if(!user.confirmed) {
    return res.render("auth/login", {
      page: "Iniciar sesión",
      errors: [{msg: "Tu cuenta no ha sido confirmada"}],
      csrfToken: req.csrfToken(),
    });
  }

}

/**
 * Renderiza la pagina de registro
 * @param {*} req peticion
 * @param {*} res respuesta
 */
const registryForm = async (req, res) => {
  res.render("auth/registry", {
    page: "Crear cuenta",
    csrfToken: req.csrfToken(),
  });
};

/**
 * Registra un nuevo usuariio
 * @param {*} req peticion
 * @param {*} res respuesta
 * @returns pagina de error o login
 */
const registry = async (req, res) => {
  const { name, email, password, confirm_password } = req.body;

  await check("name")
    .notEmpty()
    .withMessage("El nombre no puede estar vacío.")
    .run(req);
  await check("email").isEmail().withMessage("Correo no valido.").run(req);
  await check("password")
    .isLength({ min: 6 })
    .withMessage("La contraseña debe tener al menos 6 caracteres.")
    .run(req);
  if (confirm_password !== password) {
    await check("confirm_password")
      .equals("password")
      .withMessage("Las contraseñas no son iguales")
      .run(req);
  }

  let result = validationResult(req);

  if (!result.isEmpty()) {
    // console.log(result)
    return res.render("auth/registry", {
      page: "Crear cuenta",
      errors: result.array(),
      csrfToken: req.csrfToken(),
      user: {
        name: name,
        email: email,
      },
    });
  }

  //Verificar si el usuario ya existe
  const exist = await User.findOne({ where: { email } });

  if (exist) {
    return res.render("auth/registry", {
      page: "Crear cuenta",
      csrfToken: req.csrfToken(),
      errors: [{ msg: "Ya existe un usuario con ese correo." }],
      user: {
        name: name,
      },
    });
  }

  const user = await User.create({
    name,
    email,
    password,
    token: genarateId(),
  });

  // Envia mail de confirmacion
  registryEmail({
    name: user.name,
    email: user.email,
    token: user.token,
  });

  // res.json(user);

  res.render("templates/message", {
    page: "Cuenta creada correctamente",
    message: "Le hemos enviado un correo de confirmación, preciona el enlace.",
  });
};

/**
 * Coprobar una cuenta
 */
const confirm = async (req, res, next) => {
  const { token } = req.params;

  //Verificar si el token es valido
  const user = await User.findOne({ where: { token } });

  if (!user) {
    return res.render("auth/confirm-account", {
      page: "Error al confirmar tu cuenta",
      message: "Hubo un error al confirmar tu cuenta, intenta de nuevo.",
      error: true,
    });
  }

  //Confirmar cuenta
  user.token = null;
  user.confirmed = true;
  await user.save();

  return res.render("auth/confirm-account", {
    page: "Cuenta confirmada",
    message: "La cuenta ha sido confirmada correctamente.",
  });
};

/**
 * Renderiza la vista de recuperacion de contraseña
 * @param {*} req peticion
 * @param {*} res respuesta
 */

const forgotPasswordForm = (req, res) => {
  res.render("auth/forgot-password", {
    page: "Recuperar contraseña",
    csrfToken: req.csrfToken(),
  });
};

/**
 * Cambia la contraseña del usuario
 * @param {*} req peticion
 * @param {*} res respuesta
 * @returns 
 */
const resetPassword = async (req, res) => {
  await check("email").isEmail().withMessage("Correo no valido.").run(req);

  let result = validationResult(req);

  if (!result.isEmpty()) {
    // console.log(result)
    return res.render("auth/forgot-password", {
      page: "Recuperar contraseña",
      csrfToken: req.csrfToken(),
      errors: result.array(),
    });
  }

  //Buscar usuario
  const { email } = req.body;

  const user = await User.findOne({ where: { email } });

  // console.log(user)

  if (!user) {
    return res.render("auth/forgot-password", {
      page: "Recuperar contraseña",
      csrfToken: req.csrfToken(),
      errors: [{ msg: "El correo no pertenece a ningún usuario" }],
    });
  }

  //Generar un token
  user.token = genarateId();
  await user.save();

  //Enviar el email
  forgotPasswordEmail({
    email: user.email,
    name: user.name,
    token: user.token,
  });

  //Mostrar mensaje de confirmacion
  res.render("templates/message", {
    page: "Reestablecer contraseña",
    message:
      "Le hemos enviado un correo con las instrucciones para reestablecer su contraseña",
  });
};

/**
 * Verifica si el token es correcto
 * @param {*} req peticion
 * @param {*} res respuesta
 * @returns 
 */
const checkToken = async (req, res) => {
  const { token } = req.params;

  const user = await User.findOne({ where: { token } });
  // console.log(user);

  if (!user) {
    return res.render("auth/confirm-account", {
      page: "Reestablecer contraseña",
      message: "Hubo un error al validar tu información.",
      error: true,
    });
  }

  //Mostrar formulario
  res.render("auth/reset-password", {
    page: "Reestablecer contraseña",
    csrfToken: req.csrfToken(),
  });
};

/**
 * Guarda el nuevo pass
 * @param {*} req peticion
 * @param {*} res respuesta
 * @returns 
 */
const newPassword = async (req, res) => {
  //Validar nuevo pass
  await check("password")
    .isLength({ min: 6 })
    .withMessage("La contraseña debe tener al menos 6 caracteres.")
    .run(req);

  let result = validationResult(req);

  if (!result.isEmpty()) {
    // console.log(result)
    return res.render("auth/reset-password", {
      page: "Reestablecer contraseña",
      errors: result.array(),
      csrfToken: req.csrfToken(),
    });
  }

  const { token } = req.params;
  const { password } = req.body;

  //Identificar quien hace el cambio
  const user = await User.findOne({ where: { token } });

  //Hash pass
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(password, salt);
  user.token = null;

  await user.save();

  res.render("auth/confirm-account", {
    page: "Contraseña reestablecida",
    message: "La contraseña se guardó correcamente.",
  });
};

export {
  loginForm,
  authenticate,
  registryForm,
  registry,
  confirm,
  forgotPasswordForm,
  resetPassword,
  checkToken,
  newPassword,
};
