const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstname: { type: String, default: null, required: true },
    lastname: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    faceID: { type: String, required: true},
    token: { type: String },
});

const toUserDTO = (model) => {
    return {
        firstname: model.firstname,
        lastname: model.lastname,
        email: model.email,
        token: model.token
    };
};

module.exports = {
    User: mongoose.model('user', userSchema),
    toUserDTO,
    UserSchema: userSchema
};
