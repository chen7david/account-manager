const Model = require('./Model')
const bcrypt = require('bcrypt')
const BCRYPT_ROUNDS = 12

class User extends Model {

    async $beforeInsert(context){
        await super.$beforeInsert(context)
        this.userId = 'US' + this.numerical(10)
        if(this.password) this.password = await bcrypt
            .hash(this.password, BCRYPT_ROUNDS)
    }

    async $beforeUpdate(context){
        await super.$beforeInsert(context)
        if(this.password) this.password = await bcrypt
            .hash(this.password, BCRYPT_ROUNDS)
        if(this.email) this.isTrusted = false
    }

    async addRole(id = null){
        if(id) try {
            return await this.$relatedQuery('roles').relate(id)
        } catch (err) {
            return false
        }
        else return false
    }

    async removeRole(id = null){
        if(id) try {
            return await this.$relatedQuery('roles').unrelate().where('role_id', id)
        } catch (err) {
            return false
        }
        else return false
    }

    async getDevice(useragent = ''){
        let device = await this.$relatedQuery('devices')
            .where('useragent', useragent)
            .first()
        if(!device) device = await this.$relatedQuery('devices').insert({useragent})
        return device
    }

    async spawnToken(device = null){
        const token = await this
            .$relatedQuery('tokens')
            .insert({device_id: device.id})
        return token
    }

    async verifyPassword(password){
        return await bcrypt.compare(password, this.password)    
    }

    async trust(){
        return await this.$query().patch({isTrusted:true}).returning('*')
    }

    async untrust(){
        return await this.$query().patch({isTrusted:false}).returning('*')
    }

    async newEmailVerificationCode(){
        await this.$relatedQuery('codes').where('type', 0).patch({isActive: false})
        const code = await this.$relatedQuery('codes').insert({type:0})
        return code
    }

    async newPasswordRecoveryCode(){
        await this.$relatedQuery('codes').where('type', 1).patch({isActive: false})
        const code = await this.$relatedQuery('codes').insert({type:1})
        return code
    }

    static get relationMappings(){
        
        const Role = require('./Role')
        const Token = require('./Token')
        const Device = require('./Device')
        const Code = require('./Code')

        return {
            tokens:{
                relation: Model.HasManyRelation,
                modelClass: Token,
                join:{
                    from:'users.id',
                    to:'tokens.user_id'
                }
            },
            devices:{
                relation: Model.HasManyRelation,
                modelClass: Device,
                join:{
                    from:'users.id',
                    to:'devices.user_id'
                }
            },
            codes:{
                relation: Model.HasManyRelation,
                modelClass: Code,
                join:{
                    from:'users.id',
                    to:'codes.user_id'
                }
            },
            roles: {
                relation: Model.ManyToManyRelation,
                modelClass: Role,
                join: {
                    from: 'users.id',
                    to: 'roles.id',
                    through: {
                        from: 'user_roles.user_id',
                        to: 'user_roles.role_id'
                    }
                }
            }
        }
    }
    
}

module.exports = User