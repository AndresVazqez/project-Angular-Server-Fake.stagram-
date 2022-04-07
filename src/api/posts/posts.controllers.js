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
        }).populate("likes", {
            username: 1,
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
            image: 1

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
        const prevPost = await Post.findById(id)
        const patchPost = new Post(req.body)
        patchPost._id = id
        patchPost.likes = prevPost.likes;

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

const likePost = async (req, res, next) => {
    try {
        const { id } = req.params
        const userId = req.body.likes
        console.log(req.params.id)
        console.log("req. body: ", req.body)
        const userDb = await User.findById(userId)
        const prevPostDb = await Post.findById(id)

        const patchPost = new Post(req.body)
        patchPost._id = id
        patchPost.likes = [...prevPostDb.likes, userId]
        userDb.liked = [...userDb.liked, id]
        
        // if (prevPostDb.likes.includes(userId)) {
        //     console.log("include userId:")
        //     const newPostLikes = prevPostDb.likes.filter((user) => {
        //         user !== userId
        //     })
        //     patchPost.likes = newPostLikes
        // } else {
        //     console.log("Not include userId:")
        //     patchPost.likes = [...prevPostDb.likes, userId]
        // }
        // if (userDb.liked.includes(id)) {
        //     console.log("include postId:")
        //     const newUserLiked = userDb.liked.filter((post) => {
        //         post !== id
        //     })
        //     userDb.liked = newUserLiked
        // } else {
        //     console.log("not include postId:")
        //     userDb.liked = [...userDb.liked, id]
        // }

        const userLikedUpdated = await User.findByIdAndUpdate(userId, userDb)
        const postDb = await Post.findByIdAndUpdate(id, patchPost)
        return res.status(200).json({ new: patchPost.likes, old: postDb.likes })

    } catch (err) {
        next(setError(500, "error like in post"))
    }
}

const unLikePost = async (req, res, next) => {
    try {
        const { id } = req.params
        const userId = req.body.likes
        const userDb = await User.findById(userId)
        const prevPostDb = await Post.findById(id)
        const patchPost = new Post(req.body)
        patchPost._id = id

        const newPostLikes = prevPostDb.likes.filter((user) => {
            user !== userId
        })
        patchPost.likes = newPostLikes

        const newUserLiked = userDb.liked.filter((post) => {
            post !== id
        })
        userDb.liked = newUserLiked

        const userLikedUpdated = await User.findByIdAndUpdate(userId, userDb)
        const postDb = await Post.findByIdAndUpdate(id, patchPost)
        return res.status(200).json({ new: patchPost.likes, old: postDb.likes })

    } catch (err) {
        next(setError(500, "Unlike error in post"))
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
    deletePost,
    likePost,
    unLikePost
}

