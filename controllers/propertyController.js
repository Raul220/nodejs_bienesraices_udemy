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

  if (!result.isEmpty()) {
    //Consultar modelo de precio y categoria
    const [categories, prices] = await Promise.all([
      Category.findAll(),
      Price.findAll(),
    ]);

    res.render("properties/create", {
      page: "Crear propiedad",
      csrfToken: req.csrfToken(),
      categories,
      prices,
      errors: result.array(),
      data: req.body,
    });
  }

  //Crear registro

  const {
    title,
    description,
    bedrooms,
    parking,
    bathrooms,
    street,
    lat,
    lng,
    price: priceId,
    category: categoryId,
  } = req.body;

  const { id: userId } = req.user;

  try {
    const storedProperty = await Property.create({
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
      userId,
      image: "",
    });

    res.redirect(`/properties/add-image/${storedProperty.id}`);
  } catch (error) {
    console.log(error);
  }
};

const addImage = async (req, res) => {
  const { id } = req.params;

  //Validar que la propiedad exista
  const property = await Property.findByPk(id);

  if (!property) {
    return res.redirect("/my-properties");
  }

  //Validar que la propiedad no este publicada

  if (property.released) {
    return res.redirect("/my-properties");
  }

  //Validar que la propiedad pertenece al usuario logueado

  if (req.user.id.toString() !== property.userId.toString()) {
    return res.redirect("/my-properties");
  }

  res.render("properties/add-image", {
    page: `Agregar Imagen a ${property.title}`,
    csrfToken: req.csrfToken(),
    property,
  });
};

const storageImage = async (req, res, next) => {
  const { id } = req.params;

  //Validar que la propiedad exista
  const property = await Property.findByPk(id);

  if (!property) {
    return res.redirect("/my-properties");
  }

  //Validar que la propiedad no este publicada

  if (property.released) {
    return res.redirect("/my-properties");
  }

  //Validar que la propiedad pertenece al usuario logueado

  if (req.user.id.toString() !== property.userId.toString()) {
    return res.redirect("/my-properties");
  }

  try {
    console.log(req.file);

    //Almacenar imagen y publicar propiedad

    property.image = req.file.filename;
    property.released = 1;

    await property.save();

    next();
  } catch (error) {
    console.log(error);
  }
};

export { admin, create, saveProperty, addImage, storageImage };
