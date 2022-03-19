const Post = require('./posts.models');
const User = require('../user/user.model');
const { setError } = require('../../utils/error/error');
const { deleteFile } = require('../../middlewares/delete');

const postNewPost = async (req, res, next) => {
    try {
        const { image, caption, userId } = req.body
        console.log(req.body)
        const userDb = await User.findById(userId)
        const newPost = new Post({
            image,
            caption,
            userId: userId
        })
        console.log(req.file)     
        if (req.file) {
            newPost.image = req.file.path;
        }
        const postDb = await newPost.save()
        userDb.posts = userDb.posts.concat(postDb._id)
        await User.findByIdAndUpdate(userId, userDb)

        return res.status(201).json(postDb)
    } catch (error) {
        return next(setError(500, 'new post failed to save'))
    }
}

const getAllPosts = async (req, res, next) => {
    try {
        const postsDb = await Post.find().populate("userId", {
            username: 1,
            name: 1,
            image: 1
        })
        res.status(200).json(postsDb)
    } catch (error) {
        return next(setError(500, 'all Posts  failed server'))
    }
}

const getPostById = async (req, res, next) => {
    try {
        const { id } = req.params
        const postDB = await Post.findById(id).populate("userId", {
            username: 1,
            name: 1,
           
        })
        if (!postDB) {
            return next(setError(404, 'post not found'))
        }
        return res.status(200).json(postDB)
    } catch (error) {
        return next(setError(500, 'post by id server error'))
    }
}

const patchPost = async (req, res, next) => {
    try {
        const { id } = req.params
        const patchPost = new Post(req.body)
        patchPost._id = id
        patchPost.caption = req.body.caption
        console.log(req.file)
        if (req.file) {
            patchPost.image = req.file.path
        }
        const postDb = await Post.findByIdAndUpdate(id, patchPost)
        if (!postDb) {
            return next(setError(404, 'Post not found'))
        }
        if (postDb.img) deleteFile(postDb.img)
        return res.status(200).json({ new: patchPost, old: postDb })
    } catch (error) {
        return next(setError(500, 'Post Patch server error'))
    }
}

const deletePost = async (req, res, next) => {
    try {
        const { id } = req.params
        const postDb = await Post.findByIdAndDelete(id)
        if (!postDb) {
            return next(setError(404, 'post not found'))
        }
        if (postDb.image) {

            deleteFile(postDb.image)
        }
        return res.status(200).json(postDb)
    } catch (error) {
        return next(setError(500, 'server error try post removed '))
    }
}

module.exports = {
    postNewPost,
    getAllPosts,
    getPostById,
    patchPost,
    deletePost
}

