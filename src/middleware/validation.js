const Joi = require('joi')

const schema = {

    createUser: Joi.object().options({ abortEarly: false, stripUnknown: true }).keys({
        username: Joi.string().trim().required(),
        email: Joi.string().min(6).email().trim().required(),
        password: Joi.string().min(6).max(120).required(),
        passwordConfirm: Joi.any().valid(Joi.ref('password')),
    }),

    updateUser: Joi.object().options({ abortEarly: false, stripUnknown: true }).keys({
        email: Joi.string().min(6).trim().email(),
        requiresEmailCheck: Joi.boolean(),
        requiresDeviceCheck: Joi.boolean(),
        isDeveloper: Joi.boolean(),
        isTrusted: Joi.boolean(),
        isSuspended: Joi.boolean(),
        isDisabled: Joi.boolean(),
    }),

    createClient: Joi.object().options({ abortEarly: false, stripUnknown: true }).keys({
        name: Joi.string().trim().required(),
    }),

    login: Joi.object().options({ abortEarly: false, stripUnknown: true }).keys({
        username: Joi.string().trim().required(),
        password: Joi.string().min(6).required(),
    }),

    username: Joi.object().options({ abortEarly: false, stripUnknown: true }).keys({
        username: Joi.string().trim().required(),
    }),

    verificationCode: Joi.object().options({ abortEarly: false, stripUnknown: true }).keys({
        code: Joi.string().trim().required(),
    }),

    passwordRecovery: Joi.object().options({ abortEarly: false, stripUnknown: true }).keys({
        code: Joi.string().trim().required(),
        password: Joi.string().min(6).max(120).required(),
        passwordConfirm: Joi.any().valid(Joi.ref('password')),
    }),

    passwordUpdate: Joi.object().options({ abortEarly: false, stripUnknown: true }).keys({
        password: Joi.string().min(6).max(120).required(),
        passwordConfirm: Joi.any().valid(Joi.ref('password')),
    }),

    updateDevice: Joi.object().options({ abortEarly: false, stripUnknown: true }).keys({
        displayName: Joi.boolean(),
        isTrusted: Joi.boolean(),
        isBlocked: Joi.boolean(),
    }),

    updateRole: Joi.object().options({ abortEarly: false, stripUnknown: true }).keys({
        description: Joi.string().trim(),
    }),

}

const validate = (schema) => async (ctx, next) => {
    try {
        const body = ctx.request.body
        const { error, value } = schema.validate(body)
        if(error) ctx.throw(422, 'JoiValidationError', error)
        ctx.request.body = value
        await next()
    } catch (err) {
        ctx.throw(500, 'SystemError', err) 
    }
}

module.exports = {
    schema, 
    validate
}