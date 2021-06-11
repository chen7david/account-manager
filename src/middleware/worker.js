const { Token, User } = require('../models')
const connections = require('./connections')

module.exports = {

    /* LOADERS */
    
    async loadDevice(ctx, next){
        const useragent = ctx.headers['user-agent']
        if(!useragent) ctx.cargo.state('warning').msg('this device is not supported').error(401)
        ctx.state.$device = await ctx.state.$user.getDevice(useragent)
        return next()
    },
    
    async loadFromUsername(ctx, next){
        const { username } = ctx.request.body
        const user = await User.query()
            .where('username', username)
            .orWhere('email', username)
            .first()
        if(!user) ctx.cargo.original(ctx.request.body).state('validation')
            .loadmsg('username', 'username not found').error(422)
        ctx.state.$user = user
        return next()
    },

    async loadFromAccessToken(ctx, next){
        const { authorization } = ctx.headers
        if(!authorization) ctx.cargo.msg('token required').error(401)
        const result = await Token.verifyAccessToken(authorization.replace('Bearer ', ''))
        if(!result) ctx.cargo.state('error').msg('invalid token format').error(401)
        ctx.state.$user = result.user
        ctx.state.$token = result.token
        await next()
    },

    async loadFromRefreshToken(ctx, next){
        const { refreshToken } = ctx.request.body
        const result = await Token.verifyRefreshToken(refreshToken)
        if(!result) ctx.cargo.state('error').msg('invalid token format').error(401)
        ctx.state.$user = result.user
        ctx.state.$token = result.token
        await next()
    },

    /* CONSTRAINT CHECKS */

    hasAnyRole: (...allowed) => async (ctx, next) => {
        const roles = ctx.state.$user.roles.map(r => r.name)
        const granted = allowed.some(r => roles.includes(r))
        if(!granted) ctx.cargo.state('error').msg('Forbiden route').error(403)
        await next()
    },

    async checkPassword(ctx, next){
        const { password } = ctx.request.body
        if(!await ctx.state.$user.verifyPassword(password)){
            ctx.cargo.original(ctx.request.body).state('validation')
            .loadmsg('password', 'invalid password').error(422)
        }
        return next()
    },

    checkDevice: async (ctx, next) => {
        if(!ctx.state.$user.requiresDeviceCheck) return await next()
        const device = ctx.state.$device
        if(device.isBlocked) ctx.cargo.state('error').msg('device is blocked, login failed!').error(422)
        await next()
    },

    checkEmail: async (ctx, next) => {
        if(!ctx.state.$user.requiresEmailCheck) await next()
        if(!ctx.state.$user.isTrusted) ctx.cargo.state('warning').msg('please verify your email, and try again!').error(422)
        await next()
    },

    swapuseragent: async (ctx, next) => {
        const { socketId } = ctx.request.body
        let connection = connections.get(socketId)
        if(!connection) ctx.cargo.state('warning').msg('qrcode expired!').error(422)
        ctx.headers['user-agent'] = connection.useragent
        await next()
    },
}