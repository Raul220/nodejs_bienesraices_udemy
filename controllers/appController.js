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
  });
};

/**
 * Visitar categorias
 * @param {*} req
 * @param {*} res
 */
const category = async (req, res) => {};

/**
 * Pagina de error
 * @param {*} req
 * @param {*} res
 */
const notFound = async (req, res) => {};

/**
 * Buscador
 * @param {*} req
 * @param {*} res
 */
const search = async (req, res) => {};

export { home, category, notFound, search };
