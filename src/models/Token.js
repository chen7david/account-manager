const { refresh: {secret, expiry}, access } = require('config').token
const { Cryper } = require('cryper')
const cryper = new Cryper({expiresIn: access.expiry})
const Model = require('./Model')
const JWT = require('jsonwebtoken')

class Token extends Model {

    static pubkey(){
        return cryper.pubkey()
    }

    static setKeys(){
        return cryper.setKeys()
    }

    async $beforeInsert(context){
        await super.$beforeInsert(context)
        this.tokenId = 'TO' + this.numerical(10)
    }

    async $afterFind(context){
        await super.$afterFind(context)
    }

    async $afterInsert(context){
        await super.$afterInsert(context)
        this.user = await this.$relatedQuery('user').first()
        this.user.roles = await this.user.$relatedQuery('roles')
        this.device = await this.$relatedQuery('device').first()
    }

    renderAccessToken(){
        const {tokenId, user:{ userId, roles }} = this
        const payload = { tokenId, userId, roles: roles.map(e => e.name) }
        if(this.user.isDeveloper) payload.isDeveloper = true
        if(this.device.isPrimary) payload.isPrimary = true
        if(this.device.isTrusted) payload.isTrusted = true
        const token = cryper.sign(payload)
        return token
    }

    renderRefreshToken(){
        const {tokenId, user:{ userId, password }} = this
        const payload = { refresh: true, tokenId, userId }
        const token = JWT.sign(payload, secret + password, {expiresIn: expiry}) 
        return token
    }

    static async load(tokenId = ''){
        const token = await this.query().where('tokenId', tokenId).first()
        if(!token) return null
        token.user = await token.$relatedQuery('user').first()
        token.user.roles = await token.user.$relatedQuery('roles')
        token.device = await token.$relatedQuery('device').first()
        return token
    }

    static async verifyAccessToken(accessToken = ''){
        const result = JWT.verify(accessToken, cryper.pubkey())
        const token = await this.load(result.tokenId)
        return token ? { token, user: token.user} : null
    }

    static async verifyRefreshToken(refreshToken = ''){
        const result = JWT.decode(refreshToken)
        if(!result || result && !result.userId) return null
        const token = await this.load(result.tokenId)
        if(!token) return null
        const user = await token.$relatedQuery('user').first()
        JWT.verify(refreshToken, secret + user.password)        
        return { token, user: token.user }
    }

    async addToScreenTime(duration){
        this.screenTime += duration
        return await this.$query().patch({screenTime: this.screenTime}).returning('*')
    }

    async incrementRefresh(){
        const refreshCount = this.refreshCount + 1
        return await this.$query().patch({refreshCount}).returning('*')
    }

    async logout(){
        return await this.$query().patch({active:false}).returning('*')
    }

    async revoke(){
        return await this.$query().patch({revoked:true}).returning('*')
    }
    
    static get relationMappings(){   
        
        const User = require('./User')
        const Device = require('./Device')
        
        return {
            user:{
                relation: Model.BelongsToOneRelation,
                modelClass: User,
                join:{
                    from:'tokens.user_id',
                    to:'users.id'
                }
            },
            device:{
                relation: Model.BelongsToOneRelation,
                modelClass: Device,
                join:{
                    from:'tokens.device_id',
                    to:'devices.id'
                }
            }, 
        }
    }
}

module.exports = Token