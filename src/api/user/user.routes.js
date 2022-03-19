const UserRoutes = require('express').Router();
const { postNewUser, loginUser, logoutUser, getUser, patchUser, getAllUser } = require('./user.controller');
const upload = require('../../middlewares/file')


UserRoutes.get('/', getAllUser);
UserRoutes.post('/', upload.single('image'), postNewUser);
UserRoutes.post('/login', loginUser);
UserRoutes.post('/logout', logoutUser);
UserRoutes.get('/:id', getUser);
UserRoutes.patch('/:id', upload.single('image'), patchUser);




module.exports = UserRoutes;
