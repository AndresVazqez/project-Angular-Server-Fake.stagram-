const postRoutes = require('express').Router();
const upload = require('../../middlewares/file');
const { postNewPost, getAllPosts, getPostById, patchPost, deletePost } = require('../posts/posts.controllers.js');
const { isAuth } = require('../../middlewares/auth');

postRoutes.post('/',[isAuth], upload.single('image'), postNewPost);
postRoutes.get('/', [isAuth], getAllPosts);
postRoutes.get('/:id', getPostById);
postRoutes.patch('/:id', [isAuth], upload.single('image'), patchPost);
postRoutes.delete('/:id', [isAuth], upload.single('image'), deletePost);

module.exports = postRoutes;


