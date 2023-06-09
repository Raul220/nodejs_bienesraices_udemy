import express from "express";
import { body } from "express-validator";
import {
  addImage,
  admin,
  changeState,
  create,
  deleteProperty,
  editProperty,
  readMessages,
  saveProperty,
  sendMessage,
  showProperty,
  storageImage,
  updateProperty,
} from "../controllers/propertyController.js";
import protectRoute from "../middleware/protectRoute.js";
import upload from "../middleware/uploadImage.js";
import identifyUser from "../middleware/identifyUser.js";

const router = express.Router();

router.get("/my-properties", protectRoute, admin);
router.get("/properties/create", protectRoute, create);
router.post(
  "/properties/create",
  protectRoute,
  body("title").notEmpty().withMessage("El título no debe estar vacío"),
  body("description")
    .notEmpty()
    .withMessage("La descripción no debe estar vacía")
    .isLength({ max: 200 })
    .withMessage("La descripción es muy larga"),
  body("category").isNumeric().withMessage("Selecciona una categoría"),
  body("price").isNumeric().withMessage("Selecciona un rango de precio"),
  body("bedrooms")
    .isNumeric()
    .withMessage("Selecciona la cantidad de habitaciones"),
  body("parking")
    .isNumeric()
    .withMessage("Selecciona la cantidad de plazas de garaje"),
  body("bathrooms").isNumeric().withMessage("Selecciona la cantidad de baños"),
  body("lng").notEmpty().withMessage("Ubica la propiedad en el mapa"),
  saveProperty
);
router.get("/properties/add-image/:id", protectRoute, addImage);
router.post(
  "/properties/add-image/:id",
  protectRoute,
  upload.single("image"),
  storageImage
);

router.get("/properties/edit/:id", protectRoute, editProperty);
router.post(
  "/properties/edit/:id",
  protectRoute,
  body("title").notEmpty().withMessage("El título no debe estar vacío"),
  body("description")
    .notEmpty()
    .withMessage("La descripción no debe estar vacía")
    .isLength({ max: 200 })
    .withMessage("La descripción es muy larga"),
  body("category").isNumeric().withMessage("Selecciona una categoría"),
  body("price").isNumeric().withMessage("Selecciona un rango de precio"),
  body("bedrooms")
    .isNumeric()
    .withMessage("Selecciona la cantidad de habitaciones"),
  body("parking")
    .isNumeric()
    .withMessage("Selecciona la cantidad de plazas de garaje"),
  body("bathrooms").isNumeric().withMessage("Selecciona la cantidad de baños"),
  body("lng").notEmpty().withMessage("Ubica la propiedad en el mapa"),
  updateProperty
);

router.post("/properties/delete/:id", protectRoute, deleteProperty);

router.put("/properties/:id",
  protectRoute,
  changeState
)

//Area publica
router.get("/property/:id", identifyUser, showProperty);

//Almacenar mensajes
router.post(
  "/property/:id",
  identifyUser,
  body("message").isLength({ min: 10 }).withMessage("Es muy corto"),
  sendMessage
);

router.get("/messages/:id", protectRoute, readMessages);

export default router;
