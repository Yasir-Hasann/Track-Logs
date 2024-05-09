// module imports
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');

// variable initializations
const app = express();
const port = process.env.PORT || 5001;

// Create a stream for morgan to write logs to the database
const mongoStream = {
  write: async function (log) {
    try {
      await axios.post(`${process.env.LOGGING_SERVER_URL}/logs`, JSON.parse(log));
    } catch (error) {
      console.error(error);
    }
  },
};


// middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));
app.use(
  morgan(
    (tokens, req, res) => {
      return JSON.stringify({
        method: tokens.method(req, res),
        url: tokens.url(req, res),
        statusCode: tokens.status(req, res),
        responseTime: tokens['response-time'](req, res),
      });
    },
    { stream: mongoStream }
  )
);

// mount routes
app.get('/test', (req, res) => {
  res.status(200).json({ success: true, message: 'Testing Logs' })
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});

console.log(process.env.NODE_ENV.toUpperCase());
