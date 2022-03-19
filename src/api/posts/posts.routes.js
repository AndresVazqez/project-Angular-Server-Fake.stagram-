const postRoutes = require('express').Router();
const upload = require('../../middlewares/file');
const { postNewPost, getAllPosts, getPostById, patchPost, deletePost } = require('../posts/posts.controllers.js');

postRoutes.post('/', upload.single('image'), postNewPost);
postRoutes.get('/', getAllPosts);
postRoutes.get('/:id',getPostById);
postRoutes.patch('/:id', upload.single('image'), patchPost);
postRoutes.delete('/:id', upload.single('image'), deletePost);

module.exports = postRoutes;


