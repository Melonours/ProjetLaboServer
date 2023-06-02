import  express, { json }  from "express";
import sequelize from "./models/db.js";

const app = express();

app.use(json())

app.listen(3003, () => {
    console.log('listening to port 3003')
})
