const express = require('express');
const dotenv = require('dotenv').config();
const connectDB = require('./config/dbConnection');

const app = express();
const port = process.env.PORT

connectDB();

app.use(express.json());
app.use("/", require("./routers/routers"));

app.listen(port, () => {
    console.log('listening on the port ' + port);
})
