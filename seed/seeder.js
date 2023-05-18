import { exit } from "node:process";
import categories from "./categories.js";
import Category from "../models/Category.js";
import Price from "../models/Price.js";
import db from "../config/db.js";
import prices from "./prices.js";

const importData = async () => {
  try {
    //Autenticar en bd
    await db.authenticate();

    //Generar las columnas
    await db.sync();

    //Insertar en db
    await Promise.all([
      Category.bulkCreate(categories),
      Price.bulkCreate(prices),
    ]);

    console.log("Exito");
    exit();
  } catch (error) {
    console.log(error);
    exit(1);
  }
};

const deleteData = async () => {
  try {
    // await Promise.all([
    //   Category.destroy({ wherre: {}, truncate: true }),
    //   Price.destroy({ wherre: {}, truncate: true }),
    // ]);

    await db.sync({force: true}); //Elimina las tablas completas

    console.log("Datos eliminados");
  } catch (error) {
    console.log(error);
    exit(1);
  }
};

if (process.argv[2] === "-i") {
  importData();
}

if (process.argv[2] === "-d") {
  deleteData();
}
