const mongoose = require('mongoose');
require('dotenv').config();

const urlDb = process.env.MONGO_DB;

const connectDb = async () => {

    try {

        const db= await mongoose.connect(urlDb, {

            useNewUrlParser: true,
            useUnifiedTopology: true

        })
        const { name, host} = db.connection
        console.log(`Connected with dataBase: ${name} in port ${host}`);

    } catch (error){

        console.log("Error to connected with DataBase", error)
    }

}

module.exports = { connectDb };