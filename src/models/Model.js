const { env } = require('config')
const knex = require('knex')(require('./../../knexfile')[env])
const { Model } = require('objection')
const pluralize = require('pluralize')
Model.knex(knex)


class BaseModel extends Model {

    static get tableName() {
        return pluralize(this.name.toLowerCase())
    }

    numerical(size = 6){
        const array = new Array(size -1)
        const zeros = array.fill(0).join('')
        const first = parseInt(`1${zeros}`)
        const second = parseInt(`9${zeros}`)
        return Math.floor(first + Math.random() * second)
    }
    
    $formatJson(json) {
        json = super.$formatJson(json)
        delete json.user_id
        delete json.password
        return json
    }
}

module.exports  = BaseModel