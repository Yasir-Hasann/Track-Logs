// module imports
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// file imports
const apiRouter = require('./routes');
const errorHandler = require('./middlewares/error-handler');

// variable initializations
const app = express();
const port = process.env.PORT || 5000;

// connect Mongodb Database
mongoose.connect(process.env.MONGO_URI).then((conn) => console.log(`Mongodb connected: ${conn.connection.host}`)).catch((err) => console.error(err))

// middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

// mount routes
app.use('/api/v1', apiRouter);
app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});

console.log(process.env.NODE_ENV.toUpperCase());