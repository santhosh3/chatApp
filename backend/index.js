const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const Routes = require("./src/router/routes")

const app = express();

app.use(cors());
app.use(bodyParser.json());

async function connectDB(){
   try {
    mongoose.set('strictQuery', false);
    await mongoose.connect('mongodb://localhost:27017/socket',{ useNewUrlParser:true,useUnifiedTopology:true});
    console.log("DB is connected successfully")
   } catch (error) {
    console.log(error);
    process.exit();
   }
}
connectDB()

app.use("/", Routes);

app.get('/', async(req,res) => {
    res.json("Hello")
})

const PORT = 5000
app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`)
})
