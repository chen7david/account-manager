const Model = require('./Model')

class Code extends Model {

    async $beforeInsert(context){
        await super.$beforeInsert(context)
        this.code = this.numerical(6)
    }

    async $afterFind(context){
        await super.$afterFind(context)
        this.user = await this.$relatedQuery('user').first()
        if(this.device_id) this.device = await this.$relatedQuery('device').first()
    }

    async deactivate(){
        return await this.$query().patch({isActive:false}).returning('*')
    }

    static async getCode(codeType, code){
        const obj = await this.query()
            .where('code', code)
            .andWhere('isActive', true)
            .andWhere('type', codeType)
            .first()
        if(obj) await obj.deactivate()
        return obj
    }

    static async verifyEmailCode(code){
        return this.getCode(0, code)
    }

    static async passwordRecoveryCode(code){
        return this.getCode(1, code)
    }

    static async verifyDeviceCode(code){
        return this.getCode(2, code)
    }

    static async makePrimaryCode(code){
        return this.getCode(3, code)
    }

    static get relationMappings(){   
        
        const User = require('./User')
        const Device = require('./Device')
        
        return {
            user:{
                relation: Model.BelongsToOneRelation,
                modelClass: User,
                join:{
                    from:'codes.user_id',
                    to:'users.id'
                }
            },
            device:{
                relation: Model.BelongsToOneRelation,
                modelClass: Device,
                join:{
                    from:'codes.device_id',
                    to:'devices.id'
                }
            }, 
        }
    }
}

module.exports = Code