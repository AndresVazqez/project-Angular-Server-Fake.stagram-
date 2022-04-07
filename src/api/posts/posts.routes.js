const postRoutes = require('express').Router();
const upload = require('../../middlewares/file');
const { postNewPost, getAllPosts, getPostById, patchPost, deletePost, likePost, unLikePost } = require('../posts/posts.controllers.js');
const { isAuth } = require('../../middlewares/auth');

postRoutes.post('/', upload.single('image'), postNewPost);
postRoutes.get('/', getAllPosts);
postRoutes.get('/:id', getPostById);
postRoutes.patch('/:id', upload.single('image'), patchPost);
postRoutes.delete('/:id', upload.single('image'), deletePost);
postRoutes.patch('/like/:id', likePost)
postRoutes.patch('/unlike/:id', unLikePost)

module.exports = postRoutes;


