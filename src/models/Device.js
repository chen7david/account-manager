const Model = require('./Model')

class Device extends Model {

    async $beforeInsert(context){
        await super.$beforeInsert(context)
        this.deviceId = 'DE' + this.numerical(10)
    }

    async $afterFind(context){
        await super.$afterFind(context)
        const tokens = await this.$relatedQuery('tokens').orderBy('created_at','desc')
        this.tokenCount = tokens.length
        this.tokenUpdatedAt = tokens[0] ? tokens[0].updated_at : null
    }

    async logout(){
        await this.$relatedQuery('tokens').patch({isActive: false})
    }

    async block(){
        return await this.$query().patch({isBlock:true}).returning('*')
    }

    async unblock(){
        return await this.$query().patch({isBlock:false}).returning('*')
    }

    async setToPrimary(){
        const user = await this.$relatedQuery('user')
        await user.$relatedQuery('devices').where('isPrimary', true).patch({isPrimary:false})
        return await this.$query().patch({isPrimary:true}).returning('*')
    }

    async trust(){
        return await this.$query().patch({isTrusted:true}).returning('*')
    }

    async untrust(){
        return await this.$query().patch({isTrusted:false}).returning('*')
    }

    async newDeviceVerificationCode(){
        await this.$relatedQuery('codes').where('type', 2).patch({isActive: false})
        const code = await this.$relatedQuery('codes').insert({type:2, user_id: this.user_id})
        return code
    }

    async newPrimaryDeviceCode(){
        await this.$relatedQuery('codes').where('type', 3).patch({isActive: false})
        const code = await this.$relatedQuery('codes').insert({type:3, user_id: this.user_id})
        return code
    }
    
    static get relationMappings(){   
        
        const User = require('./User')
        const Token = require('./Token')
        const Code = require('./Code')
        
        return {
            user:{
                relation: Model.BelongsToOneRelation,
                modelClass: User,
                join:{
                    from:'devices.user_id',
                    to:'users.id'
                }
            },
            codes:{
                relation: Model.HasManyRelation,
                modelClass: Code,
                join:{
                    from:'devices.id',
                    to:'codes.device_id'
                }
            },
            tokens:{
                relation: Model.HasManyRelation,
                modelClass: Token,
                join:{
                    from:'devices.id',
                    to:'tokens.device_id'
                }
            },
        }
    }
}

module.exports = Device