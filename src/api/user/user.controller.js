const User = require("./user.model");
const bcrypt = require("bcrypt");
const { setError } = require("../../utils/error/error");
const { generateSign } = require("../../utils/jwt/jwt");
const { deleteFile } = require('../../middlewares/delete');

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

const getAllUser = async (req, res, next) => {
  try {
    const usersDb = await User.find().populate('posts', {
      caption: 1,
      image: 1,
      date: 1
    })    
    res.status(200).json(usersDb)
  } catch (error) {
    return next(setError(500, 'Users failed server'))
  }
}

const getUser = async (req, res, next) => {
  try {
    const { username } = req.params;
    console.log(req.params)

      const userDb = await User.find({username: { $regex:  username  }}).populate('posts', {
        caption: 1,
        image: 1,
        date: 1
      })     
  
    if (!userDb ) {
      return next(setError(404, "User not found"));
    }
    return res.status(200).json(userDb);
  } catch (error) {
    return next(setError(404, "User server fail"));
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
      console.log(userDb._id)
      return res.status(200).json({token: token, username: userDb.username });
    }
    if (!bcrypt.compareSync(req.body.password, userDb.password)) {
      return next(setError(404, "invalid password"));
    }
  } catch (error) {
    error.message = "error Login";
    return next(setError(500, "error in login"));
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



const patchUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log(id)
    console.log(req.body)
    const patchUser = new User(req.body);
    patchUser._id = id;
    const userBefore = await User.findById( id );   
    
    if (req.file) {
      patchUser.image = req.file.path;    
      if(userBefore.image) {       
        deleteFile(userBefore.image)
      }      
    } 

    patchUser.posts = patchUser.posts.concat(userBefore.posts) 
    const userDb = await User.findByIdAndUpdate(id, patchUser);
    
    if (!userDb) {
      return next(setError(404, "User not found"));
    }
    console.log("llega hasta aqui")
    return res.status(200).json({ new: patchUser, old: userDb });
  } catch (error) {
    return next(setError(500, "Error patching User"));
  }
};

module.exports = { postNewUser, loginUser, logoutUser, getUser, patchUser, getAllUser };
