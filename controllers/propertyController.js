import { unlink } from "node:fs/promises";
import { validationResult } from "express-validator";
import { Price, Category, Property, Message, User } from "../models/index.js";
import { isSeller, formatDate } from "../helpers/index.js";

/**
 * Renderiza la vista de propiedades
 * @param {*} req peticion
 * @param {*} res respuesta
 */
const admin = async (req, res) => {
  //leer queryString

  const { page: currentPage } = req.query;
  console.log(currentPage);

  const regExp = /^[1-9]$/;

  if (!regExp.test(currentPage)) {
    return res.redirect("/my-properties?page=1");
  }

  try {
    const { id } = req.user;

    //limites y offset para el paginador
    const limit = 10;
    const offset = currentPage * limit - limit;

    const [properties, total] = await Promise.all([
      Property.findAll({
        limit,
        offset,
        where: { userId: id },
        include: [
          { model: Category, as: "category" },
          { model: Price, as: "price" },
          { model: Message, as: "messages" },
        ],
      }),
      Property.count({
        where: {
          userId: id,
        },
      }),
    ]);

    res.render("properties/admin", {
      page: "Propiedades",
      properties,
      csrfToken: req.csrfToken(),
      pages: Math.ceil(total / limit),
      currentPage: Number(currentPage),
      total,
      limit,
      offset,
    });
  } catch (error) {
    console.log(error);
  }
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
    // console.log(req.file);

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
  // console.log("deleting");

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

  if (!property || !property.released) {
    return res.redirect("/404");
  }

  res.render("properties/detail", {
    page: property.title,
    property,
    csrfToken: req.csrfToken(),
    user: req.user,
    isSeller: isSeller(req.user?.id, property?.userId),
  });
};

const sendMessage = async (req, res) => {
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

  //Renderizar errores
  let result = validationResult(req);

  if (!result.isEmpty()) {
    res.render("properties/detail", {
      page: property.title,
      csrfToken: req.csrfToken(),
      errors: result.array(),
      property,
      user: req.user,
      isSeller: isSeller(req.user?.id, property?.userId),
    });
  }

  //Almacenar Modelo
  const { message } = req.body;
  const { id: propertyId } = req.params;
  const { id: userId } = req.user;

  await Message.create({
    message,
    propertyId,
    userId,
  });

  res.render("properties/detail", {
    page: property.title,
    property,
    csrfToken: req.csrfToken(),
    user: req.user,
    isSeller: isSeller(req.user?.id, property?.userId),
    send: true,
  });
};

/**
 * Leer los mensajes
 * @param {*} req
 * @param {*} res
 * @returns
 */
const readMessages = async (req, res) => {
  //Extraer id
  const { id } = req.params;

  //Validar que la propiedad exista

  const property = await Property.findByPk(id, {
    include: [
      {
        model: Message,
        as: "messages",
        include: [{ model: User.scope("removePassword"), as: "user" }],
      },
    ],
  });

  if (!property) {
    return res.redirect("/my-properties");
  }

  //Check quien visita la url es quien la creo
  if (property.userId.toString() !== req.user.id.toString()) {
    return res.redirect("/my-properties");
  }

  res.render("properties/messages", {
    page: "Mensajes",
    messages: property.messages,
    formatDate,
  });
};

/**
 * Cambiar el estado de la propiedad
 * @param {*} req
 * @param {*} res
 */
const changeState = async (req, res) => {
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

  //Actualizar
  property.released = !property.released;

  await property.save();

  res.json({
    result: true,
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
  sendMessage,
  readMessages,
  changeState,
};
