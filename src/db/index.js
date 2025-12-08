import { Sequelize } from "sequelize";

const sequelize = new Sequelize("hms_demo", "rakshaya", "rakshaya", {
  host: "192.168.1.150",
  port: 3306,
  dialect: "mysql",
});

sequelize
  .authenticate()
  .then(() => console.log("Database is Connected"))
  .catch((err) => console.error(`Database connection error: ${err}`));


export { sequelize };




