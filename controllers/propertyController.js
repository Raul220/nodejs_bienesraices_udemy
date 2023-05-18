import Category from "../models/Category.js";
import Price from "../models/Price.js";

/**
 * Renderiza la vista de propiedades
 * @param {*} req peticion
 * @param {*} res respuesta
 */
const admin = (req, res) => {
  res.render("properties/admin", {
    page: "Propiedades",
    bar: true,
  });
};

/**
 * Renderiza la vista de crear propiedad
 * @param {*} req peticion
 * @param {*} res respuesta
 */
const create = async (req, res) => {
  //Consultar modelo de precio y categoria
  const [categories, prices] = await Promise.all([
    Category.findAll(),
    Price.findAll(),
  ]);

  res.render("properties/create", {
    page: "Crear propiedad",
    bar: true,
    categories,
    prices,
  });
};

export { admin, create };
