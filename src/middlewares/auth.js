const User = require('../api/user/user.model')
const { setError } = require('../utils/error/error')
const { verifyJwt } = require('../utils/jwt/jwt')

const isAuth = async (req, res, next) => {
    try {
        const token = req.headers.authorization
        if (!token) {
            return next(setError(404, 'Unauthorized'))
        }
        const parsedToken = token.replace('Bearer ', '')
        const validToken = verifyJwt(parsedToken, process.env.JWT_SECRET)
        const userLogued = await User.findById(validToken.id)
        userLogued.password = null
        req.user = userLogued
        next()
    } catch (error) {
        return next(setError(500, "expired or invalid token"))
    }
}

module.exports = { isAuth }