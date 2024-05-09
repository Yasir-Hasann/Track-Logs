// module imports
const mongoose = require('mongoose');

const LogSchema = new mongoose.Schema(
    {
        method: String,
        url: String,
        statusCode: String,
        responseTime: String,
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('log', LogSchema);