import { Sequelize } from "sequelize";
import { Category, Price, Property } from "../models/index.js";

/**
 * Renderiza la pagina principal
 * @param {*} req
 * @param {*} res
 */
const home = async (req, res) => {
  const [categories, prices, houses, departments] = await Promise.all([
    Category.findAll({ raw: true }),
    Price.findAll({ raw: true }),
    Property.findAll({
      limit: 3,
      where: {
        categoryId: 1,
      },
      include: [
        {
          model: Price,
          as: "price",
        },
      ],
      order: [["createdAt", "DESC"]],
    }),
    Property.findAll({
      limit: 3,
      where: {
        categoryId: 2,
      },
      include: [
        {
          model: Price,
          as: "price",
        },
      ],
      order: [["createdAt", "DESC"]],
    }),
  ]);

  res.render("home", {
    page: "Inicio",
    categories,
    prices,
    houses,
    departments,
    csrfToken: req.csrfToken(),
  });
};

/**
 * Visitar categorias
 * @param {*} req
 * @param {*} res
 */
const category = async (req, res) => {
  const { id } = req.params;

  //Comprobar que la categoria exista
  const category = await Category.findByPk(id);

  if (!category) {
    console.log(category);
    return res.redirect("/404");
  }

  //Obtener propiedades
  const properties = await Property.findAll({
    where: {
      categoryId: id,
    },
    include: [{ model: Price, as: "price" }],
  });

  res.render("category", {
    page: `${category.name}s en venta`,
    properties,
    csrfToken: req.csrfToken(),
  });
};

/**
 * Pagina de error
 * @param {*} req
 * @param {*} res
 */
const notFound = async (req, res) => {
  res.render("404", {
    page: "No encontrada",
    csrfToken: req.csrfToken(),
  });
};

/**
 * Buscador
 * @param {*} req
 * @param {*} res
 */
const search = async (req, res) => {
  const { term } = req.body;

  if (!term.trim()) {
    return res.redirect("back");
  }

  //Consultar las propiedades
  const properties = await Property.findAll({
    where: {
      title: {
        [Sequelize.Op.like]: "%" + term + "%",
      },
    },
    include: [{ model: Price, as: "price" }],
  });

  res.render('search', {
    page: `Búsqueda: ${term}`,
    properties,
    csrfToken: req.csrfToken(),
  })
};

export { home, category, notFound, search };
