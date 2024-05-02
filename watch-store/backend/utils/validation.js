const mongoose = require('mongoose');
const validate = (id) => {
    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) {
        throw new Error(`${id} is not a valid id`);
    };
};

module.exports = { validate };