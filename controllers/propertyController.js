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
const create = (req, res) => {
  res.render("properties/create", {
    page: "Crear propiedad",
    bar: true,
  });
};

export { admin, create };
