import jwt from "jsonwebtoken";
import { User } from "../models/index.js";

const protectRoute = async (req, res, next) => {
  //Verificar si hay un token
  const { _token } = req.cookies;
  //   console.log(_token)
  if (!_token) {
    return res.redirect("/auth/login");
  }
  //Comprobar el token
  try {
    const decoded = jwt.verify(_token, process.env.JWT_SECRET);
    // console.log(decoded)
    const user = await User.scope("removePassword").findByPk(decoded.id);

    //Almacenar el user al req
    if (user) {
      req.user = user;
    } else {
      return res.redirect("/auth/login");
    }
    return next();
  } catch (error) {
    return res.clearCookie("_token").redirect("/auth/login");
  }
};

export default protectRoute;
