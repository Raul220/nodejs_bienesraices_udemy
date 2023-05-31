import jwt from "jsonwebtoken";
import User from "../models/User.js";

const identifyUser = async (req, res, next) => {
  //identificar si hay un token en las cookies
  const { _token } = req.cookies;

  if (!_token) {
    req.user = null;
    return next();
  }

  //verificar token
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
    console.log(error)
    res.clearCookie('_token').redirect('/auth/login')
  }
};

export default identifyUser;