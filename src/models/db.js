import { Sequelize } from "sequelize";

//import de la config
import dotenv from 'dotenv';
dotenv.config();

export const sequelize = new Sequelize({
    dialect: 'mssql',
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,

});

//pour mettre automatiquement à jour la db quand il y a des changements grâce à nodemon

//sequelize.sync({force:true}); 

export default sequelize