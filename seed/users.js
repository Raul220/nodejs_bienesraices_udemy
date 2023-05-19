import bcrypt from "bcrypt";

const users = [
  {
    name: "Vito Corleone",
    email: "elpadrino@mail.com",
    confirmed: 1,
    password: bcrypt.hashSync("password", 10),
  },
];

export default users;
