import express from "express";
import { category, home, notFound, search } from "../controllers/appController.js";

const router = express.Router();

//Pagina de inicio
router.get("/", home);

//Categorias
router.get("/categories/:id", category);

//404
router.get("/404", notFound);

//Buscador
router.post("/search", search);

export default router;
