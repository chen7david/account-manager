const autobind = require('auto-bind')

class Controller {
    
    constructor(model){
        this.model = model
        this.tableName = model.tableName
        this.modelName = this.constructor.name.toLocaleLowerCase().replace('controller','')
        autobind(this)
    }

    async loadInstance(id, ctx, next){
        const item = await this.model.query().where('id', id).first()
        if(!item) ctx.cargo.msg(`invalid ${this.modelName} id`).error(422)
        ctx.state[this.modelName] = item
        await next()
    }

    async index(ctx){
        const items = await this.model.query() 
        ctx.body = ctx.cargo.payload(items)
    }

    async view(ctx){
        ctx.body = ctx.cargo.payload(ctx.state[this.modelName])
    }

    async create(ctx){
        const item = await this.model.query().insert(ctx.request.body).returning('*')
        ctx.body = ctx.cargo.state('success').payload(item).msg(`${this.modelName} created!`)
    }

    async update(ctx){
        const body = ctx.request.body
        const item = await ctx.state[this.modelName].$query().patch(body).returning('*')
        ctx.body = ctx.cargo.state('success').payload(item).msg(`${this.modelName} updated!`)
    }

    async delete(ctx){
        if(this.modelName == 'user') ctx.app.emit('account:deleted', ctx.state[this.modelName].userId)
        const item = await ctx.state[this.modelName].$query().delete()
        ctx.body = ctx.cargo.state('success').payload(item).msg(`${this.modelName} deleted!`)
    }

    getRelated(relation){
        return async (ctx) => {
            const related = await ctx.state[this.modelName].$relatedQuery(relation)
            ctx.body = ctx.cargo.payload(related)
        }
    }

    getSelfRelated(relation = null){
        return async (ctx) => {
            console.log({self:ctx.state.$user})
            const related = await ctx.state.$user.$relatedQuery(relation || this.tableName)
            ctx.body = ctx.cargo.payload(related)
        }
    }
}

module.exports = Controller