const Model = require('./BaseController')
const { User } = require('./../models')
const { template, mailer } = require('../middleware/email')

class UserController extends Model {

    async loadInstance(id, ctx, next){
        const item = await this.model.query().where('userId', id).first()
        if(!item) ctx.cargo.msg(`invalid ${this.modelName} id`).error(422)
        ctx.state[this.modelName] = item
        await next()
    }

    async getSelf(ctx){
        ctx.body = ctx.cargo.payload(ctx.state.$user)
    }

    async create(ctx){
        const user = await this.model.query().insert(ctx.request.body).returning('*')
        const code = await user.newEmailVerificationCode()
        await mailer
            .to(user.email)
            .subject('Email-Verification: Please verify this email')
            .body(template('recover_password.html',{code:code.code}))
            .send()
        ctx.body = ctx.cargo.payload(user).status(201).msg(`user created!, verification email sent to: ${user.email}`)
    }

    async sycnRoles(ctx){
        const { roleIds } = ctx.request.body
        console.log({userx: ctx.state})
        await ctx.state.user.$sync('roles', roleIds)
        console.log({roleIds, user: ctx.state})
        ctx.body = ctx.cargo.payload(roleIds).status(201).msg(`roles updated!`)
    }

    async addRole(ctx){
        const { roleId } = ctx.request.body
        const result = await ctx.state.user.addRole(roleId)
        if(!result) ctx.cargo.status('warning').msg(`update failed!`).error(422)
        ctx.body = ctx.cargo.payload(roleId).status(201).msg(`roles updated!`)
    }

    async removeRole(ctx){
        const { roleId } = ctx.request.body
        const result = await ctx.state.user.removeRole(roleId)
        if(!result) ctx.cargo.status('warning').msg(`update failed!`).error(422)
        ctx.body = ctx.cargo.payload(roleIds).status(201).msg(`roles updated!`)
    }
    
}

module.exports = new UserController(User)