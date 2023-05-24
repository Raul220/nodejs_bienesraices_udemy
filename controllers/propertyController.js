import { unlink } from "node:fs/promises";
import { validationResult } from "express-validator";
import { Price, Category, Property } from "../models/index.js";

/**
 * Renderiza la vista de propiedades
 * @param {*} req peticion
 * @param {*} res respuesta
 */
const admin = async (req, res) => {
  const { id } = req.user;

  const properties = await Property.findAll({
    where: { userId: id },
    include: [
      { model: Category, as: "category" },
      { model: Price, as: "price" },
    ],
  });

  res.render("properties/admin", {
    page: "Propiedades",
    properties,
    csrfToken: req.csrfToken(),
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

/**
 * Store image of a property
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns
 */
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

/**
 * Edit a property form
 * @param {*} req
 * @param {*} res
 * @param {*} net
 */
const editProperty = async (req, res, net) => {
  //Extraer id
  const { id } = req.params;

  //Validar que la propiedad exista

  const property = await Property.findByPk(id);

  if (!property) {
    return res.redirect("/my-properties");
  }

  //Check quien visita la url es quien la creo
  if (property.userId.toString() !== req.user.id.toString()) {
    return res.redirect("/my-properties");
  }

  //Consultar modelo de precio y categoria
  const [categories, prices] = await Promise.all([
    Category.findAll(),
    Price.findAll(),
  ]);

  res.render("properties/edit", {
    page: `Editar propiedad: ${property.title}`,
    csrfToken: req.csrfToken(),
    categories,
    prices,
    data: property,
  });
};

/**
 * Actualizar la propiedad
 * @param {*} req
 * @param {*} res
 * @returns
 */
const updateProperty = async (req, res) => {
  //Verificar validacion
  let result = validationResult(req);

  if (!result.isEmpty()) {
    //Consultar modelo de precio y categoria
    const [categories, prices] = await Promise.all([
      Category.findAll(),
      Price.findAll(),
    ]);

    return res.render("properties/edit", {
      page: `Editar propiedad`,
      csrfToken: req.csrfToken(),
      categories,
      prices,
      data: req.body,
      errors: result.array(),
    });
  }

  //Extraer id
  const { id } = req.params;

  //Validar que la propiedad exista

  const property = await Property.findByPk(id);

  if (!property) {
    return res.redirect("/my-properties");
  }

  //Check quien visita la url es quien la creo
  if (property.userId.toString() !== req.user.id.toString()) {
    return res.redirect("/my-properties");
  }

  //Salvar

  try {
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

    property.set({
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

    await property.save();

    res.redirect("my-properties");
  } catch (error) {
    console.log(error);
  }
};

const deleteProperty = async (req, res) => {
  console.log("deleting");

  //Extraer id
  const { id } = req.params;

  //Validar que la propiedad exista

  const property = await Property.findByPk(id);

  if (!property) {
    return res.redirect("/my-properties");
  }

  //Check quien visita la url es quien la creo
  if (property.userId.toString() !== req.user.id.toString()) {
    return res.redirect("/my-properties");
  }

  //Eliminar la imgen asociada
  await unlink(`public/uploads/${property.image}`);

  console.log(`Se elimino la imagen: ${property.image}`);

  //Eliminar prop
  await property.destroy();
  res.redirect("/my-properties");
};

const showProperty = async (req, res) => {
  const { id } = req.params;

  const property = await Property.findByPk(id, {
    include: [
      { model: Category, as: "category" },
      { model: Price, as: "price" },
    ],
  });

  if (!property) {
    return res.redirect("/404");
  }

  res.render("properties/detail", {
    page: property.title,
    property,
  });
};

export {
  admin,
  create,
  saveProperty,
  addImage,
  storageImage,
  editProperty,
  updateProperty,
  deleteProperty,
  showProperty,
};
