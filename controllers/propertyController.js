const admin = (req, res) => {
  res.render("properties/admin", {
    page: "Propiedades",
    bar: true,
  });
};

export { admin };
