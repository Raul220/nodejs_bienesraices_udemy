import { validationResult } from "express-validator";
import { Price, Category, Property } from "../models/index.js";

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
    csrfToken: req.csrfToken(),
    categories,
    prices,
    data: {},
  });
};

/**
 * Guardar la Propiedad
 * @param {*} req peticion
 * @param {*} res respuesta
 */
const saveProperty = async (req, res) => {
  //Resultado de la validacion
  let result = validationResult(req);

  console.log("latitud:" + lat + "longitud:" + lng + "calle:" + street);

  if (!result.isEmpty()) {
    //Consultar modelo de precio y categoria
    const [categories, prices] = await Promise.all([
      Category.findAll(),
      Price.findAll(),
    ]);

    res.render("properties/create", {
      page: "Crear propiedad",
      bar: true,
      csrfToken: req.csrfToken(),
      categories,
      prices,
      errors: result.array(),
      data: req.body,
    });
  }

  //Crear registro

  const { title, description, bedrooms, parking, bathrooms, street, lat, lng, price: priceId, category: categoryId } =
    req.body;

  try {
    const savedProperty = await Property.create({
      title,
      description,
      bedrooms,
      parking,
      bathrooms,
      street,
      lat,
      lng,
      priceId,
      categoryId,
    });
  } catch (error) {
    console.log(error);
  }
};

export { admin, create, saveProperty };
