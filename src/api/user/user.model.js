const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { validationPassword } = require('../../utils/validators/validators');
const { setError } = require('../../utils/error/error');

const userSchema = new mongoose.Schema({
        name: { type: String, trim: true, required: true },        
        username: { type: String, trim: true, required: true, unique: true },
        email: { type: String, trim: true, required: true, unique: true},
        password: { type: String, trime: true, required: true },
        image: {type: String, trim: true }
    },{ timestamps: true }
);

userSchema.pre("save", function (next) {

    if(!validationPassword(this.password)){
     
        return next(setError(400,"invalid password, must contain Num Min,May, specialCaracter,and min 8 caract length"))
    }
    this.password = bcrypt.hashSync(this.password, 10);
    next();
});

const User = mongoose.model('users', userSchema)
module.exports = User
