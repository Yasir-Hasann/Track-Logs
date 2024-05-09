// module imports
const asyncHandler = require('express-async-handler');
const dayjs = require('dayjs');

// file imports
const LogModel = require('../models/log');
const ErrorResponse = require('../utils/error-response');

// @desc   Add Logs
// @route  POST /api/v1/logs
// @access Public
exports.addLog = asyncHandler(async (req, res, next) => {
    const data = await LogModel.create(req.body);
    if (!data) return next(new ErrorResponse('Something went wrong', 500));

    res.status(200).json(data);
});


// @desc   Get All Logs
// @route  GET /api/v1/logs
// @access Public
exports.getAllLogs = asyncHandler(async (req, res, next) => {
    const { limit: l, page: p, sort: s, fromDate: fd, toDate: td, createdAgo: ca, method: m, url: u, statusCode: sc } = req.query;
    const limit = l ? parseInt(l) : 10;
    const page = p ? parseInt(p) : 1;
    const sort = s ? parseInt(s) : -1;
    const fromDate = fd || null;
    const toDate = td || null;
    const createdAgo = parseInt(ca) || null;
    const method = m ? m.toUpperCase() : null;
    const url = u || null;
    const statusCode = sc ? parseInt(sc) : null;

    const query = [];

    if (createdAgo) query.unshift({ $match: { createdAt: { $gt: dayjs().subtract(createdAgo, 'days').startOf('day').toDate() } } });

    if (fromDate && toDate) {
        const startOf = dayjs(fromDate, 'YYYY-MM-DD').startOf('day').toDate();
        const endOf = dayjs(toDate, 'YYYY-MM-DD').startOf('day').toDate();
        query.unshift({ $match: { createdAt: { $gt: startOf, $lte: endOf } } });
    }

    if (method) query.unshift({ $match: { method } });

    if (statusCode) query.unshift({ $match: { statusCode } });

    const aggregate = LogModel.aggregate(query);

    if (url) aggregate.match({ ['url']: { $regex: `.*${url}.*`, $options: 'i' } });

    const data = await LogModel.aggregatePaginate(aggregate, {
        page,
        limit,
        sort: { createdAt: sort },
    });

    if (!data) return next(new ErrorResponse('No Logs', 404));

    res.status(200).json(data);
});

