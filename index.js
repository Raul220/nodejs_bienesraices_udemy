import express from "express";
import csrf from "csurf";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoutes.js";
import db from "./config/db.js";

//Create app
const app = express();

// Enable form data reading
app.use(express.urlencoded({ extended: true }));

//Habilitar cookie parser
app.use(cookieParser())

//Habilitar CSRF
app.use( csrf({cookie: true}) )

// DB Conection
try {
  await db.authenticate();
  db.sync()
  console.log("Success conection.");
} catch (e) {
  console.log(e);
}

//Enable pug
app.set("view engine", "pug");
app.set("views", "./views");

//Public folder
app.use(express.static("public"));

//Routing
app.use("/auth", userRoutes);

//Define a port and run the project
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server runing at port: ${port}`);
});
