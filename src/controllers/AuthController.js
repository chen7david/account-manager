const Model = require('./BaseController')
const { User, Code, Token } = require('../models')
const connections = require('../middleware/sockets')
const { template, mailer } = require('../middleware/email')

class Auth extends Model {

    async connections(ctx){
        ctx.body = ctx.cargo.payload(connections)
    }

    async getPubKey(ctx){
        ctx.body = ctx.cargo.payload({pubkey: Token.pubkey(), user})
    }

    async renewkeys(ctx){
        // await Token.setKeys()
        ctx.app.emit('keys:updated', Token.pubkey())
        ctx.body = ctx.cargo.msg('key renewal successful')
    }
    
    async authenticate(ctx){
        await ctx.state.$device.logout()
        const token = await ctx.state.$user.spawnToken(ctx.state.$device)
        ctx.body = ctx.cargo.msg(`login was successful, welcome back ${ctx.state.$user.username}`)
            .state('success')
            .payload({
                user: ctx.state.$user,
                device: ctx.state.$device,
                accessToken: token.renderAccessToken(),
                refreshToken: token.renderRefreshToken()
            })
    }

    async qrlogin(ctx){
        const { socketId } = ctx.request.body
        let connection = connections.get(socketId)
        if(!connection) ctx.cargo.state('warning').msg('qrcode expired!').error(422)
        const device = await ctx.state.$user.getDevice(connection.useragent)
        await device.logout()
        if(device.isBlocked) ctx.cargo.state('danger').msg('scanned device is blocked, login failed!').error(422)
        const token = await ctx.state.$user.spawnToken(device)
        ctx.app.emit('account:login', {socketId, loginInfo: {
            user: ctx.state.$user,
            device: ctx.state.$device,
            accessToken: token.renderAccessToken(),
            refreshToken: token.renderRefreshToken()
        }})
        ctx.body = ctx.cargo.state('success').msg('login successful')
    }

    async refresh(ctx){
        ctx.body = ctx.cargo.payload({
            user: ctx.state.$user,
            device: ctx.state.$device,
            accessToken: ctx.state.$token.renderAccessToken(),
        })
    }

    async sendEmailVerification(ctx){
        if(ctx.state.$user.isTrusted) ctx.cargo.state('warning')
            .msg(`${ctx.state.$user.email} is already verifified, please proceed to login`).error(422)
        const code = await ctx.state.$user.newEmailVerificationCode()
        await mailer
            .to(ctx.state.$user.email)
            .subject('Email-Verification: Please verify this email')
            .body(template('verify_email.html', {code:code.code}))
            .send()
        ctx.body = ctx.cargo.state('success').msg(`Email verification code has been emailed to ${ctx.state.$user.email}`)
    }

    async verifyEmail(ctx){
        const code = await Code.verifyEmailCode(ctx.request.body.code)
        if(!code) ctx.cargo.original(ctx.request.body).state('validation')
        .loadmsg('code', 'invalid code').error(422)
        await code.user.trust()
        ctx.body = ctx.cargo.msg('Email verification complete')
    }

    async sendPasswordRecovery(ctx){
        const code = await ctx.state.$user.newPasswordRecoveryCode()
        await mailer
            .to(ctx.state.$user.email)
            .subject('Password Revocery Code')
            .body(template('recover_password.html', {code:code.code}))
            .send()
        ctx.body = ctx.cargo.state('success').msg(`Password recovery email sent to ${ctx.state.$user.email}`)
    }

    async recoverPassword(ctx){
        const { password } = ctx.request.body
        const code = await Code.passwordRecoveryCode(ctx.request.body.code)
        if(!code) ctx.cargo.original(ctx.request.body).state('validation')
            .loadmsg('code', 'Invalid code').error(422)
        await code.user.$query().patch({password})
        ctx.body = ctx.cargo.state('success').msg('Password recovery complete')
    }

    async sendDeviceVerification(ctx){
        const code = await ctx.state.$device.newDeviceVerificationCode()
        await mailer
            .to(ctx.state.$user.email)
            .subject('Device Verification Code')
            .body(template('verify_device.html', {code:code.code}))
            .send()
        ctx.body = ctx.cargo.state('success').msg(`Device verification email sent to ${ctx.state.$user.email}`)
    }

    async verifyDevice(ctx){
        const code = await Code.verifyDeviceCode(ctx.request.body.code)
        if(!code) ctx.cargo.original(ctx.request.body).state('validation')
        .loadmsg('code', 'invalid code').error(422)
        await code.device.trust()
        ctx.body = ctx.cargo.msg('Device verification complete')
    }

    async sendMakePrimaryDevice(ctx){
        if(ctx.state.$device.isPrimary) ctx.cargo.state('warning')
            .msg(`this device is already registered as your primary device!`).error(422)
        const code = await ctx.state.$device.newPrimaryDeviceCode()
        await mailer
            .to(ctx.state.$user.email)
            .subject('Set Primary Device')
            .body(template('make_primary_device.html', {code:code.code}))
            .send()
        ctx.body = ctx.cargo.state('success').msg(`A verification code has been emailed to ${ctx.state.$user.email}`)
    }

    async makePrimaryDevice(ctx){
        const code = await Code.makePrimaryCode(ctx.request.body.code)
        if(!code) ctx.cargo.original(ctx.request.body).state('validation')
        .loadmsg('code', 'invalid code').error(422)
        await code.device.setToPrimary()
        ctx.body = ctx.cargo.state('info').msg('This device is now set to your primary device!')
    }
}

module.exports = new Auth(User)