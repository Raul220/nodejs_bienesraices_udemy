import Property from "./Property.js";
import Price from "./Price.js";
import User from "./User.js";
import Category from "./Category.js";
import Message from "./Message.js";

Property.belongsTo(Price);
Property.belongsTo(Category);
Property.belongsTo(User);
Property.hasMany(Message);

Message.belongsTo(Property);
Message.belongsTo(User);

export { Property, Price, User, Category, Message };
