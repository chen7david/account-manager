const { ValidationError } = require('joi')
const { UniqueViolationError } = require('objection')
const { JsonWebTokenError } = require('jsonwebtoken')

module.exports = async (err, ctx, next) => {

    if(err instanceof ValidationError){
        const { details, _original } = err
        ctx.cargo.original(_original).state('validation').status(422)
        details.map(d => ctx.cargo.loadmsg(d.context.key, d.message))
        ctx.cargo
    }
    
    if(err instanceof UniqueViolationError){
        let key = err.columns.pop()
        ctx.cargo.original(ctx.request.body).state('validation').status(422)
        ctx.cargo.loadmsg(key, `this ${key} is already taken`)
    }
    
    if(err instanceof JsonWebTokenError){
        if(err.message == 'invalid signature') ctx.cargo.status(401).msg('invalid token signature')
        if(err.message == 'invalid algorithm') ctx.cargo.status(401).msg('invalid token signature')
        if(err.message == 'invalid token') ctx.cargo.status(401).msg('invalid token format')
        if(err.message == 'invalid token format!') ctx.cargo.status(401).msg('invalid token format')
        if(err.message == 'jwt expired') ctx.cargo.status(401).msg('token expired')
        if(err.message == 'jwt malformed') ctx.cargo.status(401).msg('invalid token format')
        if(err.message == 'jwt must be provided') ctx.cargo.status(401).msg('token missing')
    }

    /* DEFAULT EXCEPTION MUTATOR */
    if(Object.keys(ctx.cargo.details).length == 0){
        const serial = Math.floor(100000 + Math.random() * 999999)
        ctx.cargo.serial(serial).state('error').msg(`unknow error - ER${serial}`).status(500)
    }
}