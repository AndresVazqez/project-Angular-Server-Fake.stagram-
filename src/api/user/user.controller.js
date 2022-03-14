const User = require("./user.model");
const bcrypt = require("bcrypt");
const { setError } = require("../../utils/error/error");
const { generateSign } = require("../../utils/jwt/jwt");

const postNewUser = async (req, res, next) => {
  try {
    const newUser = new User(req.body);

    const emailDuplicate = await User.findOne({ email: newUser.email });
    const userNameDuplicate = await User.findOne({
      username: newUser.username,
    });
    if (req.file) {
      newUser.image = req.file.path;
    }
    if (emailDuplicate && userNameDuplicate) {
      return next(setError(404, "email and username are already in use"));
    } else {
      if (emailDuplicate) {
        return next(setError(404, "email already exists"));
      }
      if (userNameDuplicate) {
        return next(setError(404, "Username already exists"));
      }
    }

    const userDb = await newUser.save();
    return res.status(201).json({ userDb: userDb });
  } catch (error) {
    console.log(error);
    return next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {   

    const userDb = await User.findOne({ email: req.body.email });
   
    if (!userDb) {
      return next(setError(404, "User not found"));
    }
    if (bcrypt.compareSync(req.body.password, userDb.password)) {
      
      const token = generateSign(userDb._id, userDb.email);     
      return res.status(200).json(token);
    }
    if (!bcrypt.compareSync(req.body.password, userDb.password)) {
      return next(setError(404, "invalid password"));
    }
  } catch (error) {      
    error.message = "error Login";
    return next(setError(500, "No se ha podido logear"));
  }
};

const logoutUser = (req, res, next) => {
  try {
    const logout = "Session ended";
    const token = null;
    return res.status(200).json({ token: token, message: logout });
  } catch (error) {
    return next(error);
  }
};

const getUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userDb = await User.findById(id);
    if (!userDb) {
      return next(setError(404, "User not found"));
    }
    return res.status(200).json({ userDb: userDb });
  } catch (error) {
    return next(setError(404, "User server fail"));
  }
};

const patchUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const patchUser = new User(req.body);
    patchUser._id = id;
    if (req.file) {
      patchUser.img = req.file.path;
    }
    console.log(patchUser);
    const userDb = await User.findByIdAndUpdate(id, patchUser);
    if (!userDb) {
      return next(setError(404, "User not found"));
    }
    // if(userDb.image) deleteFile(userDb.image)
    return res.status(200).json({ new: patchUser, old: userDb });
  } catch (error) {
    return next(setError(500, "Error patching User"));
  }
};

module.exports = { postNewUser, loginUser, logoutUser, getUser, patchUser };
