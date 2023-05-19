import express from "express";
import { body } from "express-validator";
import {
  admin,
  create,
  saveProperty,
} from "../controllers/propertyController.js";

const router = express.Router();

router.get("/my-properties", admin);
router.get("/properties/create", create);
router.post(
  "/properties/create",
  body("title").notEmpty().withMessage("El título no debe estar vacío"),
  body("description")
    .notEmpty()
    .withMessage("La descripción no debe estar vacía")
    .isLength({ max: 200 })
    .withMessage("La descripción es muy larga"),
  body("category").isNumeric().withMessage("Selecciona una categoría"),
  body("price").isNumeric().withMessage("Selecciona un rango de precio"),
  body("bedrooms").isNumeric().withMessage("Selecciona la cantidad de habitaciones"),
  body("parking").isNumeric().withMessage("Selecciona la cantidad de plazas de garaje"),
  body("bathrooms").isNumeric().withMessage("Selecciona la cantidad de baños"),
  body("lng").notEmpty().withMessage("Ubica la propiedad en el mapa"),
  saveProperty
);

export default router;
