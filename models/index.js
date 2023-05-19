import Property from "./Property.js";
import Price from "./Price.js";
import User from "./User.js";
import Category from "./Category.js";

Property.belongsTo(Price);
Property.belongsTo(Category);
Property.belongsTo(User);

export { Property, Price, User, Category };
