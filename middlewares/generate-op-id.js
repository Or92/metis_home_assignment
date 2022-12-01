const generateUUID = require('../utilities/general-util').generateUUID;

module.exports = (req, _, next) => {
    req.op_id = generateUUID();
    return next();
}